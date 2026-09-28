"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ArtKey, Product } from "@/lib/types";

/**
 * Cart, toast and drawer state.
 *
 * The cart line carries its own name, price and art rather than a product id
 * the drawer looks up later. Two reasons: the drawer does not need the whole
 * catalog shipped to the client, and a line keeps the price it was added at,
 * which is what a real cart does.
 *
 * There is no checkout. There is no database. That is deliberate — see the
 * README. Adding Payload later does not touch this file.
 */

export interface CartLine {
  id: string;
  name: string;
  category: string;
  price: number;
  art: ArtKey;
  qty: number;
}

type DrawerName = "cart" | "menu" | null;

interface StoreValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product) => void;
  /** Adds several lines at once and confirms once, so a kit is one action. */
  addMany: (products: Product[], message: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  drawer: DrawerName;
  openDrawer: (name: Exclude<DrawerName, null>) => void;
  closeDrawer: () => void;
  toastMessage: string | null;
  toast: (message: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const STORAGE_KEY = "ninebark.cart";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawer, setDrawer] = useState<DrawerName>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  /* localStorage is read after mount, never during render, so the server HTML
     and the first client render always agree. */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed as CartLine[]);
      }
    } catch {
      // Private window, cleared storage, blocked cookies. An empty cart is fine.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Nothing to do. The cart still works for this page view.
    }
  }, [lines, hydrated]);

  const openDrawer = useCallback((name: Exclude<DrawerName, null>) => {
    returnFocusTo.current = document.activeElement as HTMLElement | null;
    setDrawer(name);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer(null);
    returnFocusTo.current?.focus?.();
    returnFocusTo.current = null;
  }, []);

  /* Escape closes, and the page behind the scrim does not scroll. */
  useEffect(() => {
    if (!drawer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [drawer, closeDrawer]);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3400);
  }, []);

  const append = useCallback((current: CartLine[], products: Product[]): CartLine[] => {
    const next = [...current];
    for (const product of products) {
      const index = next.findIndex((line) => line.id === product.id);
      if (index >= 0) {
        next[index] = { ...next[index], qty: next[index].qty + 1 };
      } else {
        next.push({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          art: product.art,
          qty: 1,
        });
      }
    }
    return next;
  }, []);

  const add = useCallback<StoreValue["add"]>(
    (product) => {
      setLines((current) => append(current, [product]));
      openDrawer("cart");
      toast(`${product.name} added to cart`);
    },
    [append, openDrawer, toast],
  );

  const addMany = useCallback<StoreValue["addMany"]>(
    (products, message) => {
      if (products.length === 0) return;
      setLines((current) => append(current, products));
      openDrawer("cart");
      toast(message);
    },
    [append, openDrawer, toast],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setLines((current) =>
      qty < 1
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, qty } : line)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    return {
      lines,
      count,
      subtotal,
      add,
      addMany,
      setQty,
      remove,
      drawer,
      openDrawer,
      closeDrawer,
      toastMessage,
      toast,
    };
  }, [
    lines,
    add,
    addMany,
    setQty,
    remove,
    drawer,
    openDrawer,
    closeDrawer,
    toastMessage,
    toast,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside <StoreProvider>");
  return value;
}
