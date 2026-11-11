# 🌿 HabitFlow — App Theo Dõi Thói Quen & Năng Suất Cá Nhân

> **HabitFlow** là ứng dụng di động React Native (Expo) hoàn chỉnh giúp người dùng xây dựng lối sống kỷ luật, theo dõi tiến độ hàng ngày với chuỗi streak rực lửa, biểu đồ trực quan, nhật ký check-in và hệ thống thông báo nhắc nhở thông minh.
> Giao diện hiện đại mang sắc **xanh lá nhạt (Sage Green)** dịu mát, tinh tế, tối ưu trải nghiệm người dùng và responsive mượt mà trên mọi kích thước màn hình.

---

## ✨ Điểm Nổi Bật & Tính Năng Chi Tiết

### 1. 🚀 Onboarding Cá Nhân Hóa (3 Slide)
* Giới thiệu giá trị cốt lõi của ứng dụng.
* Chọn lĩnh vực mục tiêu cá nhân (*Sức khỏe, Học tập, Thiền & Tâm trí, Năng suất*).
* Thiết lập **Giờ nhắc nhở mặc định** và xin quyền cấp thông báo.
* Dữ liệu được lưu vào `AsyncStorage` (chỉ xuất hiện trong lần đầu mở app).

### 2. 🔐 Xác Thực & Quản Lý Tài Khoản (Offline-First / Simulated API)
* **Đăng ký / Đăng nhập:** Hệ thống API Service không đồng bộ kết hợp lưu trữ cục bộ bảo mật qua `AsyncStorage`.
* **Khởi tạo thông minh:** Ngay khi đăng ký thành công, ứng dụng tự động nạp sẵn **bộ thói quen mẫu** tương ứng với mục tiêu đã chọn ở Onboarding để người dùng trải nghiệm ngay mà không bị trống màn hình.
* **Quên mật khẩu:** Cơ chế tra cứu tài khoản và hiển thị mật khẩu an toàn trực tiếp trên máy.

### 3. 🏠 Tab Home — Theo Dõi Hôm Nay
* **Header động:** Lời chào thay đổi theo thời gian thực (*Chào buổi sáng ☀️ / chiều 🌿 / tối 🌙*) kèm ngày tháng định dạng tiếng Việt và Avatar người dùng.
* **Thanh 7 ngày trong tuần (WeekStrip):** Bấm chọn nhanh bất kỳ ngày nào trong tuần để xem hoặc kiểm tra tiến độ.
* **Vòng tròn tiến độ (ProgressCircle SVG):** Hiển thị trực quan tỷ lệ % hoàn thành trong ngày kèm danh ngôn động viên thay đổi theo mức độ đạt được.
* **Bộ lọc nhanh (Filter Tabs):** Chuyển đổi linh hoạt giữa *Tất cả*, *Chưa xong*, *Đã xong* kèm số lượng đếm thực tế.
* **Thẻ thói quen tương tác cao (`HabitCard`):**
  * **Cơ chế linh hoạt:**
    * Thói quen 1 lần/ngày: Checkbox tick hoàn thành kèm hiệu ứng và rung phản hồi (Haptic feedback).
    * Thói quen nhiều lần/ngày (VD: Uống 8 cốc nước): Bộ đếm `+1` kèm thanh tiến độ mini (`3/8 cốc`).
  * **Ghi chú nhanh (Daily Note):** Nút bút viết nhật ký / cảm nghĩ ngắn cho từng thói quen trong ngày.
  * **Vuốt mượt mà (Gesture Reanimated):**
    * **Vuốt phải:** Mở nhanh màn hình Chỉnh sửa thói quen.
    * **Vuốt trái:** Xóa thói quen kèm hộp thoại cảnh báo và tự động hủy lịch nhắc nhở.
  * **Bấm vào thẻ:** Mở màn hình Chi tiết thói quen (`HabitDetailModal`).
* **Nút bấm nổi (+ Floating Action Button):** Tạo thói quen mới nhanh chóng ở mọi thời điểm.

### 4. 📝 Thêm / Sửa Thói Quen (`AddHabitModal`)
* Tên thói quen *(bắt buộc)*, mô tả / động lực *(tùy chọn)*.
* Bảng chọn biểu tượng (16 Icons phân loại khoa học).
* Bảng màu nhận diện (10 sắc thái pastel & nổi bật).
* Tần suất lặp lại: **Hàng ngày** hoặc **Chọn các thứ trong tuần** (T2, T3, T4, T5, T6, T7, CN).
* Thiết lập mục tiêu số lần/ngày và đơn vị đo (*lần, cốc, trang, phút...*).
* Cài đặt giờ gửi thông báo nhắc nhở (`reminderTime`).

