import { useRef, useState } from 'react';
import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService, isSessionValid } from '@/services/authService';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginSuccess } from '@/store/uthSlice';
import { validateEmail, validatePassword } from '@/utils/validation';
import { authDestination } from '@/utils/auth-destination';

type Field = 'name' | 'email' | 'password';
export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const isLoggedIn = useAppSelector((state) =>
    state.auth.isLoggedIn && isSessionValid(state.auth));
  // Only allow known destinations supplied by this app.
  const destination = authDestination(returnTo);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [error, setError] = useState('');
  const registering = mode === 'register';
  const errors = {
    name: values.name.trim() ? '' : 'Vui lòng nhập họ tên.',
    email: validateEmail(values.email) ? '' : 'Vui lòng nhập email đúng định dạng.',
    password: validatePassword(values.password) ? '' : 'Mật khẩu phải có ít nhất 6 ký tự.',
  };
  function update(field: Field, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setTouched((previous) => ({ ...previous, [field]: true }));
    setError('');
  }
  async function submit() {
    if (submitting.current) return;
    setTouched({ name: true, email: true, password: true });
    setError('');
    if (errors.email || errors.password || (registering && errors.name)) return;
    submitting.current = true;
    setBusy(true);
    try {
      const email = values.email.trim();
      const session = registering
        ? await authService.register(values.name.trim(), email, values.password)
        : await authService.login(email, values.password);
      await dispatch(loginSuccess(session));
      // Redirect below runs after the persisted session reaches Redux.
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể kết nối. Vui lòng thử lại.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  if (isLoggedIn) return <Redirect href={destination.startsWith('/books/')
    ? { pathname: '/books/[id]', params: { id: destination.slice('/books/'.length) } }
    : destination as '/' | '/checkout'} />;
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>{registering ? 'Tạo tài khoản' : 'Chào mừng trở lại'}</Text>
            <Text style={styles.subtitle}>
              {destination === '/checkout' ? 'Đăng nhập để tiếp tục thanh toán' :
                destination.startsWith('/books/') ? 'Đăng nhập để viết đánh giá sách' : 'Đăng nhập để tiếp tục đến Home'}
            </Text>
            <View style={styles.tabs} accessibilityRole="tablist">
              {(['login', 'register'] as const).map((tab) => (
                <Pressable key={tab} accessibilityRole="tab"
                  accessibilityState={{ selected: mode === tab, disabled: busy }}
                  disabled={busy} style={[styles.tab, mode === tab && styles.activeTab]}
                  onPress={() => {
                    setMode(tab); setTouched({}); setError('');
                    setValues((previous) => ({ ...previous, password: '' }));
                  }}>
                  <Text style={[styles.tabText, mode === tab && styles.activeText]}>
                    {tab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                  </Text>
                </Pressable>
              ))}
            </View>
            {registering && (
              <View style={styles.field}>
                <Text style={styles.label}>Họ tên</Text>
                <TextInput accessibilityLabel="Họ tên" value={values.name} editable={!busy}
                  autoComplete="name" placeholder="Nguyễn Văn A" placeholderTextColor="#64748b"
                  style={[styles.input, touched.name && !!errors.name && styles.invalid]}
                  onChangeText={(value) => update('name', value)}
                  onBlur={() => setTouched((previous) => ({ ...previous, name: true }))} />
                {touched.name && !!errors.name && <Text accessibilityLiveRegion="polite" style={styles.error}>{errors.name}</Text>}
              </View>
            )}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput accessibilityLabel="Email" value={values.email} editable={!busy}
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                autoComplete="email" placeholder="ban@example.com" placeholderTextColor="#64748b"
                style={[styles.input, touched.email && !!errors.email && styles.invalid]}
                onChangeText={(value) => update('email', value)}
                onBlur={() => setTouched((previous) => ({ ...previous, email: true }))} />
              {touched.email && !!errors.email && <Text accessibilityLiveRegion="polite" style={styles.error}>{errors.email}</Text>}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput key={mode} accessibilityLabel="Mật khẩu" value={values.password}
                editable={!busy} secureTextEntry autoCapitalize="none" autoCorrect={false}
                autoComplete={registering ? 'new-password' : 'current-password'}
                placeholder="Ít nhất 6 ký tự" placeholderTextColor="#64748b" returnKeyType="done"
                style={[styles.input, touched.password && !!errors.password && styles.invalid]}
                onChangeText={(value) => update('password', value)}
                onBlur={() => setTouched((previous) => ({ ...previous, password: true }))}
                onSubmitEditing={() => void submit()} />
              {touched.password && !!errors.password && <Text accessibilityLiveRegion="polite" style={styles.error}>{errors.password}</Text>}
            </View>
            {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy, busy }}
              disabled={busy} onPress={() => void submit()}
              style={({ pressed }) => [styles.button, (busy || pressed) && styles.dimmed]}>
              {busy ? <ActivityIndicator color="#fff" /> :
                <Text style={styles.buttonText}>{registering ? 'Đăng ký' : 'Đăng nhập'}</Text>}
            </Pressable>
            <Link href="/" replace disabled={busy} style={styles.subtitle}>Về Home</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 440, backgroundColor: '#fff', borderRadius: 24, padding: 24, gap: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475569', fontSize: 15 },
  tabs: { flexDirection: 'row', padding: 4, borderRadius: 12, backgroundColor: '#f1f5f9' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 9 },
  activeTab: { backgroundColor: '#2563eb' },
  tabText: { color: '#475569', fontWeight: '600' },
  activeText: { color: '#fff' },
  field: { gap: 8 },
  label: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, fontSize: 16, color: '#0f172a', backgroundColor: '#fff' },
  invalid: { borderColor: '#dc2626' },
  error: { color: '#b91c1c', fontSize: 13 },
  button: { minHeight: 50, borderRadius: 12, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  dimmed: { opacity: 0.65 },
});
