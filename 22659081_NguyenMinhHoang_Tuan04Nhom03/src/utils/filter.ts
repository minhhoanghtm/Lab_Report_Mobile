/**
 * Hàm Generic lọc danh sách theo thuộc tính 'name'
 * Áp dụng Generic <T extends { name: string }> để:
 * 1. Đảm bảo mọi object truyền vào đều phải có trường 'name' kiểu string.
 * 2. Giữ nguyên đầy đủ kiểu dữ liệu T của các phần tử khi trả về mảng kết quả.
 * 3. Tái sử dụng linh hoạt cho bất kỳ kiểu dữ liệu nào (Sinh viên, Sản phẩm, Thành phố,...).
 */
export function filterByName<T extends { name: string }>(
  items: T[],
  keyword: string
): T[] {
  if (!keyword || keyword.trim() === "") {
    return items;
  }

  const normalizedKeyword = keyword.trim().toLowerCase();

  return items.filter((item) =>
    item.name.toLowerCase().includes(normalizedKeyword)
  );
}
