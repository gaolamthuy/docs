# Gao Lam Thuy Documentation

Tài liệu được xây dựng bằng VitePress và quản lý nội dung bằng DecapCMS.

## 🚀 Bắt đầu

### Cài đặt

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📝 Quản lý nội dung với DecapCMS

1. Push code lên GitHub
2. Deploy lên Netlify
3. Bật Netlify Identity và Git Gateway trong Netlify
4. Truy cập `/admin` để quản lý nội dung

## 🎨 Assets

Tất cả assets (hình ảnh, logo, icons) được lưu trong thư mục `assets/`:
- `assets/logos/` - Logo files
- `assets/icons/` - Icon files  
- `assets/images/` - Image files

## 📦 Deployment

### Netlify

1. Kết nối repository GitHub với Netlify
2. Build command: `npm run build`
3. Publish directory: `.vitepress/dist`
4. Bật Netlify Identity và Git Gateway
5. Thêm redirect rule: `/admin` → `/admin/index.html`

## 📚 Cấu trúc

```
docs/
├── .vitepress/
│   └── config.js          # VitePress config
├── admin/
│   └── config.yml         # DecapCMS config
├── public/
│   └── admin/
│       └── index.html     # DecapCMS admin interface
├── assets/                # Assets folder
│   ├── logos/
│   ├── icons/
│   └── images/
├── guide/                 # Guide pages
├── examples/              # Example pages
├── index.md               # Home page
└── netlify.toml           # Netlify config
```

## 🔧 Cấu hình

- VitePress config: `.vitepress/config.js`
- DecapCMS config: `admin/config.yml`
- Netlify config: `netlify.toml`

