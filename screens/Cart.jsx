import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Keyboard, BackHandler } from 'react-native';
import { Text, Button, Card, Divider, IconButton, TextInput, HelperText } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../theme';
import { addMultipleLineItems, calculateCartTotal, formatPrice, getVariantQuantity } from '../utils/cartUtils';
import { useQuantityHandler } from '../utils/productHandlers';
import { showToast } from '../store/actions/toast';
import { clearCart, removeFromCart } from '../store/actions/grocery';
import ShippingOptions from '../components/cart/ShippingOptions';
import { useShippingOptions } from '../services/queries';
import { addCartCustomerAddress, completeCart, confirmOrder, createPaymentSession, getTaxes, paymentCollection } from '../services/api';
import { setCartId } from '../store/actions/user';
import { validateEmail, validateFullName, validatePhone } from '../utils/formUtils';
import { setLoading } from '../store/actions/loader';
import { useFocusEffect } from '@react-navigation/native';


const TAX_RATE = 0;

const Cart = ({ navigation }) => {
    const scrollViewRef = useRef(null);
    const { cart, groceryItems } = useSelector((state) => state.groceryState);
    const handleQuantityChange = useQuantityHandler();
    const dispatch = useDispatch();
    const cartId = useSelector((state) => state.user.cartId)
    const loginUser = useSelector((state) => state.user.user)

    const [selectedShipping, setSelectedShipping] = useState(null);
    const {
        data: shippingOptions = [],
        isLoading: isLoadingShipping,
        error: shippingError
    } = useShippingOptions(cartId);
    const [form, setForm] = useState({
        name: loginUser?.first_name || '',
        phone: loginUser?.phone || '',
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
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Home');
                return true; // Prevent default back behavior
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

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

        // Name validation
        const nameError = validateFullName(form.name);
        if (nameError) errors.name = nameError;

        // Phone validation
        const phoneError = validatePhone(form.phone);
        if (phoneError) errors.phone = phoneError;


        // Address validation (keeping original logic since no utility function exists)
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


    useEffect(() => {
        if (shippingOptions?.length > 0 && !selectedShipping) {
            setSelectedShipping(shippingOptions[0].id);
        }
    }, [shippingOptions]);
    const getShippingFee = () => {
        if (!selectedShipping || !shippingOptions?.length) return 0;
        const selectedOption = shippingOptions.find(option => option.id === selectedShipping);
        return selectedOption?.calculated_price?.calculated_amount ?? 0;
    };

    const handlePlaceOrder = async () => {
        dispatch(setLoading(true))
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });

        try {


            if (!validateForm()) {
                return;
            }


            const customerDetails = {
                first_name: form?.name,
                last_name: "",
                address_1: form?.address,
                company: "",
                city: "Lahore",
                country_code: "pk",
                province: "Punjab",
                phone: form?.phone
            }
            const emailBody = {
                email: loginUser?.email || `${form?.phone}@guest.com`
            }
            const addressBody = {
                billing_address: customerDetails,
                shipping_address: customerDetails
            }
            const addCustomerEmail = await addCartCustomerAddress(cartId, emailBody)
            const addCartCustomerAddressRes = await addCartCustomerAddress(cartId, addressBody)


            console.log("addCartCustomerAddressRes", addCustomerEmail, addCartCustomerAddressRes)
            // Convert cart items to Medusa line items format
            const lineItems = cartVariants.map(variant => ({
                variant_id: variant.id,
                quantity: getVariantQuantity(cart, variant.id)
            }));

            console.log("line items to be added:", lineItems);

            // Add all items to cart using parallel requests
            await addMultipleLineItems(cartId, lineItems);

            const paymentRes = await paymentCollection(cartId);
            if (!paymentRes?.payment_collection?.id) {
                throw new Error('Failed to create payment collection');
            }

            const paymentCollectionId = paymentRes.payment_collection.id;
            await createPaymentSession(paymentCollectionId);

            const confirmOrderRes = await completeCart(cartId);
            console.log("confirm order response:", confirmOrderRes);

            if (confirmOrderRes) {
                console.log("items......", confirmOrderRes?.order?.items, JSON.stringify(confirmOrderRes))
                dispatch(showToast('Order placed successfully!'));
                dispatch(setCartId(null));
                dispatch(clearCart());
                navigation.navigate('OrderDetail', { 
                    orderDetails: confirmOrderRes // The order response from your API
                  });
            }
        } catch (error) {
            console.error('Place order error:', error);
            dispatch(showToast(error.message || 'Failed to place order. Please try again.'));
            dispatch(setCartId(null));
            dispatch(clearCart());
        } finally {
            dispatch(setLoading(false))

        }
    };

    const subtotal = calculateCartTotal(cart, groceryItems);
    const tax = subtotal * TAX_RATE;
    const shippingFee = getShippingFee();
    const total = subtotal + tax + shippingFee;

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
                                    styles.input, form?.name?.trim() ? { backgroundColor: COLORS.BACKGROUND_LIGHT } : null,

                                ]}
                                mode="outlined"
                                placeholder="Enter your full name"
                                error={!!form.errors.name}
                                maxLength={50}
                            />
                            <HelperText type="error" visible={!!form.errors.name}>
                                {form.errors.name}
                            </HelperText>
                        </View>

                        <View style={{ marginBottom: form.errors.phone ? 0 : -25 }}>
                            <TextInput
                                label="Phone Number"
                                value={form.phone}
                                onChangeText={(text) => updateForm('phone', text)}
                                style={[
                                    styles.input, form?.phone?.trim() ? { backgroundColor: COLORS.BACKGROUND_LIGHT } : null

                                ]}
                                mode="outlined"
                                keyboardType="phone-pad"
                                placeholder="Enter your phone number"
                                error={!!form.errors.phone}
                                maxLength={13}
                            />
                            <HelperText type="error" visible={!!form.errors.phone}>
                                {form.errors.phone}
                            </HelperText>
                        </View>

                        <View style={{ marginBottom: form.errors.address ? 0 : -25 }}>
                            <TextInput
                                label="Complete Address"
                                value={form.address}
                                onChangeText={(text) => updateForm('address', text)}
                                style={[
                                    styles.input, form?.address?.trim() ? { backgroundColor: COLORS.BACKGROUND_LIGHT } : null

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

                    <ShippingOptions
                        shippingOptions={shippingOptions}
                        selectedOption={selectedShipping}
                        onSelectOption={setSelectedShipping}
                        isLoading={isLoadingShipping}
                    />
                    <Card style={styles.summaryCard}>
                        <Card.Content>
                            <View style={styles.summaryRow}>
                                <Text variant="bodyLarge">Subtotal</Text>
                                <Text variant="bodyLarge" style={styles.amount}>{formatPrice(subtotal)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text variant="bodyLarge">Tax (0%)</Text>
                                <Text variant="bodyLarge" style={styles.amount}>{formatPrice(tax)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text variant="bodyLarge">Delivery Fee</Text>
                                <Text variant="bodyLarge" style={styles.amount}> {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</Text>
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
            </ScrollView>

            {/* Summary Card */}

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
        borderTopWidth: 1,
        borderColor: COLORS.BORDER,
        elevation: 4,
        marginVertical: 12,

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