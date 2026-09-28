"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Ground, GroundId, Group, GroupId } from "@/lib/types";

/**
 * Catalog filter state.
 *
 * It lives in a provider because two sections drive the same grid: the ground
 * picker sits above the layering system ("Step 1"), and the category chips sit
 * above the grid itself ("Step 3"). The header search writes to it as well.
 */

export type GroundFilter = GroundId | "all";
export type GroupFilter = GroupId | "all";

interface FilterValue {
  ground: GroundFilter;
  group: GroupFilter;
  query: string;
  grounds: Ground[];
  groups: Group[];
  setGround: (ground: GroundFilter) => void;
  setGroup: (group: GroupFilter) => void;
  setQuery: (query: string) => void;
  clear: () => void;
}

const FilterContext = createContext<FilterValue | null>(null);

export function FilterProvider({
  grounds,
  groups,
  children,
}: {
  grounds: Ground[];
  groups: Group[];
  children: React.ReactNode;
}) {
  const [ground, setGround] = useState<GroundFilter>("all");
  const [group, setGroup] = useState<GroupFilter>("all");
  const [query, setQuery] = useState("");

  const value = useMemo<FilterValue>(
    () => ({
      ground,
      group,
      query,
      grounds,
      groups,
      setGround,
      setGroup,
      setQuery,
      clear: () => {
        setGround("all");
        setGroup("all");
        setQuery("");
      },
    }),
    [ground, group, query, grounds, groups],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
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
