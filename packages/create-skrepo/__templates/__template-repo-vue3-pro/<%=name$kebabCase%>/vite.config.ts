import {defineConfig} from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import {VueRouterAutoImports} from 'unplugin-vue-router'
import AutoImport from 'unplugin-auto-import/vite'
import {resolve} from 'path'

function pathResolve(dir: string) {
    return resolve(__dirname, '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        Vue(),
        VueRouter({
            dataFetching: true,
        }),
        AutoImport({
            dts: true,
            imports: ['vue', '@vueuse/core', VueRouterAutoImports],
        }),
    ],
    resolve: {
        alias: [
            {
                find: /\/@\//,
                replacement: pathResolve('src') + '/',
            }
        ]
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
})
