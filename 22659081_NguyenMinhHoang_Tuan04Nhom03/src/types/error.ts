// Định nghĩa cấu trúc CustomError theo yêu cầu đề bài
export interface CustomError {
  name: string;
  message: string;
  statusCode?: number;
  url?: string;
  timestamp?: string;
}
