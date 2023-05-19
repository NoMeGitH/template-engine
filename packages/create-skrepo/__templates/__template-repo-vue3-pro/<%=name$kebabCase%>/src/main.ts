import './style.css'
import {setupApp} from './setup'
import App from './App.vue'

setupApp(App).then(async global => {
    // wait for the app to be ready
    await global.router.isReady()
    // finally mount the app to the DOM
    global.app.mount('#app')
})

