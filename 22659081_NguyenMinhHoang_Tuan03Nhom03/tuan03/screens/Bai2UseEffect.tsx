import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

const Bai2UseEffect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('Chưa kết nối');
  
  useEffect(() => {
    if (isConnected) {
      setMessage('Thiết bị đã kết nối');
    } else {
      setMessage('Thiết bị đã ngắt kết nối');
    }
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài 2: Theo dõi trạng thái kết nối</Text>

      {/* Switch bật/tắt kết nối */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Bật/Tắt kết nối:</Text>
        <Switch
          value={isConnected}
          onValueChange={setIsConnected}
          thumbColor={isConnected ? '#28a745' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81c784' }}
        />
      </View>

      {/* Trạng thái kết nối với màu sắc động */}
      <View style={styles.statusBox}>
        <Text
          style={[
            styles.messageText,
            { color: isConnected ? '#28a745' : '#dc3545' },
          ]}
        >
          {message}
        </Text>

      
      </View>
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
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  statusBox: {
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  messageText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default Bai2UseEffect;
