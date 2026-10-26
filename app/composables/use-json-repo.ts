import type {MediaDetail} from "~/models/media-detail.ts";
import type {Meta} from "~/models/meta.ts";

export const useJsonRepo = () => {
    async function fetchData<T>(path: string) {
        try {
            return await $fetch<T>(path)
        } catch (e) {
            console.error(`Error fetching JSON data on (${path}): `, e)
            return null;
        }
    }

    async function fetchIndex<T>(path: 'medias' | 'contents') {
        try {
            return await $fetch<T[]>(`/data/index/${path}.json`)
        } catch (e) {
            console.error(`Error fetching JSON index on (${path}): `, e)
            return [] as T[];
        }
    }

    async function fetchMediaDetail(id: string) {
        return await fetchData<MediaDetail>(`/data/data/medias/${id}.json`)
    }

    async function fetchBackdrops() {
        return await fetchData<string[]>('/data/data/backdrops.json') || []
    }

    async function fetchMeta() {
        return await fetchData<Meta>('/data/meta.json')
    }

    return {
        fetchData,
        fetchIndex,
        fetchBackdrops,
        fetchMeta,
        fetchMediaDetail,
    }
}