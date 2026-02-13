import { TransactionOutput } from "@scure/btc-signer/psbt.js";
import { Bytes } from "@scure/btc-signer/utils.js";
import { ArkAddress } from "../script/address";
import { DefaultVtxo } from "../script/default";
import { Network, NetworkName } from "../networks";
import { OnchainProvider } from "../providers/onchain";
import { ArkProvider, SettlementEvent, SignedIntent } from "../providers/ark";
import { SignerSession } from "../tree/signingSession";
import { Identity, ReadonlyIdentity } from "../identity";
import { ArkTransaction, Coin, ExtendedCoin, ExtendedVirtualCoin, GetVtxosFilter, IReadonlyWallet, IWallet, ReadonlyWalletConfig, SendBitcoinParams, SettleParams, VirtualCoin, WalletBalance, WalletConfig } from ".";
import { TapLeafScript } from "../script/base";
import { CSVMultisigTapscript } from "../script/tapscript";
import { Intent } from "../intent";
import { IndexerProvider } from "../providers/indexer";
import { WalletRepository } from "../repositories/walletRepository";
import { ContractRepository } from "../repositories/contractRepository";
import { Batch } from "./batch";
import { ContractManager } from "../contracts/contractManager";
export type IncomingFunds = {
    type: "utxo";
    coins: Coin[];
} | {
    type: "vtxo";
    newVtxos: ExtendedVirtualCoin[];
    spentVtxos: ExtendedVirtualCoin[];
};
export declare class ReadonlyWallet implements IReadonlyWallet {
    readonly identity: ReadonlyIdentity;
    readonly network: Network;
    readonly onchainProvider: OnchainProvider;
    readonly indexerProvider: IndexerProvider;
    readonly arkServerPublicKey: Bytes;
    readonly offchainTapscript: DefaultVtxo.Script;
    readonly boardingTapscript: DefaultVtxo.Script;
    readonly dustAmount: bigint;
    readonly walletRepository: WalletRepository;
    readonly contractRepository: ContractRepository;
    private _contractManager?;
    private _contractManagerInitializing?;
    protected readonly watcherConfig?: ReadonlyWalletConfig["watcherConfig"];
    protected constructor(identity: ReadonlyIdentity, network: Network, onchainProvider: OnchainProvider, indexerProvider: IndexerProvider, arkServerPublicKey: Bytes, offchainTapscript: DefaultVtxo.Script, boardingTapscript: DefaultVtxo.Script, dustAmount: bigint, walletRepository: WalletRepository, contractRepository: ContractRepository, watcherConfig?: ReadonlyWalletConfig["watcherConfig"]);
    /**
     * Protected helper to set up shared wallet configuration.
     * Extracts common logic used by both ReadonlyWallet.create() and Wallet.create().
     */
    protected static setupWalletConfig(config: ReadonlyWalletConfig, pubkey: Uint8Array): Promise<{
        arkProvider: ArkProvider;
        indexerProvider: IndexerProvider;
        onchainProvider: OnchainProvider;
        network: Network;
        networkName: NetworkName;
        serverPubKey: Uint8Array<ArrayBuffer>;
        offchainTapscript: DefaultVtxo.Script;
        boardingTapscript: DefaultVtxo.Script;
        dustAmount: bigint;
        walletRepository: WalletRepository;
        contractRepository: ContractRepository;
        info: import("../providers/ark").ArkInfo;
    }>;
    static create(config: ReadonlyWalletConfig): Promise<ReadonlyWallet>;
    get arkAddress(): ArkAddress;
    /**
     * Get the contract script for the wallet's default address.
     * This is the pkScript hex, used to identify the wallet in ContractManager.
     */
    get defaultContractScript(): string;
    getAddress(): Promise<string>;
    getBoardingAddress(): Promise<string>;
    getBalance(): Promise<WalletBalance>;
    getVtxos(filter?: GetVtxosFilter): Promise<ExtendedVirtualCoin[]>;
    protected getVirtualCoins(filter?: GetVtxosFilter): Promise<VirtualCoin[]>;
    getTransactionHistory(): Promise<ArkTransaction[]>;
    getBoardingTxs(): Promise<{
        boardingTxs: ArkTransaction[];
        commitmentsToIgnore: Set<string>;
    }>;
    getBoardingUtxos(): Promise<ExtendedCoin[]>;
    notifyIncomingFunds(eventCallback: (coins: IncomingFunds) => void): Promise<() => void>;
    fetchPendingTxs(): Promise<string[]>;
    /**
     * Get the ContractManager for managing contracts including the wallet's default address.
     *
     * The ContractManager handles:
     * - The wallet's default receiving address (as a "default" contract)
     * - External contracts (Boltz swaps, HTLCs, etc.)
     * - Multi-contract watching with resilient connections
     *
     * @example
     * ```typescript
     * const manager = await wallet.getContractManager();
     *
     * // Create a contract for a Boltz swap
     * const contract = await manager.createContract({
     *   label: "Boltz Swap",
     *   type: "vhtlc",
     *   params: { ... },
     *   script: swapScript,
     *   address: swapAddress,
     * });
     *
     * // Start watching for events (includes wallet's default address)
     * const stop = await manager.onContractEvent((event) => {
     *   console.log(`${event.type} on ${event.contractScript}`);
     * });
     * ```
     */
    getContractManager(): Promise<ContractManager>;
    private initializeContractManager;
}
/**
 * Main wallet implementation for Bitcoin transactions with Ark protocol support.
 * The wallet does not store any data locally and relies on Ark and onchain
 * providers to fetch UTXOs and VTXOs.
 *
 * @example
 * ```typescript
 * // Create a wallet with URL configuration
 * const wallet = await Wallet.create({
 *   identity: SingleKey.fromHex('your_private_key'),
 *   arkServerUrl: 'https://ark.example.com',
 *   esploraUrl: 'https://mempool.space/api'
 * });
 *
 * // Or with custom provider instances (e.g., for Expo/React Native)
 * const wallet = await Wallet.create({
 *   identity: SingleKey.fromHex('your_private_key'),
 *   arkProvider: new ExpoArkProvider('https://ark.example.com'),
 *   indexerProvider: new ExpoIndexerProvider('https://ark.example.com'),
 *   esploraUrl: 'https://mempool.space/api'
 * });
 *
 * // Get addresses
 * const arkAddress = await wallet.getAddress();
 * const boardingAddress = await wallet.getBoardingAddress();
 *
 * // Send bitcoin
 * const txid = await wallet.sendBitcoin({
 *   address: 'tb1...',
 *   amount: 50000
 * });
 * ```
 */
