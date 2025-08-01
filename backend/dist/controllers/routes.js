"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = require("./health");
const crypto_1 = require("./crypto");
/**
 * API Routes configuration
 */
const router = (0, express_1.Router)();
// Health and test routes
router.get('/health', health_1.healthCheck);
router.get('/test', health_1.testConnection);
// Cryptocurrency routes
router.get('/cryptos/all', crypto_1.getAllCryptos);
router.get('/cryptos', crypto_1.getCryptos); // Legacy compatibility
router.get('/cryptos/:id/details', crypto_1.getCryptoDetail);
router.get('/cryptos/:id/history', crypto_1.getCryptoHistory);
// Search routes
router.get('/search/:query', crypto_1.searchCryptos);
exports.default = router;
