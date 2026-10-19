import { Link, Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@/store';
import { isSessionValid } from '@/services/authService';

export default function CheckoutScreen() {
  const { token, user, isLoggedIn } = useAppSelector((state) => state.auth);
  // Guard the screen itself so direct links and browser refreshes are covered.
  if (!isLoggedIn || !isSessionValid({ token, user })) {
    return <Redirect href={{ pathname: '/auth', params: { returnTo: '/checkout' } }} />;
  }
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="title">Thanh toán</ThemedText>
        <ThemedText>Bạn đang thanh toán với tài khoản {user?.name}.</ThemedText>
        <ThemedText>{user?.email}</ThemedText>
        <Link href="/" replace><ThemedText type="link">Về Home</ThemedText></Link>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', padding: 24, gap: 20 },
});
