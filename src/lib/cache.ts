const cache = new Map<string, Promise<any>>();

/**
 * Retrieves an item from the cache. If the item is not in the cache,
 * the `fetcher` function is called to retrieve it, and the result is stored in the cache.
 * @param key The cache key.
 * @param fetcher A function that returns a promise resolving to the value to cache.
 */
export function get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (!cache.has(key)) {
        // Store the promise itself, not the resolved value
        cache.set(key, fetcher().catch((err) => {
            // If the fetcher fails, remove the promise from the cache
            // so that subsequent requests will retry.
            cache.delete(key);
            // Re-throw the error to the caller
            throw err;
        }));
    }
    // Return the promise from the cache
    return cache.get(key)!;
}

/**
 * Sets a value in the cache.
 * @param key The cache key.
 * @param value The promise to store.
 */
export function set<T>(key: string, value: Promise<T>): void {
    cache.set(key, value);
}

/**
 * Invalidates a specific key from the cache.
 * @param key The cache key to invalidate.
 */
export function invalidate(key: string): void {
    cache.delete(key);
}

/**
 * Clears the entire cache.
 */
export function clear(): void {
    cache.clear();
}