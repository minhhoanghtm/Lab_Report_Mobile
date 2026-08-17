import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';

export const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight + 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },

  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});