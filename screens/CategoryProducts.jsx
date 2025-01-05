import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Text, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import { getCategoryProducts } from '../server/api';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { addGroceryItem, addToCart, removeFromCart } from '../store/actions/grocery';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { showToast } from '../store/actions/toast';
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const CategoryProducts = ({ navigation, route }) => {
    const { categoryId } = route.params;
    const [products, setProducts] = useState([]);
    const { cart } = useSelector((state) => state.groceryState);
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const dispatch = useDispatch();
console.log("category id is ", categoryId)
    const fetchCategoryProducts = async () => {
        const res = await getCategoryProducts(categoryId);
        console.log("so this is rt",res)
        setProducts(res?.products);
    };

    const cartCount = () => {
        return selectedVariant ? (cart[selectedVariant.id] || 0) : 0;
    };

    const handleOnPress = (type, selectedVariant, product) => {
        if (type === "MINUS") {
            dispatch(removeFromCart(selectedVariant.id, 1));
        } else if (type === "PLUS") {
            dispatch(addGroceryItem(product));
            dispatch(addToCart(selectedVariant.id, 1));

        }
    };

    const openVariantModal = (product) => {
        setSelectedProduct(product);
        setSelectedVariant(product.variants[0]); // Reset selected variant when opening modal

        setVisible(true);
    };

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
    };

    useEffect(() => {
        fetchCategoryProducts();
    }, []);

    const handleAddtoCart = () => {
        dispatch(showToast("Item Added"))
        setVisible(false);
    }

    return (
        <Provider>
            <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false}>
                {products.length > 0 && products.map((product) => (
                    <Card key={product.id} style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.imageContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { product: product })}>
                                    <Card.Cover source={{ uri: product.thumbnail }} style={styles.image} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.details}>
                                <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { product: product })}>
                                    <Card.Content>
                                        <Text variant="titleLarge">{product?.title}</Text>

                                        {product?.subtitle &&
                                            <Text variant="bodyMedium">
                                                {product?.subtitle?.length > 50
                                                    ? `${product.subtitle.substring(0, 60)}...`
                                                    : product.subtitle}
                                            </Text>}
                                        {/* Display the price of the first variant */}
                                        <Text variant="titleMedium" style={styles.price}>
                                            {product.variants[0].prices[0].currency_code} {product.variants[0].prices[0].amount}
                                        </Text>
                                    </Card.Content>
                                </TouchableOpacity>
                                <Card.Actions style={{ padding: 0 }}>
                                    <Button
                                        style={{ width: '100%' }}
                                        onPress={() => openVariantModal(product)}
                                        mode='contained-tonal'
                                    >
                                        {product.variants.some(variant => cart[variant.id]) ? "Add More" : "Buy Now"}
                                    </Button>
                                </Card.Actions>

                            </View>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            {/* Variant Selection Modal */}
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modalContainer}>
                    {selectedProduct && (
                        <View>
                            <Text variant="headlineSmall">{selectedProduct.title}</Text>
                            <Text variant="bodyMedium" style={styles.sectionTitle}>Select Variant:</Text>
                            {selectedProduct.variants.map((variant) => (
                                <TouchableOpacity
                                    key={variant.id}
                                    onPress={() => handleVariantSelect(variant)}
                                    style={[
                                        styles.variantItem,
                                        selectedVariant?.id === variant.id && styles.selectedVariantItem
                                    ]}
                                >
                                    <Text style={[
                                        styles.variantText,
                                        selectedVariant?.id === variant.id && styles.selectedVariantText
                                    ]}>
                                        {variant.title} - {variant.prices[0].currency_code} {variant.prices[0].amount}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <Text variant="bodyMedium" style={styles.sectionTitle}>Quantity:</Text>
                            <View style={styles.quantityContainer}>
                                <IconButton
                                    icon="minus"
                                    disabled={!selectedVariant}

                                    onPress={() => handleOnPress("MINUS", selectedVariant, selectedProduct)}
                                />
                                <Text>{cartCount()}</Text>
                                <IconButton
                                    icon="plus"
                                    disabled={!selectedVariant}

                                    onPress={() => handleOnPress("PLUS", selectedVariant, selectedProduct)} />
                            </View>
                            <Button
                                onPress={handleAddtoCart}
                                mode='contained'
                                disabled={cartCount() == 0}
                                style={styles.addToCartButton}
                            >
                                Add to Cart
                            </Button>
                        </View>
                    )}
                </Modal>
            </Portal>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        marginBottom: 5,
        height: 170,
    },
    row: {
        flexDirection: 'row',
    },
    imageContainer: {
        width: '50%',
    },
    image: {
        height: 170,
    },
    details: {
        width: '50%',
        padding: 5,
        display: 'flex',
        justifyContent: 'space-between',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },
    price: {
        color: '#FF0000',
        textTransform: 'uppercase'
    },
    modalContainer: {
        padding: 20,
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    variantItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedVariantItem: {
        backgroundColor: '#f0dbff',
    },
    variantText: {
        fontSize: 16,
        textTransform: 'uppercase'
    },
    selectedVariantText: {
        fontWeight: 'bold',
        color: "#7845ac",
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    addToCartButton: {
        marginTop: 10,
    },
});

export default CategoryProducts;