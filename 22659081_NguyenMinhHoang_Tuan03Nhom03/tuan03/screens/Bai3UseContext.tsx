import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  UserProvider,
  defaultUser,
  useUser,
} from '../contexts/UserContext';

// Component con ProfileScreen nhận dữ liệu từ Context
const ProfileScreen = () => {
  const { user, logout, login } = useUser();

  if (!user) {
    return (
      <View style={styles.loggedOutBox}>
        <Text style={styles.loggedOutText}>Bạn đã đăng xuất khỏi hệ thống.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => login(defaultUser)}
        >
          <Text style={styles.loginButtonText}>Đăng nhập lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* 1. Mở rộng: Ảnh đại diện */}
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      {/* Tên người dùng */}
      <Text style={styles.name}>{user.name}</Text>

      {/* 1. Mở rộng: Email người dùng */}
      <Text style={styles.email}>{user.email}</Text>

      {/* 2. Mở rộng: Nút Đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

// Component chính bao bọc bởi UserProvider (3. Mở rộng: Tái sử dụng Context riêng)
const Bai3UseContext = () => {
  return (
    <UserProvider>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Bài 3: useContext</Text>
        <ProfileScreen />
      </View>
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    backgroundColor: '#dee2e6',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loggedOutBox: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  loggedOutText: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Bai3UseContext;
