import { TapLeafScript } from "../../script/base";
import { ExtendedCoin, ExtendedVirtualCoin } from "../../wallet";
import { DB_VERSION, STORE_CONTRACTS, LEGACY_STORE_CONTRACT_COLLECTIONS, STORE_TRANSACTIONS, STORE_UTXOS, STORE_VTXOS, STORE_WALLET_STATE } from "./schema";
export { STORE_VTXOS, STORE_UTXOS, STORE_TRANSACTIONS, STORE_WALLET_STATE, STORE_CONTRACTS, LEGACY_STORE_CONTRACT_COLLECTIONS, DB_VERSION, };
export type SerializedVtxo = ReturnType<typeof serializeVtxo>;
export type SerializedUtxo = ReturnType<typeof serializeUtxo>;
export declare const serializeTapLeaf: ([cb, s]: TapLeafScript) => {
    cb: string;
    s: string;
};
export declare const serializeVtxo: (v: ExtendedVirtualCoin) => {
    tapTree: string;
    forfeitTapLeafScript: {
        cb: string;
        s: string;
    };
    intentTapLeafScript: {
        cb: string;
        s: string;
    };
    extraWitness: string[] | undefined;
    virtualStatus: import("../../wallet").VirtualStatus;
    spentBy?: string;
    settledBy?: string;
    arkTxId?: string;
    createdAt: Date;
    isUnrolled: boolean;
    isSpent?: boolean;
    value: number;
    status: import("../../wallet").Status;
    txid: string;
    vout: number;
};
export declare const serializeUtxo: (u: ExtendedCoin) => {
    tapTree: string;
    forfeitTapLeafScript: {
        cb: string;
        s: string;
    };
    intentTapLeafScript: {
        cb: string;
        s: string;
    };
    extraWitness: string[] | undefined;
    value: number;
    status: import("../../wallet").Status;
    txid: string;
    vout: number;
};
export declare const deserializeTapLeaf: (t: {
    cb: string;
    s: string;
}) => TapLeafScript;
export declare const deserializeVtxo: (o: SerializedVtxo) => ExtendedVirtualCoin;
export declare const deserializeUtxo: (o: SerializedUtxo) => ExtendedCoin;
