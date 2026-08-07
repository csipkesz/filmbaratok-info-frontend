import type {TopicDetail} from "~/models/topic-detail.ts";

export interface MediaDetail {
    id: string;
    title: string;
    originalTitle: string | null;
    overview: string | null;
    backdropPath: string | null;
    posterPath: string | null;
    releaseDate: Date | null;
    topics: TopicDetail[];
}
