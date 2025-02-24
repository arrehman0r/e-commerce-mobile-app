// components/ProductCard.js
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import {
  Card,
  Text,
  Button,
  Portal
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../store/actions/toast';
import { COLORS } from '../theme';
import {
  getVariantQuantity,
  formatPrice,
  hasProductInCart
} from '../utils/cartUtils';
import { ProductVariantModal } from './modals/ProductVariant';

const ProductCard = ({ product, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.groceryState);

  const getCartCount = () => {
    return selectedVariant ? getVariantQuantity(cart, selectedVariant.id) : 0;
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
    const currency = product.variants[0]?.calculated_price?.currency_code || 'Rs';

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
                <Text variant="titleMedium" style={styles.title}>
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
        <ProductVariantModal
          visible={modalVisible}
          onDismiss={handleModalClose}
          product={product}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
          cartCount={getCartCount()}

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
    objectFit: 'contain',
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

    backgroundColor: COLORS.PRIMARY,
  },
  disabledIconButton: {
    backgroundColor: COLORS.DISABLED,
    opacity: 0.5,
  },



});

export default ProductCard;