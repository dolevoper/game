export function clamp(min: number, num: number, max: number): number {
    return Math.max(min, Math.min(num, max));
}