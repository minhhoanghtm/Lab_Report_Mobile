import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export const PressableButton = ({ 
  onPress, 
  title, 
  disabled = false, 
  accessibilityLabel, 
  accessibilityHint 
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : styles.buttonNormal,
        disabled && styles.buttonDisabled,
        {
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: pressed ? 0.85 : 1,
        }
      ]}
    >
      <Text style={[
        styles.buttonText,
        disabled && styles.buttonTextDisabled
      ]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50, // Minimum touch target size >= 48
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonNormal: {
    backgroundColor: '#1976D2', // BÌNH THƯỜNG
  },
  buttonPressed: {
    backgroundColor: '#0D47A1', // ĐANG NHẤN
  },
  buttonDisabled: {
    backgroundColor: '#CFD8DC', // VÔ HIỆU
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: '#90A4AE',
  },
});
