export function memoryLimiter(limit = 60, windowMs = 60_000) {
    const hits = new Map<string, { count: number; resetAt: number }>();
    return {
        async limit(key: string) {
            const now = Date.now();
            const item = hits.get(key);
            if (!item || item.resetAt <= now) {
                hits.set(key, { count: 1, resetAt: now + windowMs });
                return { success: true, limit, remaining: limit - 1, reset: Math.ceil((now + windowMs) / 1000) };
            }
            if (item.count >= limit) {
                return { success: false, limit, remaining: 0, reset: Math.ceil(item.resetAt / 1000) };
            }
            item.count++;
            return { success: true, limit, remaining: limit - item.count, reset: Math.ceil(item.resetAt / 1000) };
        },
    };
}