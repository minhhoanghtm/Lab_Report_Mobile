import { isSessionValid, type AuthResponse } from './authService';

import { BOOKS_URL } from './bookService';
const REVIEWS_URL = BOOKS_URL;
export type Review = {
  recordType: 'review'; id: string; bookId: string; userId: string; userName: string;
  rating: number; comment: string; createdAt: string;
};
function isReview(value: unknown): value is Review {
  if (!value || typeof value !== 'object') return false;
  const review = value as Partial<Review>;
  return review.recordType === 'review' && typeof review.id === 'string' && typeof review.bookId === 'string' &&
    typeof review.userId === 'string' && typeof review.userName === 'string' &&
    typeof review.rating === 'number' && Number.isInteger(review.rating) &&
    review.rating >= 1 && review.rating <= 5 &&
    typeof review.comment === 'string' && typeof review.createdAt === 'string';
}
export function averageRating(reviews: readonly Review[]): number {
  return reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
}
function embeddedReviews(value: unknown, bookId: string): Review[] {
  if (!value || typeof value !== 'object' || !('reviews' in value) || !Array.isArray(value.reviews)) return [];
  return value.reviews.flatMap((item: unknown, index: number): Review[] => {
    if (!item || typeof item !== 'object') return [];
    const review = item as Partial<Omit<Review, 'userId' | 'id'>> & {
      userId?: string | number; id?: string | number;
    };
    if ((typeof review.userId !== 'string' && typeof review.userId !== 'number') ||
      typeof review.userName !== 'string' || typeof review.rating !== 'number' ||
      !Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5 ||
      typeof review.comment !== 'string') return [];
    return [{
      recordType: 'review', id: `embedded-${bookId}-${review.id ?? index}`,
      bookId, userId: String(review.userId), userName: review.userName,
      rating: review.rating, comment: review.comment,
      createdAt: typeof review.createdAt === 'string' ? review.createdAt : '',
    }];
  });
}
export const reviewService = {
  async getByBook(bookId: string, signal?: AbortSignal): Promise<Review[]> {
    // Read the collection so an empty list stays distinct from a missing resource (404).
    const response = await fetch(REVIEWS_URL, { signal });
    if (!response.ok) throw new Error('Không thể tải đánh giá. Vui lòng thử lại sau.');
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Dữ liệu đánh giá không hợp lệ.');
    // Invalid generated MockAPI seed records must not affect the five-star average.
    const book = data.find((item: unknown) => item && typeof item === 'object' &&
      'id' in item && String(item.id) === bookId &&
      (!('recordType' in item) || item.recordType !== 'review'));
    return [...embeddedReviews(book, bookId),
      ...data.filter(isReview).filter((review) => review.bookId === bookId)]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async create(bookId: string, rating: number, comment: string, session: AuthResponse): Promise<Review> {
    if (!isSessionValid(session)) throw new Error('Vui lòng đăng nhập lại để đánh giá.');
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Vui lòng chọn từ 1 đến 5 sao.');
    if (!comment.trim() || comment.trim().length > 1000) throw new Error('Bình luận cần từ 1 đến 1000 ký tự.');
    const payload = {
      recordType: 'review', bookId, userId: session.user.id, userName: session.user.name,
      rating, comment: comment.trim(), createdAt: new Date().toISOString(),
    };
    const response = await fetch(REVIEWS_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Không thể gửi đánh giá. Vui lòng thử lại.');
    const review: unknown = await response.json();
    if (!isReview(review) || review.bookId !== bookId ||
      review.userId !== payload.userId || review.rating !== rating) {
      throw new Error('Dữ liệu đánh giá trả về không hợp lệ.');
    }
    return review;
  },
};
