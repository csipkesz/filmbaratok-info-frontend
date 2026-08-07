import type {FilmbaratokCategory} from "~/models/enums.ts";

export interface MediaIndexItemDto {
    id: string;
    title: string;
    originalTitle: string | null;
    posterPath: string | null;
    backdropPath: string | null;
    contents: MediaIndexItemContent[];
}

export interface MediaIndexItemContent {
    id: string;
    title: string;
    category: FilmbaratokCategory;
    youtubeId: string;
    timestampInSeconds?: number;
    participants: string[];
}
