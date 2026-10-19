const API_URL = (
  process.env.EXPO_PUBLIC_AUTH_API_URL ??
  'https://6a080e88fa9b27c848fa953c.mockapi.io/users'
).replace(/\/$/, '');

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
};
type MockUser = User & { password: string };
export type AuthResponse = { token: string; user: User };

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false;
  const user = value as Partial<User>;
  return typeof user.id === 'string' && user.id.length > 0 &&
    typeof user.name === 'string' && typeof user.email === 'string';
}
export function isAuthResponse(value: unknown): value is AuthResponse {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<AuthResponse>;
  return typeof session.token === 'string' && session.token.trim().length > 0 &&
    isUser(session.user);
}

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// MockAPI sessions use an issuance timestamp instead of a server-signed token.
export function isSessionValid(value: unknown, now = Date.now()): value is AuthResponse {
  if (!isAuthResponse(value)) return false;
  const prefix = `mock-token-${value.user.id}-`;
  if (!value.token.startsWith(prefix)) return false;
  const timestamp = value.token.slice(prefix.length);
  if (!/^\d+$/.test(timestamp)) return false;
  const issuedAt = Number(timestamp);
  return Number.isSafeInteger(issuedAt) && issuedAt > 0 &&
    issuedAt <= now && now - issuedAt < SESSION_MAX_AGE_MS;
}
function isMockUser(value: unknown): value is MockUser {
  return isUser(value) && 'password' in value && typeof value.password === 'string';
}
const normalizeEmail = (email: string) => email.trim().toLowerCase();

async function getUsers(): Promise<MockUser[]> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Không thể tải tài khoản. Vui lòng thử lại.');
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isMockUser)) {
    throw new Error('Dữ liệu tài khoản từ API không hợp lệ.');
  }
  return data;
}
function createSession(record: MockUser): AuthResponse {
  // MockAPI has no auth endpoint. This token only represents a demo session.
  // Explicitly select public fields so the password never reaches Redux/storage.
  const user: User = { id: record.id, name: record.name, email: record.email };
  if (typeof record.avatar === 'string') user.avatar = record.avatar;
  if (typeof record.createdAt === 'string') user.createdAt = record.createdAt;
  return { token: `mock-token-${record.id}-${Date.now()}`, user };
}
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const users = await getUsers();
    const user = users.find((item) =>
      normalizeEmail(item.email) === normalizeEmail(email) && item.password === password);
    if (!user) throw new Error('Email hoặc mật khẩu không đúng.');
    return createSession(user);
  },
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = normalizeEmail(email);
    const users = await getUsers();
    if (users.some((item) => normalizeEmail(item.email) === normalizedEmail)) {
      throw new Error('Email đã được sử dụng.');
    }
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: normalizedEmail, password }),
    });
    if (!response.ok) throw new Error('Không thể tạo tài khoản. Vui lòng thử lại.');
    const user: unknown = await response.json();
    if (!isMockUser(user)) throw new Error('Dữ liệu tài khoản từ API không hợp lệ.');
    return createSession(user);
  },
};
