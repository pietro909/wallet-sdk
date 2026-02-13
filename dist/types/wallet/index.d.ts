import { Bytes } from "@scure/btc-signer/utils.js";
import { ArkProvider, Output, SettlementEvent } from "../providers/ark";
import { Identity, ReadonlyIdentity } from "../identity";
import { RelativeTimelock } from "../script/tapscript";
import { EncodedVtxoScript, TapLeafScript } from "../script/base";
import { RenewalConfig } from "./vtxo-manager";
import { IndexerProvider } from "../providers/indexer";
import { OnchainProvider } from "../providers/onchain";
import { ContractWatcherConfig } from "../contracts/contractWatcher";
import { ContractRepository, WalletRepository } from "../repositories";
import { IContractManager } from "../contracts/contractManager";
/**
 * Base configuration options shared by all wallet types.
 *
 * Supports two configuration modes:
 * 1. URL-based: Provide arkServerUrl, indexerUrl (optional), and esploraUrl
 * 2. Provider-based: Provide arkProvider, indexerProvider, and onchainProvider instances
 *
 * At least one of the following must be provided:
 * - arkServerUrl OR arkProvider
 *
 * The wallet will use provided URLs to create default providers if custom provider
 * instances are not supplied. If optional parameters are not provided, the wallet
 * will fetch configuration from the Ark server.
 */
export interface BaseWalletConfig {
    arkServerUrl?: string;
    indexerUrl?: string;
    esploraUrl?: string;
    arkServerPublicKey?: string;
    boardingTimelock?: RelativeTimelock;
    exitTimelock?: RelativeTimelock;
    storage?: StorageConfig;
    arkProvider?: ArkProvider;
    indexerProvider?: IndexerProvider;
    onchainProvider?: OnchainProvider;
}
/**
 * Configuration options for readonly wallet initialization.
 *
 * Use this config when you only need to query wallet state (balance, addresses, transactions)
 * without the ability to send transactions. This is useful for:
 * - Watch-only wallets
 * - Monitoring addresses
 * - Safe sharing of wallet state without private key exposure
 *
 * @example
 * ```typescript
 * // URL-based configuration
 * const wallet = await ReadonlyWallet.create({
 *   identity: ReadonlySingleKey.fromPublicKey(pubkey),
 *   arkServerUrl: 'https://ark.example.com',
 *   esploraUrl: 'https://mempool.space/api'
 * });
 *
 * // Provider-based configuration (e.g., for Expo/React Native)
 * const wallet = await ReadonlyWallet.create({
 *   identity: ReadonlySingleKey.fromPublicKey(pubkey),
 *   arkProvider: new ExpoArkProvider('https://ark.example.com'),
 *   indexerProvider: new ExpoIndexerProvider('https://ark.example.com'),
 *   onchainProvider: new EsploraProvider('https://mempool.space/api')
 * });
 * ```
 */
export interface ReadonlyWalletConfig extends BaseWalletConfig {
    identity: ReadonlyIdentity;
    /**
     * Configuration for the ContractManager's watcher.
     * Controls reconnection behavior and failsafe polling.
     */
    watcherConfig?: Partial<Omit<ContractWatcherConfig, "indexerProvider">>;
}
/**
 * Configuration options for full wallet initialization.
 *
 * This config provides full wallet capabilities including sending transactions,
 * settling VTXOs, and all readonly operations.
 *
 * @example
 * ```typescript
 * // URL-based configuration
 * const wallet = await Wallet.create({
 *   identity: SingleKey.fromHex('...'),
 *   arkServerUrl: 'https://ark.example.com',
 *   esploraUrl: 'https://mempool.space/api'
 * });
 *
 * // Provider-based configuration (e.g., for Expo/React Native)
 * const wallet = await Wallet.create({
 *   identity: SingleKey.fromHex('...'),
 *   arkProvider: new ExpoArkProvider('https://ark.example.com'),
 *   indexerProvider: new ExpoIndexerProvider('https://ark.example.com'),
 *   onchainProvider: new EsploraProvider('https://mempool.space/api')
 * });
 *
 * // With renewal configuration
 * const wallet = await Wallet.create({
 *   identity: SingleKey.fromHex('...'),
 *   arkServerUrl: 'https://ark.example.com',
 *   renewalConfig: {
 *     enabled: true,
 *     thresholdMs: 86400000, // 24 hours
 *   }
 * });
 * ```
 */
