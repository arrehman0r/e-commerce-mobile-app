import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { COLORS, fontConfig } from '../theme'; 
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
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useCategoryProducts(categoryId);

  const products = data?.pages?.flatMap(page => page.products) ?? [];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator 
          size="large" 
          color={COLORS.PRIMARY}
          animating={true}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error?.message || 'An error occurred while fetching products'}
        </Text>
      </View>
    );
  }

  const handleRefresh = () => {
    refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator 
            size="small" 
            color={COLORS.PRIMARY}
            animating={true}
          />
        </View>
      );
    }
    return null;
  };

  return (
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
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          colors={[COLORS.PRIMARY]}
          tintColor={COLORS.PRIMARY}
          progressBackgroundColor={COLORS.BACKGROUND}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    ...fontConfig.bodyLarge,
    color: COLORS.ERROR,
    textAlign: 'center',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    ...fontConfig.bodyLarge,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  }
});

export default CategoryProducts;