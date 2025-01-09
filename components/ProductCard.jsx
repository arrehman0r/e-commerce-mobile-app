// components/ProductCard.js
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { 
  Card, 
  Text, 
  Button, 
  Portal, 
  Modal, 
  IconButton,
  Chip
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addGroceryItem, addToCart, removeFromCart } from '../store/actions/grocery';
import { showToast } from '../store/actions/toast';
import { COLORS } from '../theme';
import { 
  getVariantQuantity, 
  formatPrice, 
  getVariantInfo,
  hasProductInCart 
} from '../utils/cartUtils';

// PriceDisplay and VariantSelector components remain the same...

const PriceDisplay = ({ variant }) => {
    if (!variant?.calculated_price) return null;
    
    const { 
      calculated_amount,
      original_amount,
      currency_code = 'PKR'
    } = variant.calculated_price;
  
    const hasDiscount = calculated_amount < original_amount;
  
    return (
      <View style={styles.priceContainer}>
        <Text 
          style={[
            styles.price, 
            { color: hasDiscount ? COLORS.PRIMARY : COLORS.TEXT_PRIMARY }
          ]}
        >
          {currency_code.toUpperCase()} {(calculated_amount / 100).toFixed(2)}
        </Text>
        {hasDiscount && (
          <Text style={styles.originalPrice}>
            {currency_code.toUpperCase()} {(original_amount / 100).toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  const VariantSelector = ({ variant, isSelected, onSelect }) => {
    const optionValue = variant.options[0]?.value || variant.title;
    
    return (
      <TouchableOpacity
        onPress={() => onSelect(variant)}
        style={[
          styles.variantSelector,
          isSelected && styles.selectedVariant
        ]}
      >
        <View style={styles.variantInfo}>
          <Text 
            style={[
              styles.variantText,
              isSelected && styles.selectedVariantText
            ]}
          >
            {optionValue}
          </Text>
          <PriceDisplay variant={variant} />
        </View>
        {variant.manage_inventory && (
          <Chip compact>In Stock</Chip>
        )}
      </TouchableOpacity>
    );
  };

const VariantModal = ({ visible, onDismiss, product, selectedVariant, onVariantSelect, cartCount, onQuantityChange }) => (
    <Modal 
      visible={visible} 
      onDismiss={onDismiss} 
      contentContainerStyle={styles.modalContainer}
    >
      <Text variant="headlineSmall" style={styles.modalTitle}>
        {product.title}
      </Text>
      
      <Text variant="bodyMedium" style={styles.sectionTitle}>
        {product.options[0]?.title || 'Select Variant'}:
      </Text>
      
      <View style={styles.variantList}>
        {product.variants.map((variant) => (
          <VariantSelector
            key={variant.id}
            variant={variant}
            isSelected={selectedVariant?.id === variant.id}
            onSelect={onVariantSelect}
          />
        ))}
      </View>
  
      {selectedVariant && (
        <>
          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Quantity:
          </Text>
          <View style={styles.quantityContainer}>
            <IconButton
              icon="minus"
              mode="contained-tonal"
              onPress={() => onQuantityChange("MINUS")}
              disabled={cartCount === 0}
            />
            <Text variant="titleLarge" style={styles.quantityText}>
              {cartCount}
            </Text>
            <IconButton
              icon="plus"
              mode="contained-tonal"
              onPress={() => onQuantityChange("PLUS")}
              disabled={!selectedVariant.manage_inventory && cartCount > 0}
            />
          </View>
        </>
      )}
  
      <Button
        mode="contained"
        onPress={onDismiss}
        style={styles.addButton}
        disabled={!selectedVariant || cartCount === 0}
      >
        Add to Cart
      </Button>
    </Modal>
  );

const ProductCard = ({ product, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.groceryState);

  const getCartCount = () => {
    return selectedVariant ? getVariantQuantity(cart, selectedVariant.id) : 0;
  };

  const handleQuantityChange = (type) => {
    if (!selectedVariant) return;

    if (type === "MINUS") {
      dispatch(removeFromCart(selectedVariant.id, 1));
    } else if (type === "PLUS") {
      // First ensure the product is in groceryItems
      dispatch(addGroceryItem(product));
      dispatch(addToCart(selectedVariant.id, 1));
    }
  };

  const handleModalOpen = () => {
    // If product has items in cart, preselect that variant
    if (hasProductInCart(cart, product)) {
      const cartVariantId = Object.keys(cart).find(id => 
        product.variants.some(v => v.id === id)
      );
      const cartVariant = product.variants.find(v => v.id === cartVariantId);
      setSelectedVariant(cartVariant);
    } else {
      setSelectedVariant(product.variants[0]);
    }
    setModalVisible(true);
  };

  const handleModalClose = () => {
    if (getCartCount() > 0) {
      dispatch(showToast("Item Added"));
    }
    setModalVisible(false);
  };

  const getPriceRange = () => {
    if (product.variants.length === 0) return null;

    const prices = product.variants
      .map(v => v.calculated_price?.calculated_amount || 0)
      .filter(price => price > 0);

    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const currency = product.variants[0]?.calculated_price?.currency_code || 'PKR';

    if (minPrice === maxPrice) {
      return formatPrice(minPrice, currency);
    }
    return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
  };

  const getButtonText = () => {
    if (hasProductInCart(cart, product)) {
      return "Add More";
    }
    return product.variants.length > 1 ? "Select Options" : "Add to Cart";
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { product })}>
              <Image 
                source={{ uri: product.thumbnail }} 
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.details}>
            <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { product })}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.title}>
                  {product.title}
                </Text>
                <Text variant="bodyMedium" numberOfLines={2}>
                  {product.description}
                </Text>
                <Text variant="titleMedium" style={styles.priceRange}>
                  {getPriceRange()}
                </Text>
              </Card.Content>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleModalOpen}
              style={styles.buyButton}
            >
              {getButtonText()}
            </Button>
          </View>
        </View>
      </Card>

      <Portal>
        <VariantModal
          visible={modalVisible}
          onDismiss={handleModalClose}
          product={product}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
          cartCount={getCartCount()}
          onQuantityChange={handleQuantityChange}
        />
      </Portal>
    </>
  );
};


const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    height: 170,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  row: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: '40%',
  },
  image: {
    height: 170,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  details: {
    width: '60%',
    padding: 8,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_PRIMARY,
  },
  priceRange: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 4,
  },
  buyButton: {
    color: COLORS.PRIMARY,

    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 16,
    marginBottom: 8,
  },
  variantList: {
    gap: 8,
  },
  variantSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  selectedVariant: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.SURFACE_LIGHT,
  },
  variantInfo: {
    flex: 1,
  },
  variantText: {
    fontFamily: 'Poppins_500Medium',
    color: COLORS.TEXT_PRIMARY,
    textTransform: 'capitalize',
  },
  selectedVariantText: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins_600SemiBold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  price: {
    fontFamily: 'Poppins_600SemiBold',
  },
  originalPrice: {
    fontFamily: 'Poppins_400Regular',
    color: COLORS.TEXT_LIGHT,
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  quantityText: {
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.TEXT_PRIMARY,
  },
  addButton: {
    marginTop: 24,
  },
});

export default ProductCard;