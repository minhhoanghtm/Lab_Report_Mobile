import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from '@/store';
import { restoreSession } from '@/store/uthSlice';

void SplashScreen.preventAutoHideAsync().catch(() => {});
function RootNavigator() {
  const dispatch = useAppDispatch();
  const { isReady } = useAppSelector((state) => state.auth);
  useEffect(() => { void dispatch(restoreSession()); }, [dispatch]);
  useEffect(() => {
    if (isReady) void SplashScreen.hideAsync().catch(() => {});
  }, [isReady]);
  if (!isReady) {
    return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="books/[id]" />
    </Stack>
  );
}
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}
