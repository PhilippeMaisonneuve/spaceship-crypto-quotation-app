import { Request, Response, NextFunction } from 'express'
import { coinGeckoService } from '../services/coingecko'
import { asyncHandler } from '../middleware/errorHandler'

/**
 * Health check controllers
 */

/**
 * Basic health check endpoint
 */
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Crypto API is running',
    timestamp: new Date().toISOString()
  })
}

/**
 * Test CoinGecko API connectivity and authentication
 */
export const testConnection = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const testResult = await coinGeckoService.testConnection()
  
  res.json({
    success: true,
    ...testResult,
    timestamp: new Date().toISOString()
  })
})