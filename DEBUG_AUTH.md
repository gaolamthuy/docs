# 🐛 Hướng dẫn Debug Authentication

## Kiểm tra Token đã được lưu chưa

1. Mở **Developer Console** (F12 hoặc Ctrl+Shift+I)
2. Vào tab **Console**
3. Chạy lệnh sau để kiểm tra token:

```javascript
// Kiểm tra token trong localStorage
console.log('netlify-cms-user:', localStorage.getItem('netlify-cms-user'));
console.log('decap-cms-user:', localStorage.getItem('decap-cms-user'));

// Parse và hiển thị token
const user = JSON.parse(localStorage.getItem('netlify-cms-user') || '{}');
console.log('Token:', user.token);
console.log('Provider:', user.provider);
```

## Kiểm tra OAuth Flow

1. Mở **Network tab** trong Developer Tools
2. Click "Đăng nhập bằng GitHub"
3. Kiểm tra các request:
   - Request đến `/api/auth` (không có code) → phải redirect đến GitHub
   - Request đến `/api/auth?code=...` → phải trả về HTML với script
   - Response phải có status 200 và Content-Type: text/html

## Kiểm tra Console Errors

1. Mở **Console tab**
2. Tìm các lỗi JavaScript
3. Các lỗi thường gặp:
   - `CORS error` → Kiểm tra CORS headers
   - `localStorage is not defined` → Browser không hỗ trợ localStorage
   - `Token is undefined` → Token không được pass đúng

## Test thủ công

Nếu token đã được lưu nhưng Decap CMS vẫn không authenticate:

1. Mở Console
2. Chạy lệnh để set token thủ công:

```javascript
localStorage.setItem('netlify-cms-user', JSON.stringify({
  token: 'YOUR_TOKEN_HERE',
  provider: 'github',
  name: 'GitHub User',
  login: 'github-user'
}));
```

3. Reload page: `window.location.reload()`

## Kiểm tra Environment Variables

Đảm bảo trong Cloudflare Pages đã set:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Kiểm tra GitHub OAuth App

1. Vào: https://github.com/settings/developers
2. Kiểm tra OAuth App có:
   - **Authorization callback URL**: `https://assets.gaolamthuy.vn/api/auth`
   - **Homepage URL**: `https://assets.gaolamthuy.vn`

## Common Issues

### Token được trả về nhưng không authenticate

**Nguyên nhân có thể:**
- Decap CMS không đọc từ localStorage đúng key
- Token format không đúng
- Decap CMS cần reload để nhận token

**Giải pháp:**
- Đảm bảo token được lưu với key `netlify-cms-user`
- Reload page sau khi nhận token
- Clear cache và cookies

### Popup không đóng sau khi authenticate

**Nguyên nhân:**
- `window.opener` không tồn tại
- postMessage không được gửi đúng

**Giải pháp:**
- Kiểm tra popup có được mở từ Decap CMS không
- Kiểm tra origin của postMessage

### Redirect không hoạt động

**Nguyên nhân:**
- URL hash không được xử lý đúng
- Script không chạy

**Giải pháp:**
- Kiểm tra JavaScript có được enable không
- Kiểm tra console có lỗi không

