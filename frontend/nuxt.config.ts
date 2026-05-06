// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['ant-design-vue/dist/reset.css'],
  modules: ['@ant-design-vue/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  },
  experimental: {
    appManifest: false
  },
  vite: {
    optimizeDeps: {
      include: [
        'd3',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@ant-design/icons-vue',
        'dayjs',
        'dayjs/plugin/weekday',
        'dayjs/plugin/localeData',
        'dayjs/plugin/weekOfYear',
        'dayjs/plugin/weekYear',
        'dayjs/plugin/quarterOfYear',
        'dayjs/plugin/advancedFormat',
        'dayjs/plugin/customParseFormat',
      ],
    },
    server: {
      hmr: {
        clientPort: process.env.NUXT_VITE_HMR_CLIENT_PORT ? parseInt(process.env.NUXT_VITE_HMR_CLIENT_PORT) : undefined
      }
    }
  },
  antd: {
    extractStyle: true
  }
})

