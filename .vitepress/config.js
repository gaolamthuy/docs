import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Gao Lam Thuy Docs',
  description: 'Documentation site powered by VitePress',
  
  // Base URL for deployment
  base: '/',
  
  // Theme configuration
  themeConfig: {
    // Logo configuration - using your assets
    logo: '/assets/logos/brand/gaolamthuy/logo-main-hexagon-extrawhiteborder-forproductimage-resize-200x200.png',
    
    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' }
    ],
    
    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Usage', link: '/examples/basic' }
          ]
        }
      ]
    },
    
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/gaolamthuy-docs' }
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

