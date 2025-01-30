import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useCategories } from '../services/queries';
import CategoryHeader from '../components/CategoryHeader'; 
import CategoryProducts from '../components/CategoryProducts';

const Home = ({ navigation }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const { 
    data: categories = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useCategories();

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

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

  return (
    <View style={styles.container}>
      <CategoryHeader
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />
      {selectedCategoryId && (
        <CategoryProducts categoryId={selectedCategoryId} navigation= {navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;