import { TransactionInput, TransactionOutput } from "@scure/btc-signer/psbt.js";
import { Transaction } from "../utils/transaction";
/**
 * Intent proof implementation for Bitcoin message signing.
 *
 * Intent proof defines a standard for signing Bitcoin messages as well as proving
 * ownership of coins. This namespace provides utilities for creating and
 * validating Intent proof.
 *
 * it is greatly inspired by BIP322.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki
 *
 * @example
 * ```typescript
 * // Create a Intent proof
 * const proof = Intent.create(
 *   "Hello Bitcoin!",
 *   [input],
 *   [output]
 * );
 *
 * // Sign the proof
 * const signedProof = await identity.sign(proof);
 *
 */
export declare namespace Intent {
    type Proof = Transaction;
    /**
     * Creates a new Intent proof unsigned transaction.
     *
     * This function constructs a special transaction that can be signed to prove
     * ownership of VTXOs and UTXOs. The proof includes the message to be
     * signed and the inputs/outputs that demonstrate ownership.
     *
     * @param message - The Intent message to be signed, either raw string of Message object
     * @param inputs - Array of transaction inputs to prove ownership of
     * @param outputs - Optional array of transaction outputs
     * @returns An unsigned Intent proof transaction
     */
    function create(message: string | Message, inputs: TransactionInput[], outputs?: TransactionOutput[]): Proof;
    function fee(proof: Proof): number;
    type RegisterMessage = {
        type: "register";
        onchain_output_indexes: number[];
        valid_at: number;
        expire_at: number;
        cosigners_public_keys: string[];
    };
    type DeleteMessage = {
        type: "delete";
        expire_at: number;
    };
    type GetPendingTxMessage = {
        type: "get-pending-tx";
        expire_at: number;
    };
    type Message = RegisterMessage | DeleteMessage | GetPendingTxMessage;
    function encodeMessage(message: Message): string;
}
