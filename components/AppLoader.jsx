import React from 'react';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { useSelector } from 'react-redux';

const AppLoader = () => {

    const loading = useSelector((state) => state.loading.loading);

    if (!loading) {
        return null; 
    }
    return (
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
    )
};

export default AppLoader;