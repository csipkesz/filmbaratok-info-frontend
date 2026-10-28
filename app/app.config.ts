// Video store look: solid and outline buttons are hard-edged stickers with a black drop shadow that press in on click
const STICKER = 'shadow-[3px_3px_0_0_#000] hover:-translate-y-px hover:shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'

export default defineAppConfig({
    ui: {
        colors: {
            neutral: 'stone',
        },
        button: {
            slots: {
                base: 'cursor-pointer transition-[color,background-color,transform,box-shadow]',
            },
            variants: {
                variant: {
                    solid: `font-semibold ${STICKER}`,
                    outline: `bg-black/40 font-semibold ${STICKER}`,
                },
            },
        },
        select: {
            slots: {
                base: 'cursor-pointer shadow-[3px_3px_0_0_#000]',
                item: 'cursor-pointer',
            },
        },
    },
})
