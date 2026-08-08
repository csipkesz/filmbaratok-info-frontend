import type {FilmbaratokCategory} from "~/models/enums.ts";

export interface MediaIndexItem {
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
    subtitle: string | null;
    category: FilmbaratokCategory;
    youtubeId: string;
    timestampInSeconds?: number;
    participants: string[];
    isSpoiler: boolean;
}
