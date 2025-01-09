import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { ActivityIndicator, Text, Provider } from 'react-native-paper';
import { useCategoryProducts } from '../services/queries';
import ProductCard from './ProductCard';

const CategoryProducts = ({ categoryId, navigation }) => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage 
  } = useCategoryProducts(categoryId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const products = data?.pages?.flatMap(page => page.products) ?? [];

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    return null;
  };

  return (
    <Provider>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            navigation={navigation}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </Provider>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});

export default CategoryProducts;