import type {FilmbaratokCategory} from "~/models/enums.ts";

export interface ContentIndexItem {
    id: string;
    title: string;
    category: FilmbaratokCategory;
    youtubeId: string;
    thumbnailUrl: string;
    releaseDate: string;
    participants: string[];
}
