"use client";

import * as React from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
  variationLabel: string | null;
  variationValue: string | null;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "REMOVE_ITEM"; key: string }
  | { type: "SET_QUANTITY"; key: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "SET_OPEN"; open: boolean };

function cartItemKey(item: Pick<CartItem, "productId" | "variationValue">) {
  return `${item.productId}::${item.variationValue ?? "default"}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };
    case "SET_OPEN":
      return { ...state, isOpen: action.open };
    case "ADD_ITEM": {
      const key = cartItemKey(action.item);
      const existing = state.items.find((i) => cartItemKey(i) === key);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + action.quantity, existing.maxStock);
        return {
          ...state,
          items: state.items.map((i) => (cartItemKey(i) === key ? { ...i, quantity: nextQuantity } : i)),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: Math.min(action.quantity, action.item.maxStock) }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => cartItemKey(i) !== action.key) };
    case "SET_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((i) => (cartItemKey(i) === action.key ? { ...i, quantity: Math.max(0, Math.min(action.quantity, i.maxStock)) } : i))
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (item: Pick<CartItem, "productId" | "variationValue">) => void;
  setQuantity: (item: Pick<CartItem, "productId" | "variationValue">, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "brubellys.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(cartReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {
      // localStorage indisponível (modo privado etc.) — carrinho começa vazio
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    // Só persiste depois que a hidratação inicial terminou — senão este efeito
    // roda no mesmo commit do mount com o `state.items` ainda vazio (closure
    // antiga) e sobrescreve o carrinho salvo antes do HYDRATE acima renderizar.
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignora falha de escrita
    }
  }, [state.items, hydrated]);

  const value = React.useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotalCents = state.items.reduce((sum, i) => sum + i.quantity * i.unitPriceCents, 0);

    return {
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      subtotalCents,
      addItem: (item, quantity = 1) => dispatch({ type: "ADD_ITEM", item, quantity }),
      removeItem: (item) => dispatch({ type: "REMOVE_ITEM", key: cartItemKey(item) }),
      setQuantity: (item, quantity) => dispatch({ type: "SET_QUANTITY", key: cartItemKey(item), quantity }),
      clear: () => dispatch({ type: "CLEAR" }),
      setOpen: (open) => dispatch({ type: "SET_OPEN", open }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
