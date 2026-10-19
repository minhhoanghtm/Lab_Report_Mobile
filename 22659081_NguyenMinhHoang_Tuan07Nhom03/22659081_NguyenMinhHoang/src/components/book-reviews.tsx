import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { RatingStars } from './rating-stars';
import { averageRating, reviewService, type Review } from '@/services/reviewService';
import { isSessionValid } from '@/services/authService';
import { useAppSelector } from '@/store';
import { useTheme } from '@/hooks/use-theme';

export function BookReviews({ bookId }: { bookId: string }) {
  const auth = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const signedIn = auth.isLoggedIn && isSessionValid(auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    reviewService.getByBook(bookId, controller.signal).then((data) => {
      if (!controller.signal.aborted) { setReviews(data); setLoadError(''); }
    }).catch((cause) => {
      if (!controller.signal.aborted) setLoadError(cause instanceof Error ? cause.message : 'Không thể tải đánh giá.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => { mounted.current = false; controller.abort(); };
  }, [bookId, attempt]);

  async function submit() {
    if (lock.current || loading || loadError) return;
    setSubmitted(true);
    setSubmitError('');
    setSuccess(false);
    if (!signedIn || !auth.token || !auth.user) {
      router.push({ pathname: '/auth', params: { returnTo: `/books/${bookId}` } });
      return;
    }
    if (!rating || !comment.trim()) return;
    lock.current = true;
    setBusy(true);
    try {
      const review = await reviewService.create(bookId, rating, comment, { token: auth.token, user: auth.user });
      if (!mounted.current) return;
      setReviews((previous) => [review, ...previous.filter((item) => item.id !== review.id)]);
      setComment('');
      setRating(0);
      setSubmitted(false);
      setSuccess(true);
    } catch (cause) {
      if (mounted.current) setSubmitError(cause instanceof Error ? cause.message : 'Không thể gửi đánh giá.');
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  const average = averageRating(reviews);
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle">Đánh giá</ThemedText>
      {loading ? <ActivityIndicator accessibilityLabel="Đang tải đánh giá" /> : loadError ? (
        <View style={styles.section}>
          <ThemedText accessibilityRole="alert" style={styles.error}>{loadError}</ThemedText>
          <Pressable accessibilityRole="button" onPress={() => { setLoading(true); setAttempt((value) => value + 1); }} style={styles.linkButton}>
            <ThemedText type="linkPrimary">Thử lại</ThemedText>
          </Pressable>
        </View>
      ) : (
        <>
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText style={styles.average}>{reviews.length ? average.toFixed(1) : '—'} / 5</ThemedText>
            <RatingStars value={average} size={28} />
            <ThemedText themeColor="textSecondary">{reviews.length} đánh giá</ThemedText>
          </ThemedView>
          {!reviews.length && <ThemedText themeColor="textSecondary">Chưa có đánh giá. Hãy chia sẻ cảm nhận đầu tiên!</ThemedText>}
          {reviews.map((review) => (
            <ThemedView key={review.id} type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">{review.userName}</ThemedText>
              <RatingStars value={review.rating} size={18} />
              <ThemedText>{review.comment}</ThemedText>
            </ThemedView>
          ))}
        </>
      )}
      {signedIn ? (
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">Viết đánh giá của bạn</ThemedText>
          <RatingStars value={rating} size={28} onChange={(value) => { setRating(value); setSuccess(false); }} disabled={busy} />
          {submitted && !rating && <ThemedText style={styles.error}>Vui lòng chọn số sao.</ThemedText>}
          <TextInput multiline maxLength={1000} value={comment} editable={!busy}
            accessibilityLabel="Bình luận đánh giá" placeholder="Bạn cảm nhận thế nào về cuốn sách?"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            onChangeText={(value) => { setComment(value); setSuccess(false); }} />
          <ThemedText type="small" themeColor="textSecondary">{comment.length}/1000 ký tự</ThemedText>
          {submitted && !comment.trim() && <ThemedText style={styles.error}>Vui lòng nhập bình luận.</ThemedText>}
          {!!submitError && <ThemedText accessibilityRole="alert" style={styles.error}>{submitError}</ThemedText>}
          {success && <ThemedText accessibilityLiveRegion="polite" style={styles.success}>Đã gửi đánh giá!</ThemedText>}
          <Pressable accessibilityRole="button" disabled={busy || loading || !!loadError}
            accessibilityState={{ disabled: busy || loading || !!loadError, busy }} onPress={() => void submit()}
            style={({ pressed }) => [styles.button, (busy || loading || !!loadError || pressed) && styles.dimmed]}>
            {busy ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Gửi đánh giá</ThemedText>}
          </Pressable>
        </ThemedView>
      ) : (
        <Pressable accessibilityRole="button" style={styles.button}
          onPress={() => router.push({ pathname: '/auth', params: { returnTo: `/books/${bookId}` } })}>
          <ThemedText style={styles.buttonText}>Đăng nhập để đánh giá</ThemedText>
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: 18 }, card: { padding: 18, borderRadius: 16, gap: 10 },
  average: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 110, textAlignVertical: 'top', fontSize: 16 },
  error: { color: '#dc2626', fontSize: 14 }, success: { color: '#15803d' },
  button: { minHeight: 48, borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb' },
  buttonText: { color: '#fff', fontWeight: '600' }, dimmed: { opacity: 0.5 },
  linkButton: { minHeight: 44, justifyContent: 'center' },
});