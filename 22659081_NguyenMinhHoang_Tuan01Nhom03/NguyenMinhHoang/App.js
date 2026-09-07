import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Header } from './src/components/Header';
import { Avatar } from './src/components/Avatar';
import { InfoRow } from './src/components/InfoRow';
import { SearchField } from './src/components/SearchField';
import { PressableButton } from './src/components/PressableButton';

export default function App() {
  const [searchText, setSearchText] = useState('');

  const handleSave = () => {
    Alert.alert('Thành công', 'Đã lưu hồ sơ sinh viên Nguyễn Minh Anh!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      {/* Khung viền giả lập điện thoại để giao diện giống hệt ảnh mẫu */}
      <View style={styles.phoneContainer}>
        <Header title="SmartCampus" />

        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
          {/* Thông tin cá nhân */}
          <View style={styles.profileContainer}>
            <Avatar url="https://i.pinimg.com/736x/61/62/2e/61622ec8899cffaa687a8342a84ea525.jpg" fallbackText="SV" />
            <View style={styles.profileTextContainer}>
              <InfoRow info="Nguyễn Minh Anh" style={styles.studentName} />
              <InfoRow info="Mã SV: 24CNTT001" style={styles.studentId} />
            </View>
          </View>

          {/* Ô Tìm Kiếm */}
          <SearchField
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm kiếm thông tin..."
          />

          {/* Hộp Thông Tin Chi Tiết */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Thông tin sinh viên</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                Email: <Text style={styles.cardValue}>minhanh@sv.edu.vn</Text>
              </Text>
              <Text style={styles.cardText}>
                Lớp: <Text style={styles.cardValue}>CNTT-K24</Text>
              </Text>
            </View>
          </View>

          {/* Nút Lưu Hồ Sơ */}
          <View style={styles.buttonWrapper}>
            <PressableButton
              title="LƯU HỒ SƠ"
              disabled={false}
              onPress={handleSave}
              accessibilityLabel="Lưu hồ sơ sinh viên"
              accessibilityHint="Nhấn đúp để lưu thông tin hồ sơ của sinh viên Nguyễn Minh Anh"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Màu nền xám nhạt bên ngoài thiết bị
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneContainer: {
    width: '92%',
    maxWidth: 400,
    height: '95%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#0F172A', // Viền máy đen
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  profileTextContainer: {
    marginLeft: 18,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 15,
    color: '#64748B',
  },
  infoCard: {
    backgroundColor: '#F0F8FF', // Light blue tint
    borderColor: '#90CAF9',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginVertical: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  cardContent: {
    gap: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#475569',
  },
  cardValue: {
    fontWeight: '500',
    color: '#1E293B',
  },
  buttonWrapper: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
});

