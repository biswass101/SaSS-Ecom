import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

const EMPTY_CART_ITEMS: CartItem[] = []

interface CartState {
  items: Record<string, CartItem[]>
  addItem: (storeSlug: string, product: Product, quantity?: number) => void
  removeItem: (storeSlug: string, productId: string) => void
  updateQuantity: (storeSlug: string, productId: string, quantity: number) => void
  clearCart: (storeSlug: string) => void
  getItems: (storeSlug: string) => CartItem[]
  getItemCount: (storeSlug: string) => number
  getSubtotal: (storeSlug: string) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},

      addItem: (storeSlug, product, quantity = 1) =>
        set((state) => {
          const storeItems = [...(state.items[storeSlug] ?? [])]
          const existing = storeItems.findIndex(
            (i) => i.productId === product.id,
          )
          if (existing >= 0) {
            storeItems[existing] = {
              ...storeItems[existing],
              quantity: storeItems[existing].quantity + quantity,
            }
          } else {
            storeItems.push({ productId: product.id, product, quantity })
          }
          return { items: { ...state.items, [storeSlug]: storeItems } }
        }),

      removeItem: (storeSlug, productId) =>
        set((state) => ({
          items: {
            ...state.items,
            [storeSlug]: (state.items[storeSlug] ?? []).filter(
              (i) => i.productId !== productId,
            ),
          },
        })),

      updateQuantity: (storeSlug, productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: {
                ...state.items,
                [storeSlug]: (state.items[storeSlug] ?? []).filter(
                  (i) => i.productId !== productId,
                ),
              },
            }
          }
          return {
            items: {
              ...state.items,
              [storeSlug]: (state.items[storeSlug] ?? []).map((i) =>
                i.productId === productId ? { ...i, quantity } : i,
              ),
            },
          }
        }),

      clearCart: (storeSlug) =>
        set((state) => ({
          items: { ...state.items, [storeSlug]: [] },
        })),

      getItems: (storeSlug) => get().items[storeSlug] ?? EMPTY_CART_ITEMS,

      getItemCount: (storeSlug) =>
        (get().items[storeSlug] ?? []).reduce((s, i) => s + i.quantity, 0),

      getSubtotal: (storeSlug) =>
        (get().items[storeSlug] ?? []).reduce(
          (s, i) => s + i.product.price * i.quantity,
          0,
        ),
    }),
    { name: 'cart-storage' },
  ),
)
