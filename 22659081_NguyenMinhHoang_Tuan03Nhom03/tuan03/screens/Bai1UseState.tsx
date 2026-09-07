import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Bai1UseState = () => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');

  const parsedAge = parseInt(age, 10);
  const isUnder18 = age.trim() !== '' && !isNaN(parsedAge) && parsedAge < 18;

  const handleReset = () => {
    setFullName('');
    setAge('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài 1: useState</Text>

      {/* Input Họ tên */}
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nhập họ tên..."
        placeholderTextColor="#999"
      />

      {/* Input Tuổi */}
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Nhập tuổi..."
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      {/* Nút Xóa dữ liệu */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Xóa dữ liệu</Text>
      </TouchableOpacity>

      {/* Kết quả hiển thị */}
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          {fullName.trim() ? `Họ tên: ${fullName}` : 'Vui lòng nhập họ tên'}
        </Text>
        {age.trim() !== '' && (
          <Text style={styles.resultText}>
            Tuổi: {!isNaN(parsedAge) ? parsedAge : 'Không hợp lệ'}
          </Text>
        )}
      </View>

      {/* Cảnh báo nếu nhỏ hơn 18 tuổi */}
      {isUnder18 && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}> Cảnh báo: Bạn chưa đủ 18 tuổi!</Text>
        </View>
      )}
    </View>
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  resetButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  resultBox: {
    padding: 12,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  resultText: {
    fontSize: 15,
    color: '#0066cc',
    fontWeight: '500',
  },
  warningBox: {
    padding: 10,
    backgroundColor: '#fff1f0',
    borderWidth: 1,
    borderColor: '#ffa39e',
    borderRadius: 8,
  },
  warningText: {
    color: '#cf1322',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Bai1UseState;


