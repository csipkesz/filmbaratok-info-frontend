import type {PersonDetail} from "~/models/person-detail.ts";
import type {FilmbaratokCategory} from "~/models/enums.ts";

export interface ContentDetail {
    category: FilmbaratokCategory;
    title: string;
    youtubeId: string;
    thumbnailUrl: string;
    durationInMinutes: number;
    releaseDate: number;
    participants: PersonDetail[];
}
