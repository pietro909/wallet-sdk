import { hex } from "@scure/base";
import { TaprootControlBlock } from "@scure/btc-signer";
import { DB_VERSION, STORE_CONTRACTS, LEGACY_STORE_CONTRACT_COLLECTIONS, STORE_TRANSACTIONS, STORE_UTXOS, STORE_VTXOS, STORE_WALLET_STATE, } from './schema.js';
export { STORE_VTXOS, STORE_UTXOS, STORE_TRANSACTIONS, STORE_WALLET_STATE, STORE_CONTRACTS, LEGACY_STORE_CONTRACT_COLLECTIONS, DB_VERSION, };
export const serializeTapLeaf = ([cb, s]) => ({
    cb: hex.encode(TaprootControlBlock.encode(cb)),
    s: hex.encode(s),
});
export const serializeVtxo = (v) => ({
    ...v,
    tapTree: hex.encode(v.tapTree),
    forfeitTapLeafScript: serializeTapLeaf(v.forfeitTapLeafScript),
    intentTapLeafScript: serializeTapLeaf(v.intentTapLeafScript),
    extraWitness: v.extraWitness?.map(hex.encode),
});
export const serializeUtxo = (u) => ({
    ...u,
    tapTree: hex.encode(u.tapTree),
    forfeitTapLeafScript: serializeTapLeaf(u.forfeitTapLeafScript),
    intentTapLeafScript: serializeTapLeaf(u.intentTapLeafScript),
    extraWitness: u.extraWitness?.map(hex.encode),
});
export const deserializeTapLeaf = (t) => {
    const cb = TaprootControlBlock.decode(hex.decode(t.cb));
    const s = hex.decode(t.s);
    return [cb, s];
};
export const deserializeVtxo = (o) => ({
    ...o,
    createdAt: new Date(o.createdAt),
    tapTree: hex.decode(o.tapTree),
    forfeitTapLeafScript: deserializeTapLeaf(o.forfeitTapLeafScript),
    intentTapLeafScript: deserializeTapLeaf(o.intentTapLeafScript),
    extraWitness: o.extraWitness?.map(hex.decode),
});
export const deserializeUtxo = (o) => ({
    ...o,
    tapTree: hex.decode(o.tapTree),
    forfeitTapLeafScript: deserializeTapLeaf(o.forfeitTapLeafScript),
    intentTapLeafScript: deserializeTapLeaf(o.intentTapLeafScript),
    extraWitness: o.extraWitness?.map(hex.decode),
});
