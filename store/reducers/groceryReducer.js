import {
  ADD_TO_CART,
  ADD_GROCERY_ITEM,
  CLEAR_FROM_CART,
  REMOVE_FROM_CART,
  REMOVE_GROCERY_ITEM,
} from "../actions/types";

export const INITIAL_STATE = {
  groceryItems: [], // Store entire product objects including variants
  cart: {},        // Store variant IDs and quantities
};

const groceryReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case ADD_GROCERY_ITEM: {
      // Check if product already exists
      const existingProduct = state.groceryItems.find(item => item.id === payload.id);
      if (existingProduct) {
        // If product exists, check if we need to update any variants
        const updatedItems = state.groceryItems.map(item => 
          item.id === payload.id 
            ? { ...item, variants: payload.variants }
            : item
        );
        return {
          ...state,
          groceryItems: updatedItems,
        };
      }

      // If product doesn't exist, add it
      return {
        ...state,
        groceryItems: [...state.groceryItems, payload],
      };
    }

    case REMOVE_GROCERY_ITEM: {
      // Remove product and its variants from cart
      const updatedCart = { ...state.cart };
      const productToRemove = state.groceryItems.find(item => item.id === payload.id);
      
      if (productToRemove) {
        productToRemove.variants.forEach(variant => {
          delete updatedCart[variant.id];
        });
      }

      return {
        ...state,
        groceryItems: state.groceryItems.filter(item => item.id !== payload.id),
        cart: updatedCart,
      };
    }

    case ADD_TO_CART: {
      const { variantId, quantity } = payload;
      const newCart = { ...state.cart };

      // Find the product and variant to validate
      const product = state.groceryItems.find(item => 
        item.variants.some(v => v.id === variantId)
      );
      const variant = product?.variants.find(v => v.id === variantId);

      if (!variant) return state;

      // Check inventory if managed
      if (variant.manage_inventory) {
        // Here you might want to check against actual inventory levels
        // For now, we'll just add the quantity
        newCart[variantId] = (newCart[variantId] || 0) + quantity;
      } else if (!variant.allow_backorder) {
        // If backorder not allowed, only allow one
        newCart[variantId] = 1;
      } else {
        // If backorder allowed or inventory not managed
        newCart[variantId] = (newCart[variantId] || 0) + quantity;
      }

      return {
        ...state,
        cart: newCart,
      };
    }

    case REMOVE_FROM_CART: {
      const { variantId, quantity } = payload;
      const updatedCart = { ...state.cart };

      if (updatedCart[variantId]) {
        if (updatedCart[variantId] > quantity) {
          updatedCart[variantId] -= quantity;
        } else {
          delete updatedCart[variantId];
        }
      }

      return {
        ...state,
        cart: updatedCart,
      };
    }

    case CLEAR_FROM_CART:
      return {
        ...state,
        cart: {},
      };

    default:
      return state;
  }
};

export default groceryReducer;