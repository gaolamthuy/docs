# ⚡ Quick Setup Guide - Decap CMS

Hướng dẫn setup nhanh trong 5 phút.

## 🎯 Bước 1: Cập nhật config.yml

Mở `docs/admin/config.yml` và thay đổi:

```yaml
backend:
  repo: your-username/your-repo-name  # ⚠️ THAY ĐỔI
  branch: main  # hoặc master
```

## 🔐 Bước 2: Tạo GitHub OAuth App

1. Vào: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Điền:
   - **Name**: `Gạo Lâm Thúy CMS`
   - **Homepage URL**: `https://your-site.netlify.app`
   - **Callback URL**: `https://your-site.netlify.app/api/auth`
4. Lưu **Client ID** và **Client Secret**

## 🌐 Bước 3: Deploy lên Netlify

1. Kết nối GitHub repo với Netlify
2. Vào **Site settings** → **Environment variables**
3. Thêm:
   - `GITHUB_CLIENT_ID` = (Client ID từ bước 2)
   - `GITHUB_CLIENT_SECRET` = (Client Secret từ bước 2)
4. Vào **Identity** → Enable → Enable **Git Gateway**

## ✅ Bước 4: Test

Truy cập: `https://your-site.netlify.app/admin/`

Login với GitHub account có quyền push vào repo.

---

📚 Xem hướng dẫn chi tiết tại: [README.md](./README.md)

