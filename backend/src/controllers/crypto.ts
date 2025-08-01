import { Request, Response, NextFunction } from 'express'
import { coinGeckoService } from '../services/coingecko'
import { dbService } from '../services/database'
import { cacheManager } from '../utils/cache'
import { asyncHandler } from '../middleware/errorHandler'

/**
 * Cryptocurrency data controllers
 */

/**
 * Get all cryptocurrencies with caching
 */
export const getAllCryptos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const forceRefresh = req.query.refresh

  // Check cached data first (unless force refresh is requested)
  if (!forceRefresh) {
    const cached = await dbService.getCachedCryptoList()
    
    if (cached.data.length > 0 && cached.isValid) {
      console.log(`Serving ${cached.data.length} cryptocurrencies from cache`)
      return res.json({
        success: true,
        total_count: cached.data.length,
        data: cached.data,
        cached: true,
        timestamp: cached.timestamp
      })
    }
  }

  const refreshReason = forceRefresh ? 'Force refresh requested' : 'Cache expired or missing'
  
  // Check if cache is already being updated
  if (cacheManager.isCacheUpdating) {
    console.log('Cache update already in progress, serving existing cache...')
    const cached = await dbService.getCachedCryptoList()
    
    if (cached.data.length > 0) {
      return res.json({
        success: true,
        total_count: cached.data.length,
        data: cached.data,
        cached: true,
        stale: true,
        message: 'Serving cached data while refreshing in background',
        timestamp: cached.timestamp
      })
    }
  }

  // Fetch fresh data with cache lock
  console.log(`Fetching fresh crypto data: ${refreshReason}`)
  
  try {
    const freshData = await cacheManager.withLock(async () => {
      const cryptos = await coinGeckoService.fetchTopCryptos()
      await dbService.updateCryptoListCache(cryptos)
      return cryptos
    })

    console.log(`Successfully fetched and cached ${freshData.length} cryptocurrencies`)
    
    res.json({
      success: true,
      total_count: freshData.length,
      data: freshData,
      cached: false,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    // If API fails, try to serve stale cached data as fallback
    console.log('API call failed, attempting to serve stale cached data...')
    
    const cached = await dbService.getCachedCryptoList()
    if (cached.data.length > 0) {
      console.log(`Serving ${cached.data.length} stale cached cryptocurrencies as fallback`)
      return res.json({
        success: true,
        total_count: cached.data.length,
        data: cached.data,
        cached: true,
        stale: true,
        warning: 'API temporarily unavailable, serving cached data',
        timestamp: cached.timestamp
      })
    }
    
    // No cache available, throw the original error
    throw error
  }
})

/**
 * Get cryptocurrencies (legacy endpoint for compatibility)
 */
export const getCryptos = getAllCryptos

/**
 * Get detailed information for a specific cryptocurrency
 */
export const getCryptoDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  // Check cache first
  const cached = await dbService.getCachedCryptoDetail(id)
  
  if (cached.data && cached.isValid) {
    console.log(`Serving crypto detail for ${id} from cache`)
    return res.json({
      success: true,
      data: cached.data,
      cached: true
    })
  }

  console.log(`Fetching fresh crypto detail for ${id}`)
  
  try {
    const detail = await coinGeckoService.fetchCryptoDetail(id)
    await dbService.updateCryptoDetailCache(detail)
    
    res.json({
      success: true,
      data: detail,
      cached: false
    })
  } catch (error: any) {
    // If we have stale cache, serve it as fallback
    if (cached.data) {
      console.log(`API failed, serving stale cached detail for ${id}`)
      return res.json({
        success: true,
        data: cached.data,
        cached: true,
        stale: true,
        warning: 'API temporarily unavailable, serving cached data'
      })
    }
    
    throw error
  }
})

/**
 * Get price history for a cryptocurrency
 */
export const getCryptoHistory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const days = parseInt(req.query.days as string) || 365

  // Check cache first
  const cached = await dbService.getCachedPriceHistory(id, days.toString())
  
  if (cached.data && cached.isValid) {
    console.log(`Serving price history for ${id} from cache`)
    return res.json({
      success: true,
      data: cached.data,
      cached: true
    })
  }

  console.log(`Fetching fresh price history for ${id}`)
  
  try {
    const history = await coinGeckoService.fetchPriceHistory(id, days)
    await dbService.updatePriceHistoryCache(id, history, days.toString())
    
    res.json({
      success: true,
      data: history,
      cached: false
    })
  } catch (error: any) {
    // If we have stale cache, serve it as fallback
    if (cached.data) {
      console.log(`API failed, serving stale cached history for ${id}`)
      return res.json({
        success: true,
        data: cached.data,
        cached: true,
        stale: true,
        warning: 'API temporarily unavailable, serving cached data'
      })
    }
    
    throw error
  }
})

/**
 * Search cryptocurrencies
 */
export const searchCryptos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.params

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
      status: 400
    })
  }

  console.log(`Searching for cryptocurrencies with query: "${query}"`)
  
  const searchResults = await coinGeckoService.searchCryptos(query)
  
  // Format the results to match our API response format
  const formattedData = searchResults.slice(0, 50).map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    market_cap_rank: coin.market_cap_rank || 999999,
    image: coin.large || coin.thumb || ''
  }))

  res.json({
    success: true,
    data: formattedData,
    query: query,
    found_count: formattedData.length,
    timestamp: new Date().toISOString()
  })
})