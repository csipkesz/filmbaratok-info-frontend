export const useSeededRandom = () => {
    /**
     * Determinisztikus PRNG algoritmus (Mulberry32)
     * 0 és 1 közötti lebegőpontos számot ad vissza a seed alapján.
     */
    function seededRandom(seed: number): number {
        let t = (seed += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    /**
     * Kiszámolja a mai (vagy a megadott) dátum alapján a numerikus seed-et (pl. 20260807)
     */
    function getDateSeed(date: Date = new Date()): number {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return parseInt(`${year}${month}${day}`, 10)
    }

    /**
     * A mai dátum alapján ad vissza egy egész számot 0 és (max - 1) között.
     * Ideális tömb indexek kisorsolásához (pl. getDailyIndex(medias.length)).
     *
     * @param max - A felső határ (exkluzív)
     * @param customDate - Opcionális dátum, ha nem a mai napot szeretnéd használni
     */
    function getDailyIndex(max: number, customDate?: Date): number {
        if (max <= 0) return 0
        const seed = getDateSeed(customDate)
        return Math.floor(seededRandom(seed) * max)
    }

    /**
     * A mai dátum alapján választ ki egy elemet egy tömbből.
     *
     * @param array - A forrástömb
     * @param customDate - Opcionális dátum
     */
    function getDailyItem<T>(array: T[], customDate?: Date): T | null {
        if (!array || array.length === 0) return null
        const index = getDailyIndex(array.length, customDate)
        return array[index] ?? null
    }

    return {
        seededRandom,
        getDateSeed,
        getDailyIndex,
        getDailyItem,
    }
}