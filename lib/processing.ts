export const MIN_AUTH_PROCESSING_MS = 2200;

/** Keep a pending auth screen visible for a minimum total duration without adding extra delay to slower requests. */
export async function keepProcessingVisible(startedAt: number, minimumMs = MIN_AUTH_PROCESSING_MS) {
  const remainingMs = Math.max(0, minimumMs - (Date.now() - startedAt));
  if (remainingMs > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, remainingMs));
  }
}
