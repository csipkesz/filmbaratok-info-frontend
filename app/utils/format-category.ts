import {FilmbaratokCategory} from "~/models/enums.ts";

export function formatCategory(category: FilmbaratokCategory) {
    switch (category) {
        case FilmbaratokCategory.PODCAST:
            return 'Podcast'
        case FilmbaratokCategory.EXPRESS:
            return 'Express'
        case FilmbaratokCategory.AUDIO_COMMENTARY:
            return 'Audiokommentár'
        case FilmbaratokCategory.ON_SITE:
            return 'Zárthelyi'
        case FilmbaratokCategory.GAME:
            return 'Játék'
        case FilmbaratokCategory.OTHER:
            return 'Egyéb'
        default:
            return category
    }
}