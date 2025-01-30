import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Button, Text, IconButton, Card, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../theme';
import { PriceDisplay } from '../components/PriceDisplay';
import { useQuantityHandler } from '../utils/productHandlers';
import { getVariantQuantity } from '../utils/cartUtils';

const ProductDetails = ({ route }) => {
    const { product } = route.params;
    const cart = useSelector((state) => state.groceryState.cart);
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const handleQuantityChange = useQuantityHandler();

    const cartCount = getVariantQuantity(cart, selectedVariant.id);

    const handleIncrement = () => {
        handleQuantityChange("PLUS", selectedVariant, product);
    };

    const handleDecrement = () => {
        handleQuantityChange("MINUS", selectedVariant, product);
    };

    const handleAddToCart = () => {
        handleQuantityChange("PLUS", selectedVariant, product);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Image 
                        source={{ uri: product.thumbnail }} 
                        style={styles.image} 
                    />
                    <Card.Content>
                        <Text variant="headlineMedium" style={styles.title}>
                            {product.title}
                        </Text>

                        {selectedVariant && (
                            <PriceDisplay variant={selectedVariant} />
                        )}

                        <View style={styles.variantsContainer}>
                            {product.variants.map((variant) => (
                                <Chip
                                    key={variant.id}
                                    selected={selectedVariant.id === variant.id}
                                    onPress={() => setSelectedVariant(variant)}
                                    style={[
                                        styles.chip,
                                        selectedVariant.id === variant.id && styles.selectedChip
                                    ]}
                                    textStyle={[
                                        styles.chipText,
                                        selectedVariant.id === variant.id && styles.selectedChipText
                                    ]}
                                >
                                    {variant.title}
                                </Chip>
                            ))}
                        </View>

                        <Text variant="bodySmall" style={styles.subtitle}>
                            {product.subtitle}
                        </Text>
                        <Text variant="bodyMedium" style={styles.description}>
                            {product.description}
                        </Text>
                    </Card.Content>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <Card.Actions style={styles.actions}>
                    {cartCount > 0 ? (
                        <View style={styles.counterContainer}>
                            <IconButton
                                icon="minus"
                                mode="contained-tonal"
                                onPress={handleDecrement}
                                size={20}
                                disabled={cartCount === 0}
                            />
                            <Text style={styles.quantityText}>{cartCount}</Text>
                            <IconButton
                                icon="plus"
                                mode="contained-tonal"
                                onPress={handleIncrement}
                                size={20}
                                disabled={!selectedVariant.manage_inventory && cartCount > 0}
                            />
                        </View>
                    ) : (
                        <Button
                            mode="contained"
                            onPress={handleAddToCart}
                            style={styles.fullWidthButton}
                            contentStyle={styles.buttonContent}
                            disabled={!selectedVariant}
                        >
                            Add to Cart
                        </Button>
                    )}
                </Card.Actions>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollContent: {
        paddingBottom: 150,
    },
    card: {
        marginBottom: 10,
        padding: 0,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        backgroundColor: COLORS.BACKGROUND,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 8,
    },
    subtitle: {
        marginTop: 12,
        color: COLORS.TEXT_SECONDARY,
        fontFamily: 'Poppins_400Regular',
    },
    description: {
        marginTop: 8,
        color: COLORS.TEXT_PRIMARY,
        fontFamily: 'Poppins_400Regular',
    },
    variantsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: COLORS.BACKGROUND,
        borderColor: COLORS.PRIMARY,
    },
    selectedChip: {
        backgroundColor: COLORS.PRIMARY,
    },
    chipText: {
        color: COLORS.PRIMARY,
        fontFamily: 'Poppins_500Medium',
    },
    selectedChipText: {
        color: COLORS.TEXT_WHITE,
    },
    actions: {
        justifyContent: 'center',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: 16,
    },
    quantityText: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        fontSize: 18,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.CARD_BACKGROUND,
        padding: 16,
        borderTopWidth: 1,
        borderColor: COLORS.BORDER,
        elevation: 4,
    },
    fullWidthButton: {
        width: '100%',
    },
    buttonContent: {
        paddingVertical: 8,
    },
});

export default ProductDetails;