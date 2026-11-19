'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string, customizationNotes?: string) => void;
  updateQuantity: (variantId: string, quantity: number, customizationNotes?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalMinor: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  mounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'jotg_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore localStorage quota errors
      }
    }
  }, [items, mounted]);

  const getItemKey = (item: CartItem | { variantId: string; customization?: { additionalNotes?: string; playerName?: string; playerNumber?: string } }) => {
    const c = item.customization;
    return `${item.variantId}_${c?.playerName || ''}_${c?.playerNumber || ''}_${c?.additionalNotes || ''}`;
  };

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const newKey = getItemKey(newItem);
      const existingIndex = prev.findIndex((i) => getItemKey(i) === newKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (variantId: string, keySuffix?: string) => {
    setItems((prev) =>
      prev.filter((i) => {
        if (keySuffix) {
          return getItemKey(i) !== `${variantId}_${keySuffix}`;
        }
        return i.variantId !== variantId;
      })
    );
  };

  const updateQuantity = (variantId: string, quantity: number, keySuffix?: string) => {
    if (quantity <= 0) {
      removeItem(variantId, keySuffix);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        const matches = keySuffix
          ? getItemKey(i) === `${variantId}_${keySuffix}`
          : i.variantId === variantId;
        return matches ? { ...i, quantity } : i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotalMinor = items.reduce(
    (acc, curr) =>
      acc + (curr.unitPriceMinor + (curr.customization?.customizationFeeMinor || 0)) * curr.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalMinor,
        isCartOpen,
        setIsCartOpen,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
