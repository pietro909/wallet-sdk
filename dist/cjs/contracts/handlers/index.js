"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VHTLCContractHandler = exports.DefaultContractHandler = exports.contractHandlers = void 0;
var registry_1 = require("./registry");
Object.defineProperty(exports, "contractHandlers", { enumerable: true, get: function () { return registry_1.contractHandlers; } });
var default_1 = require("./default");
Object.defineProperty(exports, "DefaultContractHandler", { enumerable: true, get: function () { return default_1.DefaultContractHandler; } });
var vhtlc_1 = require("./vhtlc");
Object.defineProperty(exports, "VHTLCContractHandler", { enumerable: true, get: function () { return vhtlc_1.VHTLCContractHandler; } });
// Register built-in handlers
const registry_2 = require("./registry");
const default_2 = require("./default");
const vhtlc_2 = require("./vhtlc");
registry_2.contractHandlers.register(default_2.DefaultContractHandler);
registry_2.contractHandlers.register(vhtlc_2.VHTLCContractHandler);
