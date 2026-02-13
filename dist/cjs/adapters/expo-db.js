"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDatabase = void 0;
exports.setupExpoDb = setupExpoDb;
// Expo IndexedDB polyfill — requires expo-sqlite and indexeddbshim.
//
// Separated from ./expo so that consumers who only need the streaming
// providers (ExpoArkProvider, ExpoIndexerProvider) don't pull in a
// hard dependency on expo-sqlite at bundle time.
const indexeddbshim_1 = __importDefault(require("indexeddbshim"));
const websqlAdapter_1 = require("../repositories/indexedDB/websqlAdapter");
var websqlAdapter_2 = require("../repositories/indexedDB/websqlAdapter");
Object.defineProperty(exports, "openDatabase", { enumerable: true, get: function () { return websqlAdapter_2.openDatabase; } });
let _initialized = false;
function setupExpoDb(options) {
    if (_initialized)
        return;
    const { origin = "expo://localhost", checkOrigin = false, cacheDatabaseInstances = true, } = options ?? {};
    if (typeof globalThis.window === "undefined") {
        globalThis.window = globalThis;
    }
    if (typeof globalThis.location === "undefined") {
        globalThis.location = { origin };
    }
    globalThis.openDatabase = websqlAdapter_1.openDatabase;
    (0, indexeddbshim_1.default)(globalThis, {
        checkOrigin,
        useSQLiteIndexes: true,
        cacheDatabaseInstances,
    });
    _initialized = true;
}
