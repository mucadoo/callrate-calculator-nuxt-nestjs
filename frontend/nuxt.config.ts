// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@ant-design-vue/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  },
  vite: {
    server: {
      hmr: {
        clientPort: process.env.NUXT_VITE_HMR_CLIENT_PORT ? parseInt(process.env.NUXT_VITE_HMR_CLIENT_PORT) : undefined
      }
    }
  },
  antd: {
    // Options
  }
})

