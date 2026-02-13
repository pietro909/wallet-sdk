"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtxoScript = exports.TapTreeCoder = void 0;
exports.scriptFromTapLeafScript = scriptFromTapLeafScript;
const btc_signer_1 = require("@scure/btc-signer");
const payment_js_1 = require("@scure/btc-signer/payment.js");
const psbt_js_1 = require("@scure/btc-signer/psbt.js");
const base_1 = require("@scure/base");
const address_1 = require("./address");
const tapscript_1 = require("./tapscript");
exports.TapTreeCoder = psbt_js_1.PSBTOutput.tapTree[2];
function scriptFromTapLeafScript(leaf) {
    return leaf[1].subarray(0, leaf[1].length - 1); // remove the version byte
}
/**
 * VtxoScript is a script that contains a list of tapleaf scripts.
 * It is used to create vtxo scripts.
 *
 * @example
 * ```typescript
 * const vtxoScript = new VtxoScript([new Uint8Array(32), new Uint8Array(32)]);
 */
class VtxoScript {
    static decode(tapTree) {
        const leaves = exports.TapTreeCoder.decode(tapTree);
        const scripts = leaves.map((leaf) => leaf.script);
        return new VtxoScript(scripts);
    }
    constructor(scripts) {
        this.scripts = scripts;
        // reverse the scripts if the number of scripts is odd
        // this is to be compatible with arkd algorithm computing taproot tree from list of tapscripts
        // the scripts must be reversed only HERE while we compute the tweaked public key
        // but the original order should be preserved while encoding as taptree
        // note: .slice().reverse() is used instead of .reverse() to avoid mutating the original array
        const list = scripts.length % 2 !== 0 ? scripts.slice().reverse() : scripts;
        const tapTree = (0, btc_signer_1.taprootListToTree)(list.map((script) => ({
            script,
            leafVersion: payment_js_1.TAP_LEAF_VERSION,
        })));
        const payment = (0, btc_signer_1.p2tr)(btc_signer_1.TAPROOT_UNSPENDABLE_KEY, tapTree, undefined, true);
        if (!payment.tapLeafScript ||
            payment.tapLeafScript.length !== scripts.length) {
            throw new Error("invalid scripts");
        }
        this.leaves = payment.tapLeafScript;
        this.tweakedPublicKey = payment.tweakedPubkey;
    }
    encode() {
        const tapTree = exports.TapTreeCoder.encode(this.scripts.map((script) => ({
            depth: 1,
            version: payment_js_1.TAP_LEAF_VERSION,
            script,
        })));
        return tapTree;
    }
    address(prefix, serverPubKey) {
        return new address_1.ArkAddress(serverPubKey, this.tweakedPublicKey, prefix);
    }
    get pkScript() {
        return btc_signer_1.Script.encode(["OP_1", this.tweakedPublicKey]);
    }
    onchainAddress(network) {
        return (0, btc_signer_1.Address)(network).encode({
            type: "tr",
            pubkey: this.tweakedPublicKey,
        });
    }
    findLeaf(scriptHex) {
        const leaf = this.leaves.find((leaf) => base_1.hex.encode(scriptFromTapLeafScript(leaf)) === scriptHex);
        if (!leaf) {
            throw new Error(`leaf '${scriptHex}' not found`);
        }
        return leaf;
    }
    exitPaths() {
        const paths = [];
        for (const leaf of this.leaves) {
            try {
                const tapscript = tapscript_1.CSVMultisigTapscript.decode(scriptFromTapLeafScript(leaf));
                paths.push(tapscript);
                continue;
            }
            catch (e) {
                try {
                    const tapscript = tapscript_1.ConditionCSVMultisigTapscript.decode(scriptFromTapLeafScript(leaf));
                    paths.push(tapscript);
                }
                catch (e) {
                    continue;
                }
            }
        }
        return paths;
    }
}
exports.VtxoScript = VtxoScript;
