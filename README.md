# JStudy - Website Học JavaScript

## Giới thiệu:
**JStudy** là một nền tảng học lập trình trực tuyến, giúp người dùng nâng cao kỹ năng lập trình JavaScript qua các bài học lý thuyết và bài tập thực hành. Người dùng có thể làm bài tập trực tiếp trên trình biên dịch online của website. Các bài tập được thiết kế theo nhiều mức độ khó khác nhau và có hệ thống điểm số để người dùng theo dõi tiến độ học tập của mình.

Website hỗ trợ người dùng đăng nhập thông qua các tài khoản bên thứ ba như Google, GitHub, và Facebook. Người dùng có thể tham gia thảo luận, xem kết quả điểm và xếp hạng cá nhân dựa trên tổng điểm của các bài tập.

## 1. Giới thiệu Hệ thống:
Ứng dụng học JavaScript cho phép người dùng học các lý thuyết JavaScript và làm bài tập thực hành. Các bài tập sẽ có phần lý thuyết và phần thực hành, với một trình biên dịch (compiler) online tích hợp sẵn để người dùng có thể lập trình trực tiếp trên web. Sau khi người dùng chạy các bài tập và vượt qua test cases, họ sẽ nhận được điểm và có thể tham gia vào hệ thống xếp hạng. Mỗi bài tập sẽ có một phần bình luận để người dùng có thể thảo luận.

## 2. Chức năng Hệ thống:

### Chức năng cho người dùng (GUEST và USER):
1. **Khách (GUEST):**
   - Xem danh sách các bài tập công khai.
   - Xem lý thuyết và bài tập thực hành (code editor).
   - Được phép tham gia bình luận dưới bài tập.

2. **Người dùng (USER):**
   - Tất cả quyền của **GUEST**.
   - Đăng ký, đăng nhập thông qua tài khoản Google, GitHub hoặc Facebook.
   - Làm bài tập và chạy mã nguồn trong trình biên dịch online.
   - Nhận điểm dựa trên kết quả các test case.
   - Theo dõi tổng điểm của mình và xếp hạng.
   - Tham gia bình luận và thảo luận dưới mỗi bài tập.
   - Thực hiện các bài tập phù hợp với trình độ của mình (beginner, intermediate, advanced).
   - Xem thống kê điểm số cho từng bài học đã làm.

3. **Quản trị viên (ADMIN):**
   - Quản lý bài tập (Tạo, sửa, xóa bài tập).
   - Quản lý người dùng (Xem, chỉnh sửa thông tin người dùng).
   - Quản lý bình luận và duyệt bình luận.
   - Xem thống kê và báo cáo hoạt động.

---

## 3. Quy trình Đăng nhập và Xác thực:

- **Đăng nhập với Google, GitHub, và Facebook**:
  - Người dùng có thể đăng nhập vào hệ thống bằng tài khoản **Google**, **GitHub**, hoặc **Facebook**.
  - **OAuth2** sẽ được sử dụng để xác thực và lấy thông tin người dùng từ các dịch vụ này.
  - Người dùng sẽ được chuyển hướng về trang dashboard của họ sau khi đăng nhập thành công.

**Quy trình đăng nhập:**
1. Người dùng chọn phương thức đăng nhập (Google, GitHub, Facebook).
2. Xác thực thông qua OAuth2.
3. Lưu thông tin người dùng (username, email, profile image, v.v.) vào hệ thống.
4. Sau khi đăng nhập thành công, người dùng được chuyển hướng tới dashboard và có thể bắt đầu học.

---

## 4. Cấu trúc và Tính năng Chính của Hệ thống:

### Frontend (React + Vite + TailwindCSS)

- **Chức năng**:
  - Hiển thị lý thuyết về JavaScript cho mỗi bài học.
  - Trình biên dịch (compiler) online tích hợp để người dùng có thể chạy mã JavaScript trực tiếp trên website.
  - Cập nhật điểm sau khi người dùng chạy bài và vượt qua các test case.
  - Thống kê điểm và xếp hạng người dùng.
  - Bình luận, thảo luận dưới mỗi bài tập.
  - Xem thống kê điểm số chi tiết cho từng bài học.

- **Thư viện và công cụ**:
  - **React**: Quản lý UI và trạng thái người dùng.
  - **Vite**: Công cụ xây dựng và phát triển nhanh.
  - **TailwindCSS**: Tạo giao diện người dùng linh hoạt và đẹp mắt.
  - **Monaco Editor**: Trình biên dịch (code editor) để người dùng có thể viết và chạy mã.

### Backend (Express + MongoDB)

- **Chức năng**:
  - **Quản lý người dùng**: Thực hiện đăng ký, đăng nhập và lấy thông tin người dùng.
  - **Quản lý bài tập**: Tạo và cập nhật bài tập JavaScript cho người dùng.
  - **Xử lý điểm và xếp hạng**: Tính điểm dựa trên kết quả test case khi người dùng chạy bài.
  - **Quản lý bình luận**: Thêm, sửa, xóa các bình luận dưới bài tập.
  - **Quản lý LessonScore**: Lưu trữ và trả về thống kê điểm số cho từng bài học của người dùng.

- **Thư viện**:
  - **Express**: Tạo RESTful API cho backend.
  - **Mongoose**: Quản lý kết nối và thao tác với MongoDB.
  - **Passport.js**: Đăng nhập OAuth với Google, GitHub, và Facebook.
  - **JWT**: Cung cấp token cho người dùng khi đăng nhập.
  - **Bcryptjs**: Mã hóa mật khẩu khi cần thiết.

---

## 5. Cấu trúc Thư mục (Backend)

```plaintext
src/
├── controllers/
│   ├── authController.ts         # Xử lý xác thực người dùng (Google, GitHub, Facebook)
│   ├── exerciseController.ts     # Xử lý bài tập
│   ├── userController.ts         # Quản lý người dùng
│   ├── commentController.ts      # Quản lý bình luận
│   ├── lessonScoreController.ts  # Quản lý điểm số cho từng bài học
│   └── rankingController.ts      # Xử lý xếp hạng
├── models/
│   ├── User.ts
│   ├── Exercise.ts
│   ├── Comment.ts
│   ├── LessonScore.ts
│   └── Ranking.ts
├── routes/
│   ├── authRoutes.ts
│   ├── exerciseRoutes.ts
│   ├── userRoutes.ts
│   ├── commentRoutes.ts
│   ├── lessonScoreRoutes.ts
│   └── rankingRoutes.ts
├── middleware/
│   ├── authMiddleware.ts        # Kiểm tra JWT Token
│   ├── validationMiddleware.ts  # Kiểm tra tính hợp lệ của dữ liệu gửi lên
│   └── errorMiddleware.ts       # Xử lý lỗi toàn cục
├── services/
│   ├── authService.ts           # Xử lý đăng nhập với Google, Facebook, GitHub
│   ├── exerciseService.ts       # Xử lý logic bài tập
│   ├── userService.ts           # Xử lý người học
│   ├── commentService.ts        # Xử lý bình luận
│   ├── lessonScoreService.ts    # Xử lý điểm số cho từng bài học
│   └── rankingService.ts        # Xử lý xếp hạng
├── config/
│   ├── db.ts                    # Kết nối MongoDB
│   └── oauthConfig.ts           # Cấu hình OAuth
└── utils/
    └── helperFunctions.ts       # Các hàm tiện ích
