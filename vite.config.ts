import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_URL || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [
          ElementPlusResolver({ importStyle: 'sass' }),
          IconsResolver({ prefix: 'Icon' })
        ],
        dts: 'auto-imports.d.ts',
        eslintrc: { enabled: false }
      }),
      Components({
        resolvers: [
          ElementPlusResolver({ importStyle: 'sass' }),
          IconsResolver({ enabledCollections: ['mdi', 'circle-flags', 'heroicons'] })
        ],
        dts: 'components.d.ts',
        dirs: ['src/components', 'src/layouts/modules']
      }),
      Icons({ autoInstall: false, compiler: 'vue3' })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element-plus.scss" as *;`,
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },
    server: {
      port: 5173,
      open: false,
      host: true
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      chunkSizeWarningLimit: 1500
    }
  }
})
