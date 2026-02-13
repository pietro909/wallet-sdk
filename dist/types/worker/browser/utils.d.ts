export declare const DEFAULT_DB_NAME = "arkade-service-worker";
/**
 * setupServiceWorker sets up the service worker.
 * @param path - the path to the service worker script
 * @throws if service workers are not supported or activation fails
 * @example
 * ```typescript
 * const worker = await setupServiceWorker("/service-worker.js");
 * ```
 */
export declare function setupServiceWorker(path: string): Promise<ServiceWorker>;
