// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/icon', '@nuxt/ui'],
    ui: {
        // The site is dark only, the dark class is set on <html> so popovers and modals get it too
        colorMode: false,
    },
    css: ['~/assets/css/main.css'],
    app: {
        baseURL: '/filmbaratok-info-frontend/',
        head: {
            htmlAttrs: {class: 'dark theme-teka font-text'},
            meta: [{name: 'theme-color', content: '#16110d'}],
            link: [
                {rel: 'icon', type: 'image/svg+xml', href: '/filmbaratok-info-frontend/favicon.svg'},
                {rel: 'icon', href: '/filmbaratok-info-frontend/favicon.ico', sizes: '32x32'},
                {rel: 'apple-touch-icon', href: '/filmbaratok-info-frontend/apple-touch-icon.png'},
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&display=swap',
                },
            ],
        },
    },
    icon: {
        serverBundle: {
            collections: ['lucide', 'simple-icons']
        },
        clientBundle: {
            scan: true,
            sizeLimitKb: 256,
        },
    },
})