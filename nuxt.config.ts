// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/icon', '@nuxt/ui'],
    css: ['~/assets/css/main.css'],
    app: {
        baseURL: '/filmbaratok-info-frontend/',
        head: {
            link: [
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,500&family=Inter:wght@400;500;600&display=swap',
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