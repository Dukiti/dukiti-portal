# Dukiti Portal

Technical Portal cá nhân — tổng hợp tài nguyên kỹ thuật (docs, repo, tools, design, notes)
với tìm kiếm và lọc theo danh mục. Dựng bằng **Vite + React + Tailwind + shadcn/ui**,
deploy tĩnh trên **GitHub Pages**.

## Chạy ở máy

```bash
npm install      # cài dependencies (cần Node.js >= 18)
npm run dev      # chạy dev server, mở http://localhost:5173
npm run build    # build ra thư mục dist/
npm run preview  # xem thử bản build
```

## Thêm / sửa tài nguyên

Mở `src/data/resources.js` — toàn bộ nội dung nằm ở đây, không cần đụng tới code giao diện.

- Mỗi tài nguyên cần: `title`, `description`, `url`, `category`, `icon`, `tags`.
- `category` phải khớp một `id` trong mảng `categories`.
- `icon` là tên icon từ https://lucide.dev/icons (vd: `Github`, `Smartphone`).
  Khi dùng icon mới, mở `src/components/Icon.jsx` và thêm icon đó vào phần import + `registry`.

## Deploy lên GitHub Pages (tự động bằng GitHub Actions)

1. Sửa `base` trong `vite.config.js` cho khớp tên repo:
   - Repo `github.com/<user>/dukiti-portal` → `base: '/dukiti-portal/'`
   - Repo `github.com/<user>/<user>.github.io` → `base: '/'`
2. Push code lên branch `main`.
3. Trên GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
4. Mỗi lần push lên `main`, workflow `.github/workflows/deploy.yml` sẽ tự build và deploy.
   Link truy cập hiện trong tab **Actions** hoặc **Settings → Pages**.

## Cấu trúc

```
src/
  data/resources.js      <- SỬA Ở ĐÂY để thêm/bớt tài nguyên
  components/
    ui/                  <- component shadcn (button, card, input, badge)
    Sidebar.jsx          <- thanh bên + danh mục
    ResourceCard.jsx     <- thẻ tài nguyên
    ThemeToggle.jsx      <- nút sáng/tối
    Icon.jsx             <- registry icon
  App.jsx                <- logic search + filter
  index.css              <- theme (CSS variables, màu accent)
```

Đổi màu chủ đạo: sửa biến `--primary` (và các biến liên quan) trong `src/index.css`.
