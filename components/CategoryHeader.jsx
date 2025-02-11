import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Chip } from 'react-native-paper';

const CategoryHeader = ({ categories, selectedId, onSelect }) => {
  return (
    <View>
      <Card style={styles.heroCard}>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
      </Card>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            mode={selectedId === category.id ? "flat" : "outlined"}
            selected={selectedId === category.id}
            onPress={() => onSelect(category.id)}
            style={styles.categoryChip}
            showSelectedCheck={false}
          >
            {category.name}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    margin: 16,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginight: 200,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
});

export default CategoryHeader;