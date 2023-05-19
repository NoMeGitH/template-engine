import {createApp as createClientApp, VueElementConstructor} from 'vue'

import {createRouter} from './router'
import {createStore} from './store'

export async function setupApp(App: VueElementConstructor) {
    const app = createClientApp(App)
    const router = createRouter()
    const store = createStore()
    const global = {
        app,
        router,
        store
    }

    app.provide('global', global)

    app.use(global.router)
    app.use(global.store)

    return global
}
