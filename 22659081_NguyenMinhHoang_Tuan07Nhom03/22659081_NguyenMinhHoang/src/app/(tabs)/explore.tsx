import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/uthSlice';

export default function AccountScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signOut() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await dispatch(logout());
      router.replace('/');
    } catch {
      setError('Không thể đăng xuất. Vui lòng thử lại.');
    } finally { setBusy(false); }
  }
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Tài khoản</ThemedText>
          <ThemedText themeColor="textSecondary">Thông tin cá nhân và phiên đăng nhập của bạn.</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.avatar}>
              <ThemedText style={styles.initial}>{user?.name.trim().charAt(0).toUpperCase() || '?'}</ThemedText>
            </View>
            <ThemedText style={styles.name}>{user?.name || 'Khách'}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.email}>
              {user?.email || 'Đăng nhập để quản lý tài khoản và thanh toán.'}
            </ThemedText>
          </ThemedView>
          {user ? (
            <Pressable accessibilityRole="button" disabled={busy}
              accessibilityState={{ disabled: busy, busy }} onPress={() => void signOut()}
              style={({ pressed }) => [styles.logout, (pressed || busy) && styles.pressed]}>
              {busy ? <ActivityIndicator color="#b91c1c" /> :
                <ThemedText style={styles.logoutText}>Đăng xuất</ThemedText>}
            </Pressable>
          ) : (
            <Pressable accessibilityRole="button" onPress={() => router.push('/auth')}
              style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <ThemedText style={styles.primaryText}>Đăng nhập / Đăng ký</ThemedText>
            </Pressable>
          )}
          {!!error && <ThemedText accessibilityRole="alert" style={styles.logoutText}>{error}</ThemedText>}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 24, paddingTop: 36, paddingBottom: 32, gap: 20 },
  card: { borderRadius: 24, padding: 24, alignItems: 'center', gap: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#1d4ed8', fontSize: 30, fontWeight: '700', lineHeight: 38 },
  name: { fontSize: 22, fontWeight: '700', lineHeight: 30, textAlign: 'center' },
  email: { textAlign: 'center' },
  primary: { minHeight: 50, padding: 12, borderRadius: 12, backgroundColor: '#2563eb', alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  logout: { minHeight: 50, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ef4444', alignItems: 'center' },
  logoutText: { color: '#b91c1c' },
  pressed: { opacity: 0.65 },
});