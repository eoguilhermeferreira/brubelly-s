"use client";

import * as React from "react";

import { useCart } from "@/components/cart/cart-provider";

/** Usado na página de sucesso do checkout para esvaziar o carrinho após o pedido. */
export function ClearCartOnMount() {
  const { clear } = useCart();
  const cleared = React.useRef(false);

  React.useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    clear();
  }, [clear]);

  return null;
}