### 5. 🔍 Chi Tiết Thói Quen (`HabitDetailModal`)
* Xem tổng quan hiệu suất riêng biệt của 1 thói quen: Chuỗi streak hiện tại, Chuỗi kỷ lục, Tổng lượt hoàn thành, Lịch lặp lại.
* Danh sách nhật ký ghi chú (Notes history) mà bạn đã từng viết cho thói quen đó theo từng ngày.
* Tùy chọn chỉnh sửa hoặc xóa thói quen.

### 6. 📊 Tab Stats — Thống Kê & Phân Tích Năng Suất
* **4 Thẻ chỉ số KPI:** Streak hiện tại, Streak kỷ lục, Tổng số lượt hoàn thành, Tỉ lệ hoàn thành trung bình.
* **Biểu đồ cột tuần (SVG Bar Chart):** Cột tiến độ 7 ngày trong tuần với nhãn số liệu và hiệu ứng ngày hôm nay.
* **Heatmap 12 tuần kiểu GitHub:** Lưới ô vuông thể hiện cường độ hoàn thành thói quen theo tuần (màu xanh lá nhạt đậm dần theo độ chăm chỉ).
* **Hiệu suất từng thói quen:** Danh sách các thói quen kèm thanh Progress Bar và tỷ lệ % để người dùng biết thói quen nào đang làm tốt nhất.

### 7. 📅 Tab Calendar — Lịch Tháng & Bù Lịch
* Lịch tháng tiếng Việt (`react-native-calendars`) đánh dấu các chấm xanh tại những ngày có thói quen hoàn thành.
* Bấm chọn ngày bất kỳ để xem danh sách thói quen và nhật ký ghi chú của ngày đó.
* **Hỗ trợ Backfill (Tick bù quá khứ):** Cho phép bạn hoàn thành bù nếu hôm qua lỡ quên vào app, nhưng khóa chặn an toàn các ngày trong tương lai.

### 8. ⚙️ Tab Profile — Cài Đặt & Dữ Liệu
* **Thông tin cá nhân:** Tùy chọn ảnh đại diện từ thư viện máy (`expo-image-picker`) và chỉnh sửa tên hiển thị.
* **Dark / Light Mode:** Đổi giao diện tối / sáng tức thì.
* **Cài đặt thông báo:** Bật/tắt thông báo toàn cục, đổi giờ nhắc nhở mặc định.
* **Xuất dữ liệu (Export JSON):** Xuất toàn bộ habits & logs ra file `.json` để lưu trữ dự phòng (`expo-sharing` & `expo-file-system`).
* **Khôi phục dữ liệu (Import JSON):** Nhập dữ liệu từ file backup (`expo-document-picker`) và tự động lập lại lịch nhắc.
* **Xóa dữ liệu & Đăng xuất:** Bảo mật và xóa sạch trạng thái khi cần.

---

## 🛠️ Tech Stack & Kiến Trúc

