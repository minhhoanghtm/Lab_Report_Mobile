import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookService, type Book } from '@/services/bookService';
import { BookReviews } from '@/components/book-reviews';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BookDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = typeof params.id === 'string' ? params.id : '';
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    if (!id) return;
    bookService.getById(id, controller.signal).then((value) => {
      if (!controller.signal.aborted) { setBook(value); setError(''); }
    }).catch((cause) => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Không thể tải sách.');
    });
    return () => controller.abort();
  }, [id, attempt]);
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Link href="/" replace><ThemedText type="linkPrimary">← Trang chủ</ThemedText></Link>
            {!id || error ? (
              <>
                <ThemedText accessibilityRole="alert">{error || 'Mã sách không hợp lệ.'}</ThemedText>
                {!!id && <Pressable accessibilityRole="button" style={styles.retry}
                  onPress={() => { setError(''); setAttempt((value) => value + 1); }}>
                  <ThemedText type="linkPrimary">Thử lại</ThemedText>
                </Pressable>}
              </>
            ) : !book || book.id !== id ? <ActivityIndicator size="large" /> : (
              <>
                <Image source={{ uri: book.cover }} contentFit="contain" accessibilityLabel={`Bìa sách ${book.title}`} style={styles.cover} />
                <ThemedText type="subtitle">{book.title}</ThemedText>
                <ThemedText>Tác giả: {book.author}</ThemedText>
                <ThemedText themeColor="textSecondary">{book.genre} · {book.pages} trang</ThemedText>
                <ThemedText>{book.available ? 'Còn hàng' : 'Tạm hết hàng'}</ThemedText>
                <BookReviews key={book.id} bookId={book.id} />
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 24, gap: 18 },
  cover: { width: '100%', height: 260, borderRadius: 16 }, retry: { minHeight: 44, justifyContent: 'center' },
});