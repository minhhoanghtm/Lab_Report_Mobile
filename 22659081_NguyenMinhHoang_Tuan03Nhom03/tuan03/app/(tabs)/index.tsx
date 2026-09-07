import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bai1UseState from '@/screens/Bai1UseState';
import Bai2UseEffect from '@/screens/Bai2UseEffect';
import Bai3UseContext from '@/screens/Bai3UseContext';
import Bai4UseReducer from '@/screens/Bai4UseReducer';
import Bai5UseMemoCallback from '@/screens/Bai5UseMemoCallback';
import TodoAppScreen from '@/screens/TodoAppScreen';

type TabKey = 'bai1' | 'bai2' | 'bai3' | 'bai4' | 'bai5' | 'todo';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'bai1', label: 'Bài 1 (useState)' },
  { key: 'bai2', label: 'Bài 2 (useEffect)' },
  { key: 'bai3', label: 'Bài 3 (useContext)' },
  { key: 'bai4', label: 'Bài 4 (useReducer)' },
  { key: 'bai5', label: 'Bài 5 (useMemo)' },
  { key: 'todo', label: '📝 Todo App' },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('todo');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Thanh cuộn ngang (Horizontal ScrollView) để chuyển tab thoải mái */}
        <View style={styles.tabBarWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarScroll}
          >
            {tabs.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.tabTextActive]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Vùng hiển thị màn hình của bài tương ứng */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'bai1' && <Bai1UseState />}
          {activeTab === 'bai2' && <Bai2UseEffect />}
          {activeTab === 'bai3' && <Bai3UseContext />}
          {activeTab === 'bai4' && <Bai4UseReducer />}
          {activeTab === 'bai5' && <Bai5UseMemoCallback />}
          {activeTab === 'todo' && <TodoAppScreen />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  tabBarWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  tabBarScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tabButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});