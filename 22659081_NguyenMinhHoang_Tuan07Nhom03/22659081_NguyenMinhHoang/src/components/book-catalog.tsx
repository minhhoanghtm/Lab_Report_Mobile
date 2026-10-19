import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { bookService, type Book } from '@/services/bookService';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [limit, setLimit] = useState(8);
  useEffect(() => {
    const controller = new AbortController();
    bookService.getAll(controller.signal).then((data) => {
      if (!controller.signal.aborted) { setBooks(data); setError(''); }
    }).catch(() => {
      if (!controller.signal.aborted) setError('Không thể tải sách. Vui lòng thử lại.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  return (
    <View style={styles.list}>
      <ThemedText type="subtitle">Khám phá sách</ThemedText>
      {loading ? <ActivityIndicator /> : error ? (
        <Pressable accessibilityRole="button" onPress={() => { setLoading(true); setAttempt((value) => value + 1); }} style={styles.action}>
          <ThemedText accessibilityRole="alert">{error}</ThemedText>
          <ThemedText type="linkPrimary">Thử lại</ThemedText>
        </Pressable>
      ) : !books.length ? <ThemedText>Chưa có sách.</ThemedText> : books.slice(0, limit).map((book) => (
        <Pressable key={book.id} accessibilityRole="button" accessibilityLabel={`Xem chi tiết ${book.title}`}
          onPress={() => router.push({ pathname: '/books/[id]', params: { id: book.id } })}>
          <ThemedView type="backgroundElement" style={styles.card}>
            <Image source={{ uri: book.cover }} contentFit="cover" style={styles.cover} />
            <View style={styles.description}>
              <ThemedText type="smallBold">{book.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{book.author}</ThemedText>
              <ThemedText type="linkPrimary">Chi tiết & đánh giá →</ThemedText>
            </View>
          </ThemedView>
        </Pressable>
      ))}
      {!loading && !error && books.length > limit &&
        <Pressable accessibilityRole="button" style={styles.action} onPress={() => setLimit((value) => value + 8)}>
          <ThemedText type="linkPrimary">Xem thêm sách</ThemedText>
        </Pressable>}
    </View>
  );
}
const styles = StyleSheet.create({
  list: { gap: 16 }, card: { flexDirection: 'row', gap: 16, padding: 16, borderRadius: 16 },
  cover: { width: 64, height: 90, borderRadius: 8 }, description: { flex: 1, gap: 6 },
  action: { minHeight: 48, justifyContent: 'center' },
});