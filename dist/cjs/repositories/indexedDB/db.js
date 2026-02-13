"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUtxo = exports.deserializeVtxo = exports.deserializeTapLeaf = exports.serializeUtxo = exports.serializeVtxo = exports.serializeTapLeaf = exports.DB_VERSION = exports.LEGACY_STORE_CONTRACT_COLLECTIONS = exports.STORE_CONTRACTS = exports.STORE_WALLET_STATE = exports.STORE_TRANSACTIONS = exports.STORE_UTXOS = exports.STORE_VTXOS = void 0;
const base_1 = require("@scure/base");
const btc_signer_1 = require("@scure/btc-signer");
const schema_1 = require("./schema");
Object.defineProperty(exports, "DB_VERSION", { enumerable: true, get: function () { return schema_1.DB_VERSION; } });
Object.defineProperty(exports, "STORE_CONTRACTS", { enumerable: true, get: function () { return schema_1.STORE_CONTRACTS; } });
Object.defineProperty(exports, "LEGACY_STORE_CONTRACT_COLLECTIONS", { enumerable: true, get: function () { return schema_1.LEGACY_STORE_CONTRACT_COLLECTIONS; } });
Object.defineProperty(exports, "STORE_TRANSACTIONS", { enumerable: true, get: function () { return schema_1.STORE_TRANSACTIONS; } });
Object.defineProperty(exports, "STORE_UTXOS", { enumerable: true, get: function () { return schema_1.STORE_UTXOS; } });
Object.defineProperty(exports, "STORE_VTXOS", { enumerable: true, get: function () { return schema_1.STORE_VTXOS; } });
Object.defineProperty(exports, "STORE_WALLET_STATE", { enumerable: true, get: function () { return schema_1.STORE_WALLET_STATE; } });
const serializeTapLeaf = ([cb, s]) => ({
    cb: base_1.hex.encode(btc_signer_1.TaprootControlBlock.encode(cb)),
    s: base_1.hex.encode(s),
});
exports.serializeTapLeaf = serializeTapLeaf;
const serializeVtxo = (v) => ({
    ...v,
    tapTree: base_1.hex.encode(v.tapTree),
    forfeitTapLeafScript: (0, exports.serializeTapLeaf)(v.forfeitTapLeafScript),
    intentTapLeafScript: (0, exports.serializeTapLeaf)(v.intentTapLeafScript),
    extraWitness: v.extraWitness?.map(base_1.hex.encode),
});
exports.serializeVtxo = serializeVtxo;
const serializeUtxo = (u) => ({
    ...u,
    tapTree: base_1.hex.encode(u.tapTree),
    forfeitTapLeafScript: (0, exports.serializeTapLeaf)(u.forfeitTapLeafScript),
    intentTapLeafScript: (0, exports.serializeTapLeaf)(u.intentTapLeafScript),
    extraWitness: u.extraWitness?.map(base_1.hex.encode),
});
exports.serializeUtxo = serializeUtxo;
const deserializeTapLeaf = (t) => {
    const cb = btc_signer_1.TaprootControlBlock.decode(base_1.hex.decode(t.cb));
    const s = base_1.hex.decode(t.s);
    return [cb, s];
};
exports.deserializeTapLeaf = deserializeTapLeaf;
const deserializeVtxo = (o) => ({
    ...o,
    createdAt: new Date(o.createdAt),
    tapTree: base_1.hex.decode(o.tapTree),
    forfeitTapLeafScript: (0, exports.deserializeTapLeaf)(o.forfeitTapLeafScript),
    intentTapLeafScript: (0, exports.deserializeTapLeaf)(o.intentTapLeafScript),
    extraWitness: o.extraWitness?.map(base_1.hex.decode),
});
exports.deserializeVtxo = deserializeVtxo;
const deserializeUtxo = (o) => ({
    ...o,
    tapTree: base_1.hex.decode(o.tapTree),
    forfeitTapLeafScript: (0, exports.deserializeTapLeaf)(o.forfeitTapLeafScript),
    intentTapLeafScript: (0, exports.deserializeTapLeaf)(o.intentTapLeafScript),
    extraWitness: o.extraWitness?.map(base_1.hex.decode),
});
exports.deserializeUtxo = deserializeUtxo;
