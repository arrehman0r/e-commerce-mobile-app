export const calculateCartTotal = (items) => {
    return items.reduce((sum, item) => {
      const itemTotal = item.variants.reduce((variantSum, variant) => {
        const variantPrice = variant.prices ? (variant.prices[1]?.amount || variant.prices[0].amount) : 0;
        return variantSum + variant.quantity * variantPrice;
      }, 0);
      return sum + itemTotal;
    }, 0);
  };
  