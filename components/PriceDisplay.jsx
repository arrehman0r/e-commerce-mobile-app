import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../theme';
import { formatPrice } from '../utils/cartUtils';

export const PriceDisplay = ({ variant }) => {
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
                    { color: hasDiscount ? COLORS.PROMO_RED : COLORS.PRIMARY }
                ]}
            >
                {formatPrice(calculated_amount, currency_code)}

            </Text>
            {hasDiscount && (
                <Text style={styles.originalPrice}>
                    {formatPrice(original_amount, currency_code)}

                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    price: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
    
    },
    originalPrice: {
        fontFamily: 'Poppins_400Regular',
        color: COLORS.TEXT_LIGHT,
        textDecorationLine: 'line-through',
    },

});