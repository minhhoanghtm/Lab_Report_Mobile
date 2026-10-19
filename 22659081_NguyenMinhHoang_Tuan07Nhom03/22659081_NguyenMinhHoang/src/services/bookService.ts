export const BOOKS_URL = (process.env.EXPO_PUBLIC_BOOKS_API_URL ??
  'https://6a080e88fa9b27c848fa953c.mockapi.io/books').replace(/\/$/, '');

export type Book = {
  id: string; title: string; author: string; genre: string;
  pages: number; rating: number; cover: string; available: boolean;
  reviews?: unknown[];
};
type ApiBook = Omit<Book, 'id'> & { id: string | number };
function isBook(value: unknown): value is ApiBook {
  if (!value || typeof value !== 'object') return false;
  if ('recordType' in value && value.recordType === 'review') return false;
  const book = value as Partial<Book>;
  return (typeof book.id === 'string' || (typeof book.id === 'number' && Number.isFinite(book.id))) && typeof book.title === 'string' &&
    typeof book.author === 'string' && typeof book.genre === 'string' &&
    typeof book.pages === 'number' && typeof book.cover === 'string' &&
    typeof book.available === 'boolean';
}
export const bookService = {
  async getAll(signal?: AbortSignal): Promise<Book[]> {
    const response = await fetch(BOOKS_URL, { signal });
    if (!response.ok) throw new Error('Không thể tải danh sách sách.');
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Dữ liệu sách không hợp lệ.');
    return data.filter(isBook).map((book) => ({ ...book, id: String(book.id) }));
  },
  async getById(id: string, signal?: AbortSignal): Promise<Book> {
    const response = await fetch(`${BOOKS_URL}/${encodeURIComponent(id)}`, { signal });
    // Some imported MockAPI records have numeric IDs: collection GET contains
    // them, while the individual endpoint looks up string IDs and returns 404.
    if (response.status === 404) {
      const books = await bookService.getAll(signal);
      const book = books.find((item) => item.id === String(id));
      if (book) return book;
      throw new Error('Không tìm thấy sách.');
    }
    if (!response.ok) throw new Error('Không thể tải thông tin sách.');
    const data: unknown = await response.json();
    if (!isBook(data)) throw new Error('Dữ liệu sách không hợp lệ.');
    return { ...data, id: String(data.id) };
  },
};
