export const useSeededRandom = () => {
    /**
     * Deterministic PRNG algorithm (Mulberry32)
     * Returns a floating point number between 0 and 1 based on the seed.
     */
    function seededRandom(seed: number): number {
        let t = (seed += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    /**
     * Calculates the numeric seed from today's (or the given) date (e.g. 20260807)
     */
    function getDateSeed(date: Date = new Date()): number {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return parseInt(`${year}${month}${day}`, 10)
    }

    /**
     * Returns an integer between 0 and (max - 1) based on today's date.
     * Ideal for picking array indexes (e.g. getDailyIndex(medias.length)).
     *
     * @param max - The upper bound (exclusive)
     * @param customDate - Optional date, if you don't want to use today
     */
    function getDailyIndex(max: number, customDate?: Date): number {
        if (max <= 0) return 0
        const seed = getDateSeed(customDate)
        return Math.floor(seededRandom(seed) * max)
    }

    /**
     * Picks one item from an array based on today's date.
     *
     * @param array - The source array
     * @param customDate - Optional date
     */
    function getDailyItem<T>(array: T[], customDate?: Date): T | null {
        if (!array || array.length === 0) return null
        const index = getDailyIndex(array.length, customDate)
        return array[index] ?? null
    }

    /**
     * Shuffles the array based on today's date, so everyone sees the same order on a given day.
     *
     * @param array - The source array
     * @param salt - Mixed into the seed, so different shuffles can come out on the same day
     */
    function getDailyShuffle<T>(array: T[], salt: number = 0): T[] {
        const seed = getDateSeed() ^ Math.imul(salt, 0x9e3779b9)
        return array
            .map((item, i) => ({item, key: seededRandom(seed + i * 7919)}))
            .sort((a, b) => a.key - b.key)
            .map(x => x.item)
    }

    return {
        seededRandom,
        getDateSeed,
        getDailyIndex,
        getDailyItem,
        getDailyShuffle,
    }
}