export declare class Wallet extends ReadonlyWallet implements IWallet {
    readonly networkName: NetworkName;
    readonly arkProvider: ArkProvider;
    readonly serverUnrollScript: CSVMultisigTapscript.Type;
    readonly forfeitOutputScript: Bytes;
    readonly forfeitPubkey: Bytes;
    static MIN_FEE_RATE: number;
    readonly identity: Identity;
    readonly renewalConfig: Required<Omit<WalletConfig["renewalConfig"], "enabled">> & {
        enabled: boolean;
        thresholdMs: number;
    };
    protected constructor(identity: Identity, network: Network, networkName: NetworkName, onchainProvider: OnchainProvider, arkProvider: ArkProvider, indexerProvider: IndexerProvider, arkServerPublicKey: Bytes, offchainTapscript: DefaultVtxo.Script, boardingTapscript: DefaultVtxo.Script, serverUnrollScript: CSVMultisigTapscript.Type, forfeitOutputScript: Bytes, forfeitPubkey: Bytes, dustAmount: bigint, walletRepository: WalletRepository, contractRepository: ContractRepository, renewalConfig?: WalletConfig["renewalConfig"], watcherConfig?: WalletConfig["watcherConfig"]);
    static create(config: WalletConfig): Promise<Wallet>;
    /**
     * Convert this wallet to a readonly wallet.
     *
     * @returns A readonly wallet with the same configuration but readonly identity
     * @example
     * ```typescript
     * const wallet = await Wallet.create({ identity: SingleKey.fromHex('...'), ... });
     * const readonlyWallet = await wallet.toReadonly();
     *
     * // Can query balance and addresses
     * const balance = await readonlyWallet.getBalance();
     * const address = await readonlyWallet.getAddress();
     *
     * // But cannot send transactions (type error)
     * // readonlyWallet.sendBitcoin(...); // TypeScript error
     * ```
     */
    toReadonly(): Promise<ReadonlyWallet>;
    sendBitcoin(params: SendBitcoinParams): Promise<string>;
    settle(params?: SettleParams, eventCallback?: (event: SettlementEvent) => void): Promise<string>;
    private handleSettlementFinalizationEvent;
    /**
     * @implements Batch.Handler interface.
     * @param intentId - The intent ID.
     * @param inputs - The inputs of the intent.
     * @param session - The musig2 signing session, if not provided, the signing will be skipped.
     */
    createBatchHandler(intentId: string, inputs: ExtendedCoin[], session?: SignerSession): Batch.Handler;
    safeRegisterIntent(intent: SignedIntent<Intent.RegisterMessage>): Promise<string>;
    makeRegisterIntentSignature(coins: ExtendedCoin[], outputs: TransactionOutput[], onchainOutputsIndexes: number[], cosignerPubKeys: string[]): Promise<SignedIntent<Intent.RegisterMessage>>;
    makeDeleteIntentSignature(coins: ExtendedCoin[]): Promise<SignedIntent<Intent.DeleteMessage>>;
    makeGetPendingTxIntentSignature(vtxos: ExtendedVirtualCoin[]): Promise<SignedIntent<Intent.GetPendingTxMessage>>;
    /**
     * Finalizes pending transactions by retrieving them from the server and finalizing each one.
     * @param vtxos - Optional list of VTXOs to use instead of retrieving them from the server
     * @returns Array of transaction IDs that were finalized
     */
    finalizePendingTxs(vtxos?: ExtendedVirtualCoin[]): Promise<{
        finalized: string[];
        pending: string[];
    }>;
    private prepareIntentProofInputs;
}
export declare function getSequence(tapLeafScript: TapLeafScript): number | undefined;
/**
 * Wait for incoming funds to the wallet
 * @param wallet - The wallet to wait for incoming funds
 * @returns A promise that resolves the next new coins received by the wallet's address
 */
export declare function waitForIncomingFunds(wallet: Wallet): Promise<IncomingFunds>;
