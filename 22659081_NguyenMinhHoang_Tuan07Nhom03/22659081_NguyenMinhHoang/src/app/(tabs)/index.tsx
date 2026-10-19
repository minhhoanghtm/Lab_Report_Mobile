import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@/store';
import { BookCatalog } from '@/components/book-catalog';

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <ThemedText type="smallBold" style={styles.brand}>BOOKSTORE</ThemedText>
            <ThemedText type="subtitle">Trang chủ</ThemedText>
            <ThemedText themeColor="textSecondary">
              {user ? `Xin chào, ${user.name}!` : 'Chào mừng bạn đến với Bookstore.'}
            </ThemedText>
          </View>
          <View style={styles.hero}>
            <TextLabel />
            <ThemedText style={styles.heroTitle}>Sẵn sàng cho đơn hàng tiếp theo</ThemedText>
            <ThemedText style={styles.heroDescription}>
              Truy cập thanh toán và quản lý tài khoản của bạn ngay tại đây.
            </ThemedText>
            <Pressable accessibilityRole="button" onPress={() => router.push('/checkout')}
              style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <ThemedText style={styles.primaryText}>Thanh toán →</ThemedText>
            </Pressable>
          </View>
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">{user ? 'Tài khoản của bạn' : 'Bạn chưa đăng nhập'}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {user ? user.email : 'Đăng nhập hoặc tạo tài khoản để tiếp tục thanh toán.'}
            </ThemedText>
            <Pressable accessibilityRole="button"
              onPress={() => router.push(user ? '/explore' : '/auth')}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
              <ThemedText style={styles.secondaryText}>
                {user ? 'Xem tài khoản' : 'Đăng nhập / Đăng ký'}
              </ThemedText>
            </Pressable>
          </ThemedView>
          <BookCatalog />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
function TextLabel() {
  return <ThemedText style={styles.heroLabel}>MUA SẮM THUẬN TIỆN</ThemedText>;
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 24, paddingBottom: 32, gap: 24, width: '100%', maxWidth: 640, alignSelf: 'center' },
  header: { gap: 10, paddingTop: 12 },
  brand: { color: '#2563eb', letterSpacing: 3 },
  hero: { backgroundColor: '#172554', borderRadius: 24, padding: 24, gap: 18 },
  heroLabel: { color: '#93c5fd', fontSize: 12, letterSpacing: 1.5 },
  heroTitle: { color: '#fff', fontSize: 28, lineHeight: 36, fontWeight: '700' },
  heroDescription: { color: '#dbeafe' },
  primary: { backgroundColor: '#2563eb', borderRadius: 12, minHeight: 50, padding: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  card: { borderRadius: 20, padding: 22, gap: 14 },
  secondary: { borderWidth: 1, borderColor: '#2563eb', borderRadius: 12, minHeight: 48, padding: 10, alignItems: 'center' },
  secondaryText: { color: '#2563eb', fontWeight: '600' },
  pressed: { opacity: 0.75 },
});
