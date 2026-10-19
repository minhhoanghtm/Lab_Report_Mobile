import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabNavigator() {
  const theme = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: theme.textSecondary,
      tabBarStyle: { backgroundColor: theme.background, borderTopColor: theme.backgroundElement },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      tabBarHideOnKeyboard: true,
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Trang chủ',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>⌂</Text>,
      }} />
      <Tabs.Screen name="explore" options={{
        title: 'Tài khoản',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>◉</Text>,
      }} />
    </Tabs>
  );
}