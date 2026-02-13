// Expo IndexedDB polyfill — requires expo-sqlite and indexeddbshim.
//
// Separated from ./expo so that consumers who only need the streaming
// providers (ExpoArkProvider, ExpoIndexerProvider) don't pull in a
// hard dependency on expo-sqlite at bundle time.
import setGlobalVars from "indexeddbshim";
import { openDatabase } from '../repositories/indexedDB/websqlAdapter.js';
export { openDatabase } from '../repositories/indexedDB/websqlAdapter.js';
let _initialized = false;
export function setupExpoDb(options) {
    if (_initialized)
        return;
    const { origin = "expo://localhost", checkOrigin = false, cacheDatabaseInstances = true, } = options ?? {};
    if (typeof globalThis.window === "undefined") {
        globalThis.window = globalThis;
    }
    if (typeof globalThis.location === "undefined") {
        globalThis.location = { origin };
    }
    globalThis.openDatabase = openDatabase;
    setGlobalVars(globalThis, {
        checkOrigin,
        useSQLiteIndexes: true,
        cacheDatabaseInstances,
    });
    _initialized = true;
}
