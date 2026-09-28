"use client";

import { useStore } from "@/components/store/StoreProvider";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import type { Product } from "@/lib/types";

/** The one client island on the product page. Everything else there is static. */
export function AddToCartButton({
  product,
  variant = "blaze",
  size = "md",
  className,
  label = "Add to cart",
}: {
  product: Product;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  label?: string;
}) {
  const { add } = useStore();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => add(product)}
    >
      {label}
    </Button>
  );
}
