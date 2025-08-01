import { Router } from 'express'
import { healthCheck, testConnection } from './health'
import { 
  getAllCryptos, 
  getCryptos, 
  getCryptoDetail, 
  getCryptoHistory, 
  searchCryptos 
} from './crypto'

/**
 * API Routes configuration
 */

const router = Router()

// Health and test routes
router.get('/health', healthCheck)
router.get('/test', testConnection)

// Cryptocurrency routes
router.get('/cryptos/all', getAllCryptos)
router.get('/cryptos', getCryptos) // Legacy compatibility
router.get('/cryptos/:id/details', getCryptoDetail)
router.get('/cryptos/:id/history', getCryptoHistory)

// Search routes
router.get('/search/:query', searchCryptos)

export default router