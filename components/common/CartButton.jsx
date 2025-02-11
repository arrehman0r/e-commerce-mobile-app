import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme';
import { getTotalCartCount } from '../../utils/cartUtils';
import { showToast } from '../../store/actions/toast';

const CartButton = () => {
    const navigation = useNavigation();
    const cart = useSelector((state) => state.groceryState.cart);
    const cartCount = getTotalCartCount(cart);
    const loginUser = useSelector((state) => state.user.user)
    const dispatch = useDispatch()
    const handleCartClick = () => {
        if (!loginUser?.id) {
            dispatch(showToast("Please login to place order."))
            navigation.navigate('Login', { fromCart: true });

            return

        }
        navigation.navigate('Cart')

    }
    return (
        <>
            <IconButton
                icon="cart"
                iconColor={COLORS.TEXT_WHITE}
                size={24}
                onPress={handleCartClick}
                style={styles.cartButton}
            />
            {cartCount > 0 && (
                <Badge
                    size={20}
                    style={styles.badge}
                >
                    {cartCount}
                </Badge>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    cartButton: {
        marginRight: 8,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: COLORS.SECONDARY,
    },
});

export default CartButton;