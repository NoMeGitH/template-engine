import {
    createRouter as createClientRouter,
    setupDataFetchingGuard,
} from 'vue-router/auto'

import {scrollBehavior} from "./hashScrollBehavior";
import {createWebHashHistory} from "vue-router";

export function createRouter() {
    const router = createClientRouter({
        /**
         * If you need to serve project under a subdirectory,
         * you have to set the name of the directory in createWebHistory here
         * and update "base" config in vite.config.ts
         */
        history: createWebHashHistory(),

        /**
         * You can extend existing routes:
         */
        // extendRoutes: (routes) => {
        //   const adminRoute = routes.find((r) => r.name === '/admin')
        //   if (!adminRoute) {
        //     adminRoute.meta ??= {}
        //     adminRoute.meta.requiresAuth = true
        //   }
        //   // completely optional since we are modifying the routes in place
        //   return routes
        // },

        // handle scroll behavior between routes
        scrollBehavior: scrollBehavior
    })
    setupDataFetchingGuard(router)
    return router
}