export interface WalletConfig extends ReadonlyWalletConfig {
    identity: Identity;
    renewalConfig?: RenewalConfig;
}
export type StorageConfig = {
    walletRepository: WalletRepository;
    contractRepository: ContractRepository;
};
/**
 * Provider class constructor interface for dependency injection.
 * Ensures provider classes follow the consistent constructor pattern.
 */
export interface ProviderClass<T> {
    new (serverUrl: string): T;
}
export interface WalletBalance {
    boarding: {
        confirmed: number;
        unconfirmed: number;
        total: number;
    };
    settled: number;
    preconfirmed: number;
    available: number;
    recoverable: number;
    total: number;
}
export interface SendBitcoinParams {
    address: string;
    amount: number;
    feeRate?: number;
    memo?: string;
    selectedVtxos?: VirtualCoin[];
}
export interface Recipient {
    address: string;
    amount: number;
}
export interface SettleParams {
    inputs: ExtendedCoin[];
    outputs: Output[];
}
export interface Status {
    confirmed: boolean;
    isLeaf?: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
}
export interface VirtualStatus {
    state: "preconfirmed" | "settled" | "swept" | "spent";
    commitmentTxIds?: string[];
    batchExpiry?: number;
}
export interface Outpoint {
    txid: string;
    vout: number;
}
export interface Coin extends Outpoint {
    value: number;
    status: Status;
}
export interface VirtualCoin extends Coin {
    virtualStatus: VirtualStatus;
    spentBy?: string;
    settledBy?: string;
    arkTxId?: string;
    createdAt: Date;
    isUnrolled: boolean;
    isSpent?: boolean;
}
export declare enum TxType {
    TxSent = "SENT",
    TxReceived = "RECEIVED"
}
export interface TxKey {
    boardingTxid: string;
    commitmentTxid: string;
    arkTxid: string;
}
export interface ArkTransaction {
    key: TxKey;
    type: TxType;
    amount: number;
    settled: boolean;
    createdAt: number;
}
export type TapLeaves = {
    forfeitTapLeafScript: TapLeafScript;
    intentTapLeafScript: TapLeafScript;
};
export type ExtendedCoin = TapLeaves & EncodedVtxoScript & Coin & {
    extraWitness?: Bytes[];
};
export type ExtendedVirtualCoin = TapLeaves & EncodedVtxoScript & VirtualCoin & {
    extraWitness?: Bytes[];
};
export declare function isSpendable(vtxo: VirtualCoin): boolean;
export declare function isRecoverable(vtxo: VirtualCoin): boolean;
export declare function isExpired(vtxo: VirtualCoin): boolean;
export declare function isSubdust(vtxo: VirtualCoin, dust: bigint): boolean;
export type GetVtxosFilter = {
    withRecoverable?: boolean;
    withUnrolled?: boolean;
};
/**
 * Core wallet interface for Bitcoin transactions with Ark protocol support.
 *
 * This interface defines the contract that all wallet implementations must follow.
 * It provides methods for address management, balance checking, virtual UTXO
 * operations, and transaction management including sending, settling, and unrolling.
 */
export interface IWallet extends IReadonlyWallet {
    identity: Identity;
    sendBitcoin(params: SendBitcoinParams): Promise<string>;
    settle(params?: SettleParams, eventCallback?: (event: SettlementEvent) => void): Promise<string>;
}
/**
 * Readonly wallet interface for Bitcoin transactions with Ark protocol support.
 *
 * This interface defines the contract that all wallet implementations must follow.
 * It provides methods for address management, balance checking, virtual UTXO
 * operations, and transaction management including sending, settling, and unrolling.
 */
export interface IReadonlyWallet {
    identity: ReadonlyIdentity;
    getAddress(): Promise<string>;
    getBoardingAddress(): Promise<string>;
    getBalance(): Promise<WalletBalance>;
    getVtxos(filter?: GetVtxosFilter): Promise<ExtendedVirtualCoin[]>;
    getBoardingUtxos(): Promise<ExtendedCoin[]>;
    getTransactionHistory(): Promise<ArkTransaction[]>;
    /**
     * Returns the contract manager associated with this wallet.
     * This is useful for querying contract state and watching for contract events.
     */
    getContractManager(): Promise<IContractManager>;
}
