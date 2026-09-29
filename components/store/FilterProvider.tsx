"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Ground, GroundId, Group, GroupId } from "@/lib/types";

/**
 * Catalog filter state, mirrored into the URL.
 *
 * It lives in a provider because two sections drive the same grid: the ground
 * picker sits directly above the grid on `/shop`, and the category chips sit
 * above the grid itself. The header search writes to it as well.
 *
 * ── Why the URL ──────────────────────────────────────────────────────────────
 *
 * Filters used to be plain `useState`, so a filtered view had no address: you
 * could not link a colleague to "outerwear for timber", and a refresh dropped
 * you back to all twelve products. They now live in `?ground=` / `?group=` /
 * `?q=`, which also means the header mega-menu links land on a filtered grid
 * instead of relying on state that survives a soft navigation by luck.
 *
 * ── Why it is split in two ───────────────────────────────────────────────────
 *
 * READING the URL is a `<Suspense>`-wrapped leaf (`UrlToState`). Under
 * `output: "export"` a `useSearchParams()` call suspends during prerender and
 * the nearest boundary's *fallback* is what gets serialised into the static
 * HTML. This boundary's fallback is `null`, so nothing is lost — which is the
 * whole point: `/shop/index.html` still ships all twelve product cards, and
 * filtering is progressive enhancement on top. Wrapping the provider itself
 * would have replaced the header, footer and grid with the fallback in the
 * exported HTML.
 *
 * WRITING is `history.replaceState`, which Next 16 patches so it updates the
 * address bar *and* keeps `useSearchParams` in sync, without a navigation, a
 * network fetch, or a scroll change. `router.replace` would be a real
 * navigation with a segment-cache miss for every search string it has not seen,
 * and a hard-reload fallback if the RSC fetch for it fails.
 */

export type GroundFilter = GroundId | "all";
export type GroupFilter = GroupId | "all";

interface Filters {
  ground: GroundFilter;
  group: GroupFilter;
  query: string;
}

interface FilterValue {
  ground: GroundFilter;
  group: GroupFilter;
  query: string;
  grounds: Ground[];
  groups: Group[];
  setGround: (ground: GroundFilter) => void;
  setGroup: (group: GroupFilter) => void;
  /** Updates state only. The URL is written on submit via `commitQuery`. */
  setQuery: (query: string) => void;
  /** Writes the current filters, query included, to the address bar. */
  commitQuery: () => void;
  clear: () => void;
}

const FilterContext = createContext<FilterValue | null>(null);

const DEFAULTS: Filters = { ground: "all", group: "all", query: "" };

const PARAM = { ground: "ground", group: "group", query: "q" } as const;

/** A hand-edited `?group=nonsense` falls back to unfiltered, not to an empty grid. */
function readGround(raw: string | null, grounds: Ground[]): GroundFilter {
  if (!raw) return "all";
  return grounds.some((entry) => entry.id === raw) ? (raw as GroundFilter) : "all";
}

function readGroup(raw: string | null, groups: Group[]): GroupFilter {
  if (!raw) return "all";
  return groups.some((entry) => entry.id === raw) ? (raw as GroupFilter) : "all";
}

function same(a: Filters, b: Filters): boolean {
  return a.ground === b.ground && a.group === b.group && a.query === b.query;
}

export function FilterProvider({
  grounds,
  groups,
  children,
}: {
  grounds: Ground[];
  groups: Group[];
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const pathname = usePathname();

  // Mirrors state so that two calls in one tick (GroundPicker sets ground AND
  // resets group) compose instead of the second clobbering the first with stale
  // values. Also lets a setter build the URL without waiting for a re-render.
  const current = useRef<Filters>(DEFAULTS);

  // The search string this provider last wrote. The reader compares against it
  // so our own write does not come back around as an external change.
  const lastWritten = useRef<string | null>(null);

  const hrefFor = useCallback(
    (next: Filters) => {
      const params = new URLSearchParams();
      if (next.ground !== "all") params.set(PARAM.ground, next.ground);
      if (next.group !== "all") params.set(PARAM.group, next.group);
      const q = next.query.trim();
      if (q) params.set(PARAM.query, q);
      const qs = params.toString();
      return { qs, href: qs ? `${pathname}?${qs}` : pathname };
    },
    [pathname],
  );

  const write = useCallback(
    (next: Filters) => {
      const { qs, href } = hrefFor(next);
      lastWritten.current = qs;
      window.history.replaceState(null, "", href);
    },
    [hrefFor],
  );

  const apply = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...current.current, ...patch };
      current.current = next;
      setFilters(next);
      write(next);
    },
    [write],
  );

  /** URL -> state. Called by the reader only, never from an event handler. */
  const adopt = useCallback(
    (params: URLSearchParams) => {
      const next: Filters = {
        ground: readGround(params.get(PARAM.ground), grounds),
        group: readGroup(params.get(PARAM.group), groups),
        query: params.get(PARAM.query) ?? "",
      };
      current.current = next;
      lastWritten.current = params.toString();
      setFilters((prev) => (same(prev, next) ? prev : next));
    },
    [grounds, groups],
  );

  const value = useMemo<FilterValue>(
    () => ({
      ground: filters.ground,
      group: filters.group,
      query: filters.query,
      grounds,
      groups,
      setGround: (ground) => apply({ ground }),
      setGroup: (group) => apply({ group }),
      // Query is the one filter that does NOT write on change: the header calls
      // this per keystroke, and each write would dispatch a router restore.
      setQuery: (query) => {
        const next = { ...current.current, query };
        current.current = next;
        setFilters(next);
      },
      commitQuery: () => write(current.current),
      clear: () => apply(DEFAULTS),
    }),
    [filters, grounds, groups, apply, write],
  );

  return (
    <FilterContext.Provider value={value}>
      <Suspense fallback={null}>
        <UrlToState lastWritten={lastWritten} adopt={adopt} />
      </Suspense>
      {children}
    </FilterContext.Provider>
  );
}

/**
 * Renders nothing. Exists only so `useSearchParams` has a boundary to suspend
 * against during prerender, and so every change to the URL — a hard load, a
 * soft navigation from the mega-menu, back/forward — reaches the filters.
 *
 * A `useEffect` keyed on the pathname could not do this: navigating from
 * `/shop/?group=a` to `/shop/?group=b` does not change the pathname, and the
 * App Router exposes no navigation event to observe it.
 */
function UrlToState({
  lastWritten,
  adopt,
}: {
  lastWritten: React.RefObject<string | null>;
  adopt: (params: URLSearchParams) => void;
}) {
  const params = useSearchParams();
  const search = params.toString();

  useEffect(() => {
    if (lastWritten.current === search) return;
    adopt(params);
  }, [search, params, lastWritten, adopt]);

  return null;
}

export function useFilters(): FilterValue {
  const value = useContext(FilterContext);
  if (!value) throw new Error("useFilters must be used inside <FilterProvider>");
  return value;
}

/** The one place that decides whether a product passes the current filters. */
export function matchesFilters(
  product: {
    name: string;
    category: string;
    group: GroupId;
    grounds: GroundId[];
    specs: { k: string; v: string }[];
  },
  filters: { ground: GroundFilter; group: GroupFilter; query: string },
): boolean {
  if (filters.ground !== "all" && !product.grounds.includes(filters.ground)) return false;
  if (filters.group !== "all" && product.group !== filters.group) return false;

  const q = filters.query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    product.name,
    product.category,
    product.group,
    ...product.grounds,
    ...product.specs.map((spec) => `${spec.k} ${spec.v}`),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}
