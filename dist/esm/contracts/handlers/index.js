export { contractHandlers } from './registry.js';
export { DefaultContractHandler } from './default.js';
export { VHTLCContractHandler } from './vhtlc.js';
// Register built-in handlers
import { contractHandlers } from './registry.js';
import { DefaultContractHandler } from './default.js';
import { VHTLCContractHandler } from './vhtlc.js';
contractHandlers.register(DefaultContractHandler);
contractHandlers.register(VHTLCContractHandler);
