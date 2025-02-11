import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../theme';

const AppLoader = () => {
    const isLoading = useSelector((state) => state.loading.loading);
    console.log("loading is ", isLoading)
    if (!isLoading) return null;

    return (
        <View style={styles.container}>
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    loaderContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default AppLoader;