import React from 'react';
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function CategoryItem({ category, isSelected, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.containerSelected]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={category.image} style={styles.image} />
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  containerSelected: {
    backgroundColor: '#fca31120',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eaeaea',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },
  textSelected: {
    color: '#fca311',
    fontWeight: '700',
  },
});