* **Nền tảng:** React Native 0.88 + Expo SDK 58 (TypeScript 100% strict type-safe).
* **Điều hướng:** React Navigation v7 (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`).
* **Quản trị State:** Zustand (nhẹ, nhanh, phân tách `useAuthStore`, `useHabitStore`, `useThemeStore`).
* **Lưu trữ Cục bộ & API:** `@react-native-async-storage/async-storage` kết hợp kiến trúc `apiService` sẵn sàng tích hợp Backend REST API thực tế.
* **Giao diện & Đồ họa:** `react-native-svg` (Progress circle & charts), `@expo/vector-icons`, `react-native-calendars`.
* **Cử chỉ & Xúc giác:** `react-native-gesture-handler` (ReanimatedSwipeable), `expo-haptics`.
* **Xử lý Tệp & Thiết bị:** `expo-notifications`, `expo-image-picker`, `expo-document-picker`, `expo-file-system`, `expo-sharing`.
* **Thời gian & Thuật toán:** `date-fns`, thuật toán tính streak thông minh bỏ qua ngày không có lịch.

---

## 📁 Cấu Trúc Thư Mục

```text
HabitFlow/
├── src/
│   ├── types/                  # Định nghĩa TypeScript toàn cục (Habit, HabitLog, User, Stats)
│   ├── theme/                  # Bảng màu Sage Green (Light & Dark), Typography, Spacing, Shadow
│   ├── utils/                  # dateHelpers, streakCalculator (thuật toán streak), habitTemplates
│   ├── services/
│   │   ├── storageService.ts   # Wrapper AsyncStorage
│   │   ├── apiService.ts       # Tầng API bất đồng bộ (sẵn sàng kết nối backend)
│   │   ├── notificationService.ts # Quản lý thông báo định kỳ
│   │   └── backupService.ts    # Xuất / Nhập JSON qua Sharing & DocumentPicker
│   ├── store/
│   │   ├── useThemeStore.ts    # Quản lý Dark/Light mode
│   │   ├── useAuthStore.ts     # Quản lý phiên đăng nhập & cài đặt người dùng
│   │   └── useHabitStore.ts    # Quản lý CRUD thói quen, nhật ký, streak, bộ lọc
│   ├── components/
│   │   ├── Header.tsx          # Lời chào theo giờ, ngày tháng, avatar
│   │   ├── HabitCard.tsx       # Thẻ thói quen vuốt trái (xóa), vuốt phải (sửa), checkbox & counter
│   │   ├── ProgressCircle.tsx  # Vòng tròn SVG % tiến độ và quote động viên
│   │   ├── WeekStrip.tsx       # Thanh 7 ngày trong tuần
│   │   ├── FilterTabs.tsx      # Bộ lọc Tất cả / Chưa xong / Đã xong
│   │   ├── NoteModal.tsx       # Hộp thoại viết nhật ký phản hồi
│   │   ├── HeatmapChart.tsx    # Lưới đóng góp 12 tuần kiểu GitHub
│   │   ├── EmptyState.tsx      # Trạng thái rỗng kèm nút hành động
│   │   └── CustomButton.tsx    # Nút bấm tái sử dụng
│   ├── screens/
│   │   ├── OnboardingScreen.tsx# 3 slide giới thiệu, chọn mục tiêu, giờ nhắc
│   │   ├── LoginScreen.tsx     # Đăng nhập (hỗ trợ nút Demo điền nhanh)
│   │   ├── RegisterScreen.tsx  # Đăng ký (tự động tạo thói quen mẫu khởi đầu)
│   │   ├── ForgotPasswordScreen.tsx # Tra cứu mật khẩu an toàn
│   │   ├── HomeScreen.tsx      # Màn hình chính
│   │   ├── StatsScreen.tsx     # Thống kê, biểu đồ tuần, heatmap
│   │   ├── CalendarScreen.tsx  # Lịch tháng & tick bù quá khứ
│   │   ├── ProfileScreen.tsx   # Cài đặt, đổi avatar, sao lưu dữ liệu
│   │   ├── AddHabitModal.tsx   # Modal thêm/sửa thói quen
│   │   └── HabitDetailModal.tsx# Modal chi tiết thói quen & nhật ký
│   └── navigation/
│       ├── types.ts            # Type-safe navigation params
│       ├── RootNavigator.tsx   # Điều hướng phân quyền Auth / Main + Modals
│       ├── AuthNavigator.tsx   # Stack Onboarding, Login, Register, ForgotPassword
│       └── TabNavigator.tsx    # Bottom Tab Bar
├── App.tsx                     # Điểm khởi chạy ứng dụng
├── babel.config.js             # Cấu hình Reanimated plugin
├── package.json
└── README.md
```

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

### 1. Cài đặt môi trường
Đảm bảo máy đã cài đặt Node.js và thiết bị di động có ứng dụng **Expo Go** (hoặc chạy trên trình duyệt Web/máy ảo).

### 2. Khởi chạy dự án
Mở terminal tại thư mục dự án `HabitFlow` và chạy:
```bash
npx expo start
```

### 3. Trải nghiệm trên thiết bị:
* **Điện thoại thật:** Mở ứng dụng **Expo Go**, quét mã QR hiển thị trên Terminal để mở app ngay lập tức.
* **Trình duyệt Web:** Nhấn phím `w` trên terminal.
* **Android Emulator:** Nhấn phím `a`.
* **iOS Simulator:** Nhấn phím `i`.
* **Tài khoản Demo nhanh:** Tại màn hình Đăng nhập, có sẵn nút *"Điền nhanh tài khoản mẫu (Demo)"* để bạn có thể vào trải nghiệm các tính năng ngay mà không cần tốn thời gian gõ phím!
