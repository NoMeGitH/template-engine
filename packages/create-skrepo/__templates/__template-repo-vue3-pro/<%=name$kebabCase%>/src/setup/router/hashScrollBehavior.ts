import {RouteLocationNormalized, RouteLocationNormalizedLoaded} from "vue-router";

// FIXME: savedPosition: null | _ScrollPositionNormalized @see https://router.vuejs.org/api/interfaces/routerscrollbehavior
export const scrollBehavior = (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, savedPosition: any) => {
    // Scroll to heading on click
    if (to.hash) {
        if (to.hash === '#') {
            return {
                top: 0,
                behavior: 'smooth',
            }
        }
        const id = to.hash.slice(to.hash.indexOf('#/') + 2)
        const el = document.querySelector(`[id='${id}']`)

        // vue-router does not incorporate scroll-margin-top on its own.
        if (el) {
            const top = parseFloat(getComputedStyle(el).scrollMarginTop)
            if (el instanceof HTMLElement) {
                el.focus()
            }

            return {
                el: to.hash,
                behavior: 'smooth',
                top,
            }
        }

        return {
            el: to.hash,
            behavior: 'smooth',
        }
    }

    if (savedPosition) {
        return savedPosition
    } else if (to.path !== from.path) {
        return {top: 0}
    }
}