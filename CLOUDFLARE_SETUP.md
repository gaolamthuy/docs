# 🔧 Hướng dẫn Setup Cloudflare Pages cho Decap CMS

## 📋 Yêu cầu

1. **GitHub Repository**: `gaolamthuy/assets`
2. **GitHub OAuth App**: Đã tạo với callback URL đúng
3. **Cloudflare Pages**: Đã deploy project

## 🔐 Bước 1: Tạo GitHub OAuth App

1. Truy cập: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Điền thông tin:
   - **Application name**: `Gạo Lâm Thúy Assets CMS`
   - **Homepage URL**: `https://assets.gaolamthuy.vn`
   - **Authorization callback URL**: `https://assets.gaolamthuy.vn/api/auth`
4. Click **"Register application"**
5. **Lưu lại**:
   - **Client ID**
   - **Client Secret** (click "Generate a new client secret" nếu chưa có)

## 🌐 Bước 2: Thêm Environment Variables trong Cloudflare Pages

1. Vào Cloudflare Dashboard → Pages → Chọn project `assets`
2. Vào **Settings** → **Environment Variables**
3. Thêm các biến sau:

```
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

4. **Quan trọng**: Chọn **Production**, **Preview**, và **Branch** để apply cho tất cả environments

## ✅ Bước 3: Kiểm tra cấu hình

1. Đảm bảo file `admin/config.yml` có:
   ```yaml
   backend:
     name: github
     repo: gaolamthuy/assets
     branch: main
     base_url: https://assets.gaolamthuy.vn
     auth_endpoint: api/auth
   ```

2. Đảm bảo có file `functions/api/auth.js` để xử lý OAuth

3. Deploy lại project nếu cần

## 🧪 Bước 4: Test

1. Truy cập: `https://assets.gaolamthuy.vn/admin/`
2. Click **"Login with GitHub"**
3. Authorize ứng dụng
4. Bạn sẽ được redirect về và có thể sử dụng CMS

## 🐛 Troubleshooting

### Lỗi 404 khi login

- Kiểm tra `base_url` và `auth_endpoint` trong `config.yml` có đúng không
- Kiểm tra GitHub OAuth App callback URL có đúng không
- Kiểm tra Environment Variables đã được set chưa

### Lỗi "Not Found" từ api.netlify.com

- Đảm bảo đã xóa Netlify Identity Widget script khỏi `admin/index.html`
- Đảm bảo đã có `functions/api/auth.js`

### Lỗi authentication failed

- Kiểm tra `GITHUB_CLIENT_ID` và `GITHUB_CLIENT_SECRET` đã đúng chưa
- Kiểm tra GitHub OAuth App có quyền truy cập repo không
- Kiểm tra user đăng nhập có quyền push vào repo không

## 📚 Tài liệu tham khảo

- [Decap CMS Docs](https://decapcms.org/docs/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

