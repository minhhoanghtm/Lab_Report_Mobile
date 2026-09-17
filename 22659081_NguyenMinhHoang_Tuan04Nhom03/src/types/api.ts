/**
 * Generic Interface ApiResponse<T> theo đúng yêu cầu đề bài:
 * { data: T[], total: number, page: number }
 */
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
}
