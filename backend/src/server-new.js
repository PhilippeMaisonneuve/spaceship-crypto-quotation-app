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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("./config/environment");
const routes_1 = __importDefault(require("./controllers/routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const database_1 = require("./services/database");
/**
 * Clean, modular Express server for Crypto Quotation API
 */
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(errorHandler_1.requestLogger);
// API Routes
app.use('/api', routes_1.default);
// Error handling
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// Graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n🛑 Shutting down server gracefully...');
    yield database_1.dbService.disconnect();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    yield database_1.dbService.disconnect();
    process.exit(0);
}));
// Start server
const server = app.listen(environment_1.config.port, () => {
    console.log(`🚀 Crypto API server running on port ${environment_1.config.port}`);
    console.log(`📊 Environment: ${environment_1.config.nodeEnv}`);
    console.log(`🔗 Health check: http://localhost:${environment_1.config.port}/api/health`);
});
exports.default = app;
