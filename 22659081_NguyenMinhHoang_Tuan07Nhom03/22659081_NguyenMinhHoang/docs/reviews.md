# Đánh giá sách

Không cần tạo resource mới. Sách và review dùng chung resource `/books`:

Hỗ trợ cả ID dạng số và chuỗi. Các đánh giá có sẵn trong mảng `book.reviews` được hiển thị cùng các review tạo bằng POST. Review nhúng không bắt buộc có `id` hoặc `createdAt`; app tạo khóa hiển thị riêng. Ví dụ hai review 5 và 4 sao cho điểm trung bình 4.5, dù trường `book.rating` là 4.8.

- Sách: bản ghi hiện có, không có `recordType: "review"`.
- Review: bản ghi tạo bằng POST `/books`, có `recordType: "review"` và `bookId` liên kết sách.
- Danh sách sách luôn loại các bản ghi review, kể cả khi MockAPI tự sinh thêm trường sách.

Ví dụ body POST:

```json
{
  "recordType": "review",
  "bookId": "1",
  "userId": "1",
  "userName": "Tên người đánh giá",
  "rating": 5,
  "comment": "Nội dung đánh giá",
  "createdAt": "2026-10-19T00:00:00.000Z"
}
```

MockAPI phải giữ các trường trên trong phản hồi POST và các lần GET sau đó. Nếu cấu hình resource loại bỏ trường bổ sung, thêm các trường này vào schema của resource **books hiện có**; không cần tạo resource khác. App chỉ báo gửi thành công khi phản hồi chứa review hợp lệ.

Điểm trung bình tính từ review 1–5 sao của đúng sách. Không dùng trường `rating` giả lập sẵn của sách vì dữ liệu mẫu có giá trị vượt 5. Khi chưa có review, màn hình hiển thị “— / 5”. Sau khi POST thành công, review trả về được thêm vào state và điểm trung bình được tính lại, không gọi lại API sách hoặc tải lại trang.

Đường đi: Trang chủ → Khám phá sách → Chi tiết & đánh giá. Khách có thể đọc review; đăng nhập để gửi và quay về đúng sách sau khi đăng nhập.

Địa chỉ collection có thể cấu hình bằng `EXPO_PUBLIC_BOOKS_API_URL`. Xác thực hiện vẫn là phiên MockAPI giả lập; backend thật cần xác minh token và quyền gửi review phía máy chủ.

Kiểm tra: `node --test scripts/test-auth.cjs scripts/test-reviews.cjs`, `npx expo lint`, `npx tsc --noEmit`. Các kiểm tra POST dùng API giả lập, không tạo review thử trên dữ liệu thật.
