export function getYouTubeUrl(youtubeId: string, timestampInSeconds?: number): string {
    let url = `https://www.youtube.com/watch?v=${youtubeId}`
    if (timestampInSeconds && timestampInSeconds > 0) {
        url += `&t=${timestampInSeconds}s`
    }
    return url
}