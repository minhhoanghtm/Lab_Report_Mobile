import React from 'react';
import { Image, View, Text, StyleSheet, Pressable, Alert } from 'react-native';

export const Avatar = ({ url, fallbackText = 'SV' }) => {
  const handleAvatarPress = () => {
    Alert.alert('Ảnh đại diện', 'Tính năng thay đổi ảnh đại diện đang được phát triển!');
  };

  return (
    <Pressable
      onPress={handleAvatarPress}
      accessibilityRole="button"
      accessibilityLabel="Thay đổi ảnh đại diện"
      accessibilityHint="Nhấn đúp để chọn ảnh đại diện mới cho sinh viên"
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.75 : 1.0,
          transform: [{ scale: pressed ? 0.95 : 1.0 }],
        }
      ]}
    >
      {url ? (
        <Image
          source={{ uri: url }}
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>{fallbackText}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginVertical: 10,
    // Đảm bảo vùng chạm tối thiểu 48x48 cho phím hình ảnh
    minWidth: 48,
    minHeight: 48,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#1976D2',
    borderWidth: 2.5,
  },
  fallbackContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#1976D2',
    borderWidth: 2.5,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
});
