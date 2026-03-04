# Global Clean Code Rules

You MUST ALWAYS apply these rules to all code changes.

1.  **Dễ đọc, dễ hiểu**
    *   Code viết cho con người đọc trước, tên biến/hàm/class rõ nghĩa.

2.  **Tên có ý nghĩa**
    *   Tránh tên mơ hồ (x, tmp, data), dùng động từ cho hàm, danh từ cho class.

3.  **Hàm nhỏ – làm đúng 1 việc**
    *   Mỗi hàm chỉ thực hiện một nhiệm vụ duy nhất.

4.  **Không lặp code (DRY)**
    *   Tách logic dùng chung thành hàm hoặc module.

5.  **Mỗi class có 1 trách nhiệm (SRP)**
    *   Không “ôm đồm” nhiều việc trong một class.

6.  **Ít phụ thuộc lẫn nhau (Low Coupling)**
    *   Thay đổi một module không làm vỡ module khác.

7.  **Tránh magic number / magic string**
    *   Dùng hằng số, enum, constant có tên rõ ràng.

8.  **Comment vừa đủ, đúng chỗ**
    *   Giải thích tại sao, không phải đang làm gì.

9.  **Xử lý lỗi rõ ràng**
    *   Bắt đúng loại lỗi, thông báo rõ nguyên nhân.

10. **Dễ test**
    *   Hàm nhỏ, input/output rõ ràng, ít phụ thuộc.

11. **Nhất quán style**
    *   Cùng quy ước đặt tên, format, cấu trúc.

12. **Không code thừa**
    *   Xóa code không dùng, tránh để “cho sau”.
