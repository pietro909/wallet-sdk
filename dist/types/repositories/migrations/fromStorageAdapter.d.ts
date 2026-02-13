import { StorageAdapter } from "../../storage";
import { WalletRepository } from "../walletRepository";
/**
 * Migrate wallet data from the legacy storage adapter to the new one.
 * It accepts both onchain and offchain addresses, make sure to pass both.
 *
 * @param storageAdapter
 * @param fresh
 * @param addresses
 */
export declare function migrateWalletRepository(storageAdapter: StorageAdapter, fresh: WalletRepository, addresses: {
    onchain: string[];
    offchain: string[];
}): Promise<void>;
