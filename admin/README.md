# 📚 Hướng dẫn Setup Decap CMS cho Quản lý Assets

Hướng dẫn chi tiết để thiết lập Decap CMS (trước đây là Netlify CMS) để quản lý assets (hình ảnh, icons, logos) trên GitHub.

## 📋 Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Yêu cầu](#yêu-cầu)
3. [Cài đặt](#cài-đặt)
4. [Cấu hình GitHub OAuth](#cấu-hình-github-oauth)
5. [Cấu hình Repository](#cấu-hình-repository)
6. [Deployment](#deployment)
7. [Sử dụng](#sử-dụng)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Giới thiệu

Decap CMS là một Git-based CMS cho phép bạn quản lý nội dung và assets trực tiếp trên GitHub thông qua giao diện web thân thiện. Không cần kiến thức về Git để sử dụng.

### Tính năng

- ✅ Quản lý hình ảnh, icons, logos
- ✅ Upload files trực tiếp qua giao diện web
- ✅ Tự động commit vào GitHub
- ✅ Version control tự động
- ✅ Giao diện tiếng Việt
- ✅ Hỗ trợ nhiều định dạng: SVG, PNG, JPG, GIF, WebP

---

## 📦 Yêu cầu

1. **GitHub Repository**: Repository chứa code của bạn
2. **GitHub Account**: Tài khoản GitHub với quyền push vào repository
3. **Website đã deploy**: Netlify, Vercel, hoặc hosting khác (để chạy Decap CMS)

---

## 🚀 Cài đặt

### Bước 1: Kiểm tra cấu trúc file

Đảm bảo bạn đã có các file sau:

```
docs/
├── admin/
│   ├── index.html      ✅ (Đã tạo)
│   ├── config.yml      ✅ (Đã tạo)
│   └── README.md       ✅ (File này)
└── assets/
    ├── images/
    ├── icons/
    └── logos/
```

### Bước 2: Cập nhật config.yml

Mở file `docs/admin/config.yml` và cập nhật thông tin repository:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name  # ⚠️ THAY ĐỔI Ở ĐÂY
  branch: main  # hoặc master
```

**Ví dụ:**
```yaml
backend:
  name: github
  repo: hophamlam/gaolamthuy
  branch: main
```

---

## 🔐 Cấu hình GitHub OAuth

Decap CMS cần GitHub OAuth để xác thực và push code vào repository.

### Cách 1: Sử dụng GitHub OAuth App (Khuyến nghị)

#### Bước 1: Tạo GitHub OAuth App

1. Truy cập: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Điền thông tin:
   - **Application name**: `Gạo Lâm Thúy CMS` (hoặc tên bạn muốn)
   - **Homepage URL**: `https://your-site.netlify.app` (URL website của bạn)
   - **Authorization callback URL**: 
     - Nếu dùng Netlify: `https://your-site.netlify.app/api/auth`
     - Nếu dùng Vercel: `https://your-site.vercel.app/api/auth`
     - Nếu dùng hosting khác: `https://your-domain.com/api/auth`

4. Click **"Register application"**
5. **Lưu lại**:
   - **Client ID**
   - **Client Secret** (click "Generate a new client secret" nếu chưa có)

#### Bước 2: Thêm Environment Variables

**Nếu deploy trên Netlify:**

1. Vào Netlify Dashboard → Site settings → Environment variables
2. Thêm các biến:
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

**Nếu deploy trên Vercel:**

1. Vào Vercel Dashboard → Project settings → Environment Variables
2. Thêm các biến tương tự

**Nếu deploy trên hosting khác:**

Thêm vào file `.env` hoặc cấu hình server của bạn.

### Cách 2: Sử dụng GitHub App (Nâng cao)

GitHub App cho phép kiểm soát quyền truy cập tốt hơn. Xem hướng dẫn tại: https://decapcms.org/docs/github-backend/

---

## ⚙️ Cấu hình Repository

### Bước 1: Đảm bảo quyền truy cập

- Repository phải là **public** hoặc bạn phải có quyền **write** nếu là private
- User đăng nhập vào CMS phải có quyền push vào repository

### Bước 2: Kiểm tra branch

Đảm bảo branch trong `config.yml` khớp với branch chính của repository (thường là `main` hoặc `master`).

---

## 🌐 Deployment

### Option 1: Netlify (Khuyến nghị - Dễ nhất)

#### Bước 1: Kết nối Repository

1. Đăng nhập Netlify: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Chọn GitHub và chọn repository của bạn
4. Cấu hình build:
   - **Build command**: (để trống hoặc `npm run build` nếu có)
   - **Publish directory**: `docs` (hoặc thư mục chứa website của bạn)

#### Bước 2: Thêm Netlify Identity

1. Vào **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Chọn **"Git Gateway"** để kích hoạt GitHub authentication

#### Bước 3: Thêm OAuth App (nếu chưa có)

Netlify tự động tạo OAuth App cho bạn, nhưng bạn có thể dùng OAuth App tự tạo như hướng dẫn ở trên.

#### Bước 4: Truy cập CMS

Sau khi deploy, truy cập: `https://your-site.netlify.app/admin/`

### Option 2: Vercel

1. Deploy project lên Vercel
2. Thêm environment variables (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
3. Tạo API route cho authentication (xem docs Vercel)
4. Truy cập: `https://your-site.vercel.app/admin/`

### Option 3: GitHub Pages

1. Enable GitHub Pages trong repository settings
2. Chọn branch và folder chứa website
3. Truy cập: `https://your-username.github.io/repo-name/admin/`

**Lưu ý**: GitHub Pages không hỗ trợ server-side authentication, cần setup thêm.

---

## 💻 Sử dụng

### Truy cập CMS

1. Mở trình duyệt và truy cập: `https://your-site.com/admin/`
2. Click **"Login with GitHub"**
3. Authorize ứng dụng
4. Bắt đầu quản lý assets!

### Quản lý Assets

#### Upload hình ảnh mới

1. Chọn collection **"📷 Hình Ảnh"**
2. Click **"New Hình ảnh"**
3. Điền thông tin:
   - Tên file
   - Mô tả (tùy chọn)
   - Upload hình ảnh
   - Alt text (tùy chọn)
   - Tags (tùy chọn)
4. Click **"Save"** hoặc **"Publish"**

#### Quản lý Icons

1. Chọn collection **"🎨 Icons"**
2. Upload icon mới hoặc chỉnh sửa icon hiện có
3. Thêm metadata: kích thước, màu sắc, mô tả

#### Quản lý Logos

1. Chọn collection **"🏢 Logos"** hoặc **"🏷️ Logos - Brand"**
2. Upload logo mới
3. Chọn loại logo, kích thước, định dạng

### Xem lịch sử thay đổi

Mọi thay đổi đều được commit vào GitHub. Bạn có thể xem lịch sử tại:
- GitHub repository → Commits
- Hoặc trong CMS, mỗi entry có link đến commit tương ứng

---

## 🔧 Troubleshooting

### Lỗi: "Failed to load config.yml"

**Nguyên nhân**: File config.yml không được tìm thấy hoặc có lỗi syntax.

**Giải pháp**:
1. Kiểm tra file `docs/admin/config.yml` tồn tại
2. Kiểm tra syntax YAML (dùng YAML validator online)
3. Đảm bảo indentation đúng (dùng spaces, không dùng tabs)

### Lỗi: "No backend defined"

**Nguyên nhân**: Backend chưa được cấu hình đúng.

**Giải pháp**:
1. Kiểm tra phần `backend` trong `config.yml`
2. Đảm bảo `repo` đúng format: `owner/repo-name`
3. Đảm bảo branch tồn tại

### Lỗi: "Authentication failed"

**Nguyên nhân**: GitHub OAuth chưa được setup đúng.

**Giải pháp**:
1. Kiểm tra Client ID và Client Secret đã được thêm vào environment variables
2. Kiểm tra Authorization callback URL đúng
3. Nếu dùng Netlify, đảm bảo đã enable Identity và Git Gateway

### Lỗi: "Permission denied"

**Nguyên nhân**: User không có quyền push vào repository.

**Giải pháp**:
1. Đảm bảo GitHub account có quyền write vào repository
2. Nếu repository là private, cần thêm user vào collaborators
3. Kiểm tra OAuth App có đủ permissions

### Files không hiển thị sau khi upload

**Nguyên nhân**: Đường dẫn `media_folder` hoặc `public_folder` không đúng.

**Giải pháp**:
1. Kiểm tra `media_folder` trong `config.yml` đúng với cấu trúc thư mục
2. Kiểm tra `public_folder` đúng với URL public của website
3. Đảm bảo files được commit vào đúng branch

### CMS không load trên localhost

**Nguyên nhân**: Decap CMS cần server để chạy, không thể chạy trực tiếp từ file://

**Giải pháp**:
1. Chạy local server: `python -m http.server 8000` hoặc `npx serve docs`
2. Truy cập: `http://localhost:8000/admin/`
3. Hoặc deploy lên Netlify/Vercel để test

---

## 📖 Tài liệu tham khảo

- [Decap CMS Official Docs](https://decapcms.org/docs/)
- [GitHub Backend Setup](https://decapcms.org/docs/github-backend/)
- [Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Widgets Documentation](https://decapcms.org/docs/widgets/)

---

## 🆘 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra lại các bước trong hướng dẫn
2. Xem [Troubleshooting](#troubleshooting) ở trên
3. Tham khảo [Decap CMS Community](https://github.com/decaporg/decap-cms/discussions)

---

## ✅ Checklist Setup

- [ ] Đã tạo file `docs/admin/index.html`
- [ ] Đã tạo file `docs/admin/config.yml`
- [ ] Đã cập nhật `repo` và `branch` trong `config.yml`
- [ ] Đã tạo GitHub OAuth App
- [ ] Đã thêm `GITHUB_CLIENT_ID` và `GITHUB_CLIENT_SECRET` vào environment variables
- [ ] Đã deploy website lên Netlify/Vercel
- [ ] Đã enable Identity (nếu dùng Netlify)
- [ ] Đã test truy cập `/admin/` và login thành công
- [ ] Đã test upload file và kiểm tra commit trên GitHub

---

**Chúc bạn setup thành công! 🎉**

