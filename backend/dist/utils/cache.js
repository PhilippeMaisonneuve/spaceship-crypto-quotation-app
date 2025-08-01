"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManager = exports.isCacheValid = void 0;
const environment_1 = require("../config/environment");
/**
 * Cache utility functions
 */
/**
 * Checks if cache data is still valid (less than cache duration old)
 */
const isCacheValid = (cachedAt) => {
    const now = new Date();
    const cacheAge = now.getTime() - cachedAt.getTime();
    return cacheAge < environment_1.config.cacheDurationMs;
};
exports.isCacheValid = isCacheValid;
/**
 * Global cache state management
 */
class CacheManager {
    constructor() {
        this._isCacheUpdating = false;
    }
    get isCacheUpdating() {
        return this._isCacheUpdating;
    }
    setUpdating(updating) {
        this._isCacheUpdating = updating;
    }
    withLock(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isCacheUpdating) {
                throw new Error('Cache update already in progress');
            }
            this._isCacheUpdating = true;
            try {
                return yield operation();
            }
            finally {
                this._isCacheUpdating = false;
            }
        });
    }
}
exports.cacheManager = new CacheManager();
