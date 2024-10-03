import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { Button, IconButton, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/actions/grocery';

const Cart = ({navigation}) => {
    const { cart, groceryItems } = useSelector((state) => state.groceryState); // Assuming cart and groceryItems are in groceryState
    const dispatch = useDispatch();
    console.log(
        "cart is ...", cart
    )
    const handleOnPress = (type, variantId) => {
        if (type === "MINUS") {
            dispatch(removeFromCart(variantId, 1));
        } else if (type === "PLUS") {
            dispatch(addToCart(variantId, 1));
        }
    };

    const renderCartItem = ({ item }) => {
        const product = groceryItems.find(p => p.variants.some(v => v.id === item.variantId));
        const variant = product.variants.find(v => v.id === item.variantId);

        return (
            <Card style={styles.card}>
                <View style={styles.itemContainer}>
                    <Image source={{ uri: product.thumbnail }} style={styles.image} />
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>{product.title} ({variant.title})</Text>
                        <Text style={styles.price}>
                            {variant.prices[0].currency_code.toUpperCase()} {variant.prices[0].amount}
                        </Text>
                        <View style={styles.counterContainer}>
                            <IconButton
                                icon="minus"
                                onPress={() => handleOnPress("MINUS", item.variantId)}
                                style={styles.iconButtons}
                                size={25}
                            />
                            <Text style={styles.count}>{item.quantity}</Text>
                            <IconButton
                                icon="plus"
                                onPress={() => handleOnPress("PLUS", item.variantId)}
                                style={styles.iconButtons}
                                size={25}
                            />
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    const cartItems = Object.keys(cart).map((variantId) => ({
        variantId,
        quantity: cart[variantId],
    }));

    return (
        <View style={styles.container}>
            {cartItems.length > 0 ? (
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.variantId}
                    renderItem={renderCartItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator = {false}
                />
            ) : (
                <Text style={styles.emptyText}>Your cart is empty</Text>
            )}

            <Button
                mode="contained"
                onPress={() => navigation.navigate("Checkout")}

                style={styles.fullWidthButton}
                contentStyle={styles.buttonContent}
            >
               Checkout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 10,
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 10,
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    count: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    iconButtons: {
        backgroundColor: "#ddd",
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
    },
    fullWidthButton: {
        width: '100%',
        justifyContent: 'center',
    },
    buttonContent: {
        justifyContent: 'center',
        paddingVertical: 10,
    },
});

export default Cart;
