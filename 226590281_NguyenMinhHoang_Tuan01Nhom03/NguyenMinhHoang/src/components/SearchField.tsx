import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const SearchField = ({ value, onChangeText, placeholder = "Tìm kiếm thông tin..." }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#90A4AE"
        style={styles.search}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  search: {
    width: '100%',
    height: 48, // Minimum touch target size >= 48
    borderColor: '#B0BEC5',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F5F7FA',
    fontSize: 16,
    color: '#37474F',
  },
});