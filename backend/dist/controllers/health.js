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
exports.testConnection = exports.healthCheck = void 0;
const coingecko_1 = require("../services/coingecko");
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Health check controllers
 */
/**
 * Basic health check endpoint
 */
const healthCheck = (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        message: 'Crypto API is running',
        timestamp: new Date().toISOString()
    });
};
exports.healthCheck = healthCheck;
/**
 * Test CoinGecko API connectivity and authentication
 */
exports.testConnection = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const testResult = yield coingecko_1.coinGeckoService.testConnection();
    res.json(Object.assign(Object.assign({ success: true }, testResult), { timestamp: new Date().toISOString() }));
}));
