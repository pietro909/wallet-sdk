import type { Coin, ExtendedCoin, ExtendedVirtualCoin, VirtualCoin } from "..";
import { ReadonlyWallet } from "./wallet";
export declare const DUST_AMOUNT = 546;
export declare function extendVirtualCoin(wallet: {
    offchainTapscript: ReadonlyWallet["offchainTapscript"];
}, vtxo: VirtualCoin): ExtendedVirtualCoin;
export declare function extendCoin(wallet: {
    boardingTapscript: ReadonlyWallet["boardingTapscript"];
}, utxo: Coin): ExtendedCoin;
export declare function getRandomId(): string;
