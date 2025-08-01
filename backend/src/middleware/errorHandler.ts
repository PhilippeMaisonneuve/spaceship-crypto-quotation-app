import { Request, Response, NextFunction } from 'express'
import { CoinGeckoService } from '../services/coingecko'

/**
 * Error handling middleware
 */

export interface AppError extends Error {
  status?: number
  details?: any
  response?: any
}

/**
 * Async wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ API Error:', error)

  // Handle CoinGecko API errors
  if (error.message?.includes('Request failed') || error.response) {
    const apiError = CoinGeckoService.handleApiError(error)
    return res.status(apiError.status).json({
      success: false,
      error: apiError.message,
      status: apiError.status,
      details: apiError.details
    })
  }

  // Handle custom app errors
  if (error.status) {
    return res.status(error.status).json({
      success: false,
      error: error.message,
      status: error.status,
      details: error.details
    })
  }

  // Handle generic errors
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    status: 500,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
}

/**
 * 404 handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    status: 404
  })
}

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    const method = req.method
    const url = req.url
    
    const emoji = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅'
    console.log(`${emoji} ${method} ${url} ${status} - ${duration}ms`)
  })
  
  next()
}