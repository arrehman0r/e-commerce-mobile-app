import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Button, Text, IconButton, Card, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addGroceryItem, addToCart, removeFromCart } from '../store/actions/grocery';

const ProductDetails = ({ route }) => {
    const { product } = route.params;
    const { cart } = useSelector((state) => state.groceryState);
    const dispatch = useDispatch();

    const [selectedVariant, setSelectedVariant] = useState(product.variants[0].id); // First variant selected by default

    const selectedVariantObject = product.variants.find(variant => variant.id === selectedVariant);

    // Assuming you want to use the first price in the array for now:
    const selectedPrice = selectedVariantObject?.prices?.[0]?.amount || 'N/A';
    const currency = selectedVariantObject?.prices?.[0]?.currency_code.toUpperCase() || 'N/A';


    const cartCount = () => {
        return selectedVariant ? (cart[selectedVariant] || 0) : 0;
    };

    const handleOnPress = (type, selectedVariant) => {
        if (type === "MINUS") {
            dispatch(removeFromCart(selectedVariant, 1));
        } else if (type === "PLUS") {
            dispatch(addGroceryItem(product));
            dispatch(addToCart(selectedVariant, 1));

        }
    };
    console.log("variant price is ", product.variants[0].prices)
    return (
        <View style={styles.container} >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Image source={{ uri: product.thumbnail }} style={styles.image} />
                    <Card.Content>
                        <Text variant="headlineMedium">{product.title}</Text>

                        {selectedVariantObject && (
                            <Text variant="titleLarge" style={styles.price}>
                                {selectedPrice !== 'N/A' ? `${currency} ${selectedPrice}` : 'Price not available'}
                            </Text>
                        )}


                        <View style={styles.variantsContainer}>
                            {product.variants.map((variant) => (
                                <Chip
                                    key={variant.id}
                                    selected={selectedVariant === variant.id}
                                    onPress={() => setSelectedVariant(variant.id)}
                                    style={styles.chip}
                                >
                                    {variant.title}
                                </Chip>
                            ))}
                        </View>
                        <Text variant="bodySmall" style={styles.subtitle}>
                            {product.subtitle}
                        </Text>
                        <Text variant="bodyMedium">{product.description}</Text>

                    </Card.Content>
                </View>
            </ScrollView>

            {/* Buy Now/Counter at the Bottom */}
            <View style={styles.bottomContainer}>
                <Card.Actions style={styles.actions}>
                    {cartCount() > 0 ? (
                        <View style={styles.counterContainer}>
                            <IconButton
                                icon="minus"
                                onPress={() => handleOnPress("MINUS", selectedVariant)}
                                style={styles.iconButtons}

                                size={30}
                            />
                            <Text style={styles.count}>{cartCount()}</Text>
                            <IconButton
                                icon="plus"
                                onPress={() => handleOnPress("PLUS", selectedVariant)}
                                style={styles.iconButtons}
                                size={30}
                            />
                        </View>
                    ) : (
                        <Button
                            mode="contained"
                            onPress={() => handleOnPress("PLUS", selectedVariant)}

                            style={styles.fullWidthButton}
                            contentStyle={styles.buttonContent}
                        >
                            Buy Now
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
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 150, // Give enough padding for the bottom container
    },
    card: {
        marginBottom: 10,
        padding: 0,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        backgroundColor: '#fff',
    },
    subtitle: {
        marginTop: 5,
        color: '#6c757d',
    },
    price: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#2b2b2b',
    },
    count: {
        fontWeight: 'bold',
        color: '#2b2b2b',
        fontSize: 30
    },
    variantsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 2,
        marginBottom: 20,
    },
    chip: {
        marginRight: 8,
        marginTop: 8,
    },
    actions: {
        justifyContent: 'center',
    },
    iconButtons:{
        backgroundColor: "#ddd"
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: 20

    },
    bottomContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
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

export default ProductDetails;
