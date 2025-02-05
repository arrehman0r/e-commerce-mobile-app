import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Button, Card, Divider, IconButton, TextInput, HelperText } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../theme';
import { calculateCartTotal, formatPrice, getVariantQuantity } from '../utils/cartUtils';
import { useQuantityHandler } from '../utils/productHandlers';
import { showToast } from '../store/actions/toast';
import { removeFromCart } from '../store/actions/grocery';

const DELIVERY_FEE = 200;
const TAX_RATE = 0.13;

const Cart = ({ navigation }) => {
    const scrollViewRef = useRef(null);
    const { cart, groceryItems } = useSelector((state) => state.groceryState);
    const handleQuantityChange = useQuantityHandler();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        errors: {}
    });

    const updateForm = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value,
            errors: {
                ...prev.errors,
                [key]: null
            }
        }));
    };

    const cartVariants = groceryItems.reduce((acc, item) => {
        const itemVariants = item.variants.filter(v => getVariantQuantity(cart, v.id) > 0);
        if (itemVariants.length > 0) {
            itemVariants.forEach(variant => {
                acc.push({
                    ...variant,
                    productTitle: item.title,
                    productId: item.id,
                    product: item,
                    thumbnail: item.thumbnail
                });
            });
        }
        return acc;
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!form.name) errors.name = 'Name is required';
        if (!form.phone) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(form.phone)) {
            errors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!form.address) {
            errors.address = 'Address is required';
        } else if (form.address.length < 10) {
            errors.address = 'Please enter a complete address';
        }

        setForm(prev => ({ ...prev, errors }));

        if (Object.keys(errors).length > 0) {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            dispatch(showToast('Please fix the errors in the form'));
            return false;
        }
        return true;
    };

    const handlePlaceOrder = () => {
        if (validateForm()) {
            navigation.navigate('Checkout');
        }
    };

    const subtotal = calculateCartTotal(cart, groceryItems);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + DELIVERY_FEE;

    if (cartVariants.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text variant="headlineMedium" style={styles.emptyTitle}>Your cart is empty</Text>
                <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.shopButton}>
                    Start Shopping
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollViewRef} style={styles.scrollView}>
                {/* Form Card */}
                <Card style={styles.formCard} mode='contained'>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.formTitle}>Delivery Details</Text>
                        <View style={{ marginBottom: form.errors.name ? 0 : -25 }}>
                            <TextInput
                                label="Full Name"
                                value={form.name}
                                onChangeText={(text) => updateForm('name', text)}
                                style={[
                                    styles.input,

                                ]}
                                mode="outlined"
                                placeholder="Enter your full name"
                                error={!!form.errors.name}
                            />
                            <HelperText type="error" visible={!!form.errors.name}>
                                {form.errors.name}
                            </HelperText>
                        </View>

                        <View style={{ marginBottom: form.errors.name ? 0 : -25 }}>
                            <TextInput
                                label="Phone Number"
                                value={form.phone}
                                onChangeText={(text) => updateForm('phone', text)}
                                style={[
                                    styles.input,

                                ]}
                                mode="outlined"
                                keyboardType="phone-pad"
                                placeholder="Enter your phone number"
                                error={!!form.errors.phone}
                            />
                            <HelperText type="error" visible={!!form.errors.phone}>
                                {form.errors.phone}
                            </HelperText>
                        </View>

                        <View style={{ marginBottom: form.errors.name ? 0 : -25 }}>
                            <TextInput
                                label="Complete Address"
                                value={form.address}
                                onChangeText={(text) => updateForm('address', text)}
                                style={[
                                    styles.input,

                                ]}
                                mode="outlined"
                                multiline
                                numberOfLines={3}
                                placeholder="Enter your complete delivery address"
                                error={!!form.errors.address}
                            />
                            <HelperText type="error" visible={!!form.errors.address}>
                                {form.errors.address}
                            </HelperText>
                        </View>
                    </Card.Content>
                </Card>
                {/* Items Section */}
                <View style={{ padding: 16 }}>


                    {cartVariants.map(variant => {
                        const quantity = getVariantQuantity(cart, variant.id);
                        const totalPrice = variant.calculated_price.calculated_amount * quantity;

                        return (
                            <Card key={variant.id} style={styles.itemCard}>
                                <Card.Content>
                                    <View style={styles.itemContent}>
                                        <Image source={{ uri: variant.thumbnail }} style={styles.itemImage} />

                                        <View style={{ flex: 1 }}>
                                            <View style={styles.itemDetails}>
                                                <Text variant="titleMedium" style={styles.variantTitle}>
                                                    {variant.title}
                                                </Text>

                                            </View>


                                            <View style={{
                                                display: 'flex',
                                                flexDirection: 'row'
                                            }}>

                                                <View style={styles.quantityControls}>
                                                    <IconButton
                                                        icon="minus"
                                                        mode="contained-tonal"
                                                        size={14}
                                                        style={[
                                                            styles.iconButton,
                                                            quantity === 0 && styles.disabledIconButton
                                                        ]}
                                                        iconColor="white"
                                                        onPress={() => handleQuantityChange("MINUS", variant, variant.product)}
                                                    />
                                                    <Text variant="titleMedium" style={styles.quantityText}>
                                                        {quantity}
                                                    </Text>
                                                    <IconButton
                                                        icon="plus"
                                                        mode="contained-tonal"
                                                        size={14}
                                                        style={[
                                                            styles.iconButton,
                                                            !variant.manage_inventory && quantity > 0 && styles.disabledIconButton
                                                        ]}
                                                        iconColor="white"
                                                        onPress={() => handleQuantityChange("PLUS", variant, variant.product)}
                                                    />
                                                </View>
                                                <View style={styles.priceSection}>
                                                    <Text style={styles.priceText}>{formatPrice(totalPrice)}</Text>
                                                    <IconButton
                                                        icon="delete"
                                                        mode="contained-tonal"
                                                        size={20}
                                                        onPress={() => dispatch(removeFromCart(variant.id, quantity))}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>
                        );
                    })}

                    <View style={styles.deliveryTimeContainer}>
                        <IconButton icon="clock-outline" iconColor={COLORS.PRIMARY} size={24} />
                        <Text variant="bodyLarge" style={styles.deliveryTimeText}>
                            Estimated Delivery: 35-40 mins
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Summary Card */}
            <Card style={styles.summaryCard}>
                <Card.Content>
                    <View style={styles.summaryRow}>
                        <Text variant="bodyLarge">Subtotal</Text>
                        <Text variant="bodyLarge" style={styles.amount}>{formatPrice(subtotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text variant="bodyLarge">Tax (13%)</Text>
                        <Text variant="bodyLarge" style={styles.amount}>{formatPrice(tax)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text variant="bodyLarge">Delivery Fee</Text>
                        <Text variant="bodyLarge" style={styles.amount}>{formatPrice(DELIVERY_FEE)}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text variant="titleLarge" style={styles.totalText}>Total</Text>
                        <Text variant="titleLarge" style={styles.totalAmount}>{formatPrice(total)}</Text>
                    </View>
                    <Button
                        mode="contained"
                        style={styles.checkoutButton}
                        contentStyle={styles.checkoutButtonContent}
                        onPress={handlePlaceOrder}
                    >
                        Place Order
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollView: {
        flex: 1,
    },
    formCard: {
        marginBottom: -25,
        backgroundColor: COLORS.CARD_BACKGROUND,
    },
    formTitle: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 16,
    },
    inputContainer: {

    },
    input: {
        marginBottom: 0, // Remove bottom margin since it's handled by inputContainer
        backgroundColor: COLORS.BACKGROUND_LIGHT,
    },
    deliveryTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.SURFACE_LIGHT,
        padding: 2,
        borderRadius: 8,
        marginBottom: 16,
    },
    deliveryTimeText: {
        fontFamily: 'Poppins_500Medium',
        color: COLORS.TEXT_PRIMARY,
        flex: 1,
    },
    itemCard: {
        marginBottom: 12,
        backgroundColor: COLORS.CARD_BACKGROUND,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        height: 60,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
    },
    itemDetails: {

    },
    variantTitle: {
        color: COLORS.TEXT_PRIMARY,
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        fontWeight: 'bold'
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    quantityText: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        width: 30,
        textAlign: 'center',
    },
    priceSection: {
        backgroundColor: COLORS.SURFACE_LIGHT,
        padding: 8,
        height: 40,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    priceText: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.PRIMARY,
        fontSize: 14,
    },
    summaryCard: {
        backgroundColor: COLORS.CARD_BACKGROUND,
        borderTopWidth: 2,
        borderColor: COLORS.BORDER,
        elevation: 12,


    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    amount: {
        fontFamily: 'Poppins_500Medium',
        color: COLORS.TEXT_PRIMARY,
    },
    divider: {
        marginVertical: 12,
        backgroundColor: COLORS.DIVIDER,
    },
    totalText: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
    },
    totalAmount: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.PRIMARY,
    },
    checkoutButton: {
        marginTop: 16,
    },
    checkoutButtonContent: {
        paddingVertical: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyTitle: {
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 16,
        textAlign: 'center',
    },
    shopButton: {
        minWidth: 200,
    },
    iconButton: {
        backgroundColor: COLORS.PRIMARY,


    },
    disabledIconButton: {
        backgroundColor: COLORS.DISABLED, // Define a disabled color in your COLORS file
        opacity: 0.5, // Reduce opacity to indicate it's disabled
    },
});

export default Cart;