import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton, Text, Card, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../theme';
import { formatPrice } from '../../utils/cartUtils';
const ShippingOptions = ({
    shippingOptions,
    selectedOption,
    onSelectOption,
    isLoading
}) => {
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={COLORS.PRIMARY} size="large" />
            </View>
        );
    }

    if (!shippingOptions?.length) {
        return (
            <Card style={styles.errorCard}>
                <Card.Content>
                    <Text variant="bodyMedium" style={styles.errorText}>
                        No shipping options available
                    </Text>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text variant="titleLarge" style={styles.title}>
                    Shipping Method
                </Text>
                <RadioButton.Group
                    onValueChange={value => onSelectOption(value)}
                    value={selectedOption}
                >
                    {shippingOptions.map((option) => (
                        <View key={option.id} style={styles.optionContainer}>
                            <RadioButton.Item
                                label={option.name}
                                value={option.id}
                                labelStyle={styles.optionLabel}
                                position="leading"
                                color={COLORS.PRIMARY}
                                style={styles.radioItem}
                            />
                            <Text variant="titleMedium" style={styles.price}>
                                {option.amount === 0 ? 'Free' : formatPrice(option.amount)}
                            </Text>
                        </View>
                    ))}
                </RadioButton.Group>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
      
        backgroundColor: COLORS.CARD_BACKGROUND,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 12,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: -8,
    },
    optionLabel: {
        fontFamily: 'Poppins_500Medium',
        color: COLORS.TEXT_PRIMARY,
    },
    price: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.PRIMARY,
        marginRight: 16,
    },
    radioItem: {
        flex: 1,
    },
    errorCard: {
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: COLORS.BACKGROUND_LIGHT,
    },
    errorText: {
        fontFamily: 'Poppins_500Medium',
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
    },
});

export default ShippingOptions;