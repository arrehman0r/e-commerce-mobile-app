
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import {
    Text,
    Button,
    Modal,
    IconButton,
    Chip
} from 'react-native-paper';
import { COLORS } from '../../theme';
import { PriceDisplay } from '../PriceDisplay';
import { useQuantityHandler } from '../../utils/productHandlers';

export const ProductVariantModal = ({ visible, onDismiss, product, selectedVariant, onVariantSelect, cartCount }) => {
    const handleQuantityChange = useQuantityHandler();
    return (
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
                            onPress={() => handleQuantityChange("MINUS", selectedVariant, product)}
                            disabled={cartCount === 0}
                            style={[
                                styles.iconButton,
                                cartCount === 0 && styles.disabledIconButton
                            ]}
                            iconColor="white"
                        />

                        <Text variant="titleLarge" style={styles.quantityText}>
                            {cartCount}
                        </Text>

                        <IconButton
                            icon="plus"
                            mode="contained-tonal"
                            onPress={() => handleQuantityChange("PLUS", selectedVariant, product)}
                            disabled={!selectedVariant.manage_inventory && cartCount > 0}
                            style={[
                                styles.iconButton,
                                (!selectedVariant.manage_inventory && cartCount > 0) && styles.disabledIconButton
                            ]}
                            iconColor="white"
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
};

const VariantSelector = ({ variant, isSelected, onSelect }) => {
    const optionValue = variant.title || variant.options[0]?.value;

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

            </View>
            {variant.manage_inventory && (
                <PriceDisplay variant={variant} />
            )}
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({

    modalContainer: {
        backgroundColor: COLORS.CARD_BACKGROUND,
        margin: 20,
        padding: 20,
        borderRadius: 12,



    },
    modalTitle: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 8,
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
        backgroundColor: COLORS.PRIMARY,

        marginTop: 24,
    },
    iconButton: {
        backgroundColor: COLORS.PRIMARY,


    },
    disabledIconButton: {
        backgroundColor: COLORS.DISABLED, // Define a disabled color in your COLORS file
        opacity: 0.5, // Reduce opacity to indicate it's disabled
    },


});
