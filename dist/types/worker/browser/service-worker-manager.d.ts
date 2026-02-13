/**
 * Registers a service worker for the given path only once and caches the
 * registration promise for subsequent calls.
 *
 * @param path - Service worker script path to register.
 * @throws if service workers are not supported or registration fails.
 */
export declare function setupServiceWorkerOnce(path: string): Promise<ServiceWorkerRegistration>;
/**
 * Returns an active service worker instance, optionally ensuring a specific
 * script path is registered before resolving.
 *
 * @param path - Optional service worker script path to register and prefer.
 * @throws if service workers are not supported or no active worker is available.
 */
export declare function getActiveServiceWorker(path?: string): Promise<ServiceWorker>;
/**
 * Clears the cached registration promises.
 * Intended for tests to reset state between runs.
 */
export declare const __resetServiceWorkerManager: () => void;
