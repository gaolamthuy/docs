import { defineConfig } from 'vitepress'

// Get base URL from environment variable
// Production: / (for docs.gaolamthuy.vn)
// Local dev: / (empty)
// Note: VitePress base should be relative path, not full URL
const base = process.env.BASE_URL || '/'

export default defineConfig({
  title: 'Gao Lam Thuy Docs',
  description: 'Documentation site powered by VitePress',
  
  // Base URL for deployment
  // For docs.gaolamthuy.vn, use '/' (root domain)
  // For subpath deployment, use '/subpath/'
  base: base,
  
  // Theme configuration
  themeConfig: {
    // Logo configuration - using your assets from public folder
    logo: '/assets/logos/brand/gaolamthuy/logo-main-hexagon-extrawhiteborder-forproductimage-resize-200x200.png',
    
    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' }
    ],
    
    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Usage', link: '/guide/usage' }
          ]
        }
      ]
    },
    
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gaolamthuy/docs' }
    ],
    
    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Gao Lam Thuy'
    },
    
    // Search
    search: {
      provider: 'local'
    }
  },
  
  // Markdown configuration
  markdown: {
    lineNumbers: true
  }
})

