export function authDestination(value: unknown): '/' | '/checkout' | `/books/${string}` {
  if (value === '/checkout') return value;
  if (typeof value === 'string' && /^\/books\/[a-zA-Z0-9_-]+$/.test(value)) {
    return value as `/books/${string}`;
  }
  return '/';
}