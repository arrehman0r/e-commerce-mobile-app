import { useDispatch } from 'react-redux';
import { addGroceryItem, addToCart, removeFromCart } from "../store/actions/grocery"

export const useQuantityHandler = () => {
  const dispatch = useDispatch();

  const handleQuantityChange = (type, selectedVariant, product) => {
    if (!selectedVariant) return;

    if (type === "MINUS") {
      dispatch(removeFromCart(selectedVariant.id, 1));
    } else if (type === "PLUS") {
      // First ensure the product is in groceryItems
      dispatch(addGroceryItem(product));
      dispatch(addToCart(selectedVariant.id, 1));
    }
  };

  return handleQuantityChange;
};                                                                                          