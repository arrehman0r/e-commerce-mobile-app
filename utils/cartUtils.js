import { addLineItem } from "../services/api";

/**
 * Get the total quantity of all items in cart
 */
export const getTotalCartCount = (cart = {}) => {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
};

/**
 * Get quantity of specific variant in cart
 */
export const getVariantQuantity = (cart = {}, variantId) => {
  return cart[variantId] || 0;
};

/**
 * Check if a product has any variant in cart
 */
export const hasProductInCart = (cart = {}, product) => {
  return product.variants.some(variant => cart[variant.id] > 0);
};

/**
 * Calculate total price for items in cart
 */
export const calculateCartTotal = (cart = {}, groceryItems = []) => {
  return Object.entries(cart).reduce((total, [variantId, quantity]) => {
    const product = groceryItems.find(item =>
      item.variants.some(variant => variant.id === variantId)
    );

    if (!product) return total;

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant?.calculated_price) return total;

    return total + (variant.calculated_price.calculated_amount * quantity);
  }, 0);
};

/**
 * Format price with currency
 */
export const formatPrice = (amount, currencyCode = 'PKR') => {
  const roundedAmount = Number(amount).toFixed(0);
  return `${currencyCode.toUpperCase()} ${roundedAmount}`;
};

/**
 * Get variant display info
 */
export const getVariantInfo = (variant) => {
  const optionValue = variant.options[0]?.value || variant.title;
  const price = variant.calculated_price?.calculated_amount || 0;
  const currencyCode = variant.calculated_price?.currency_code || 'PKR';

  return {
    title: optionValue,
    price: formatPrice(price, currencyCode),
    inStock: variant.manage_inventory,
    hasDiscount: variant.calculated_price?.calculated_amount < variant.calculated_price?.original_amount
  };
};



export const addMultipleLineItems = async (cartId, lineItems) => {
  try {
    // Map through line items and make API calls in parallel
    const promises = lineItems.map(item => addLineItem(cartId, item));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error adding multiple line items:', error);
    throw error;
  }
};