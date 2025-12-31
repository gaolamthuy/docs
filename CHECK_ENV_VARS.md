# ✅ Kiểm tra Environment Variables trong Cloudflare Pages

## 🔍 Cách kiểm tra

1. Vào **Cloudflare Dashboard** → **Pages** → Chọn project `assets`
2. Vào **Settings** → **Environment Variables**
3. Kiểm tra có 2 biến sau:

```
GITHUB_CLIENT_ID=0v23li9lfE6vLf52ZoEY
GITHUB_CLIENT_SECRET=*****134a736c
```

## ⚠️ Quan trọng

- **Phải chọn cả 3 environments**: Production, Preview, và Branch
- **Client Secret** phải là secret mới nhất (không phải secret cũ đã bị revoke)
- **Không có khoảng trắng** trước/sau giá trị

## 🧪 Test sau khi set

1. Deploy lại project (hoặc đợi auto-deploy)
2. Thử login lại
3. Mở **Network tab** trong Developer Tools
4. Xem response từ `/api/auth?code=...`
5. Nếu vẫn lỗi, xem error message chi tiết trong response

## 📋 Error Messages có thể gặp

### "GitHub OAuth credentials are not configured"
→ Environment variables chưa được set hoặc chưa apply cho environment hiện tại

### "GitHub authentication failed: 401"
→ Client ID hoặc Client Secret sai

### "GitHub authentication failed: 400"
→ Code đã được sử dụng hoặc hết hạn (code chỉ dùng được 1 lần)

### "No access token received from GitHub"
→ GitHub trả về response nhưng không có access_token

## 🔧 Cách sửa

1. **Nếu thiếu environment variables:**
   - Vào Cloudflare Pages → Settings → Environment Variables
   - Thêm `GITHUB_CLIENT_ID` và `GITHUB_CLIENT_SECRET`
   - Chọn tất cả environments
   - Save và deploy lại

2. **Nếu Client Secret sai:**
   - Vào GitHub → Settings → Developer settings → OAuth Apps
   - Chọn app "Gao Lam Thuy Assets CMS"
   - Generate new client secret
   - Copy secret mới và update trong Cloudflare Pages

3. **Nếu code đã hết hạn:**
   - Code chỉ dùng được 1 lần và có thời hạn ngắn
   - Thử login lại từ đầu

