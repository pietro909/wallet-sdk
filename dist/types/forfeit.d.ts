import { Transaction } from "./utils/transaction";
import { TransactionInputUpdate } from "@scure/btc-signer/psbt.js";
export declare function buildForfeitTx(inputs: TransactionInputUpdate[], forfeitPkScript: Uint8Array, txLocktime?: number): Transaction;
