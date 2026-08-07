import type {MediaDetail} from "~/models/media-detail.ts";
import type {ContentDetail} from "~/models/content-detail.ts";

export interface TopicDetail {
    id: string;
    title: string;
    subtitle: string;
    timestampString: string | null;
    timestampInSeconds: number | null;
    isSpoiler: boolean;
    medias: MediaDetail[];
    content: ContentDetail;
}
