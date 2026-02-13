"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DUST_AMOUNT = void 0;
exports.extendVirtualCoin = extendVirtualCoin;
exports.extendCoin = extendCoin;
exports.getRandomId = getRandomId;
const base_1 = require("@scure/base");
exports.DUST_AMOUNT = 546; // sats
function extendVirtualCoin(wallet, vtxo) {
    return {
        ...vtxo,
        forfeitTapLeafScript: wallet.offchainTapscript.forfeit(),
        intentTapLeafScript: wallet.offchainTapscript.forfeit(),
        tapTree: wallet.offchainTapscript.encode(),
    };
}
function extendCoin(wallet, utxo) {
    return {
        ...utxo,
        forfeitTapLeafScript: wallet.boardingTapscript.forfeit(),
        intentTapLeafScript: wallet.boardingTapscript.forfeit(),
        tapTree: wallet.boardingTapscript.encode(),
    };
}
function getRandomId() {
    const randomValue = crypto.getRandomValues(new Uint8Array(16));
    return base_1.hex.encode(randomValue);
}
