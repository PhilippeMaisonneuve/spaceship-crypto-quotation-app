"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.notFoundHandler = exports.errorHandler = exports.asyncHandler = void 0;
const coingecko_1 = require("../services/coingecko");
/**
 * Async wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Global error handler middleware
 */
const errorHandler = (error, req, res, next) => {
    var _a;
    console.error('❌ API Error:', error);
    // Handle CoinGecko API errors
    if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('Request failed')) || error.response) {
        const apiError = coingecko_1.CoinGeckoService.handleApiError(error);
        return res.status(apiError.status).json({
            success: false,
            error: apiError.message,
            status: apiError.status,
            details: apiError.details
        });
    }
    // Handle custom app errors
    if (error.status) {
        return res.status(error.status).json({
            success: false,
            error: error.message,
            status: error.status,
            details: error.details
        });
    }
    // Handle generic errors
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        status: 500,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};
exports.errorHandler = errorHandler;
/**
 * 404 handler for unknown routes
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
        status: 404
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const method = req.method;
        const url = req.url;
        const emoji = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
        console.log(`${emoji} ${method} ${url} ${status} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
