export { openDatabase } from "../repositories/indexedDB/websqlAdapter";
export interface SetupExpoDbOptions {
    origin?: string;
    checkOrigin?: boolean;
    cacheDatabaseInstances?: boolean;
}
export declare function setupExpoDb(options?: SetupExpoDbOptions): void;
