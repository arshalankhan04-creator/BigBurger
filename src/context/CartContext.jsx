import { createContext, useContext, useReducer, useCallback } from 'react'

// ─── State shape ──────────────────────────────────────────────────
// cart: [{ id, name, price, image, qty }]
// isOpen: boolean

const initialState = {
  items: [],
  isOpen: false,
}

// ─── Reducer ──────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, qty: i.qty + (action.payload.qty ?? 1) }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: action.payload.qty ?? 1 }],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      }

    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      }
    }

    case 'CLEAR':
      return { ...state, items: [] }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem    = useCallback((product, qty = 1) =>
    dispatch({ type: 'ADD_ITEM', payload: { ...product, qty } }), [])

  const removeItem = useCallback((id) =>
    dispatch({ type: 'REMOVE_ITEM', payload: id }), [])

  const updateQty  = useCallback((id, qty) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }), [])

  const clearCart  = useCallback(() =>
    dispatch({ type: 'CLEAR' }), [])

  const openCart   = useCallback(() =>
    dispatch({ type: 'OPEN_CART' }), [])

  const closeCart  = useCallback(() =>
    dispatch({ type: 'CLOSE_CART' }), [])

  const toggleCart = useCallback(() =>
    dispatch({ type: 'TOGGLE_CART' }), [])

  // Derived values
  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal   = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
