import { PrismaClient } from '@prisma/client'
import { CryptoData, CryptoDetail, ChartData } from '../types/crypto'
import { formatCachedCryptoData } from '../utils/formatters'
import { isCacheValid } from '../utils/cache'

/**
 * Database service for managing cryptocurrency cache
 */
export class DatabaseService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  /**
   * Get cached crypto list
   */
  async getCachedCryptoList(): Promise<{ data: CryptoData[], isValid: boolean, timestamp?: string }> {
    const cachedData = await this.prisma.cryptoListCache.findMany({
      orderBy: { market_cap_rank: 'asc' }
    })

    if (cachedData.length === 0) {
      return { data: [], isValid: false }
    }

    // Check if the newest entry is still valid
    const newestCache = cachedData.reduce((newest: any, current: any) => 
      current.cachedAt > newest.cachedAt ? current : newest
    )

    const isValid = isCacheValid(newestCache.cachedAt)
    const formattedData = cachedData.map(formatCachedCryptoData)

    return {
      data: formattedData,
      isValid,
      timestamp: newestCache.cachedAt.toISOString()
    }
  }

  /**
   * Update crypto list cache
   */
  async updateCryptoListCache(cryptos: CryptoData[]): Promise<void> {
    const now = new Date()
    
    // Use upsert to prevent unique constraint violations
    const upsertPromises = cryptos.map(crypto =>
      this.prisma.cryptoListCache.upsert({
        where: { cryptoId: crypto.id },
        update: {
          symbol: crypto.symbol,
          name: crypto.name,
          current_price: crypto.current_price,
          price_change_percentage_24h: crypto.price_change_percentage_24h,
          market_cap: crypto.market_cap,
          volume_24h: crypto.volume_24h,
          image: crypto.image,
          market_cap_rank: crypto.market_cap_rank,
          cachedAt: now
        },
        create: {
          cryptoId: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          current_price: crypto.current_price,
          price_change_percentage_24h: crypto.price_change_percentage_24h,
          market_cap: crypto.market_cap,
          volume_24h: crypto.volume_24h,
          image: crypto.image,
          market_cap_rank: crypto.market_cap_rank,
          cachedAt: now
        }
      })
    )

    await Promise.all(upsertPromises)
  }

  /**
   * Get cached crypto detail
   */
  async getCachedCryptoDetail(cryptoId: string): Promise<{ data: CryptoDetail | null, isValid: boolean }> {
    const cached = await this.prisma.cryptoDetailCache.findUnique({
      where: { cryptoId }
    })

    if (!cached) {
      return { data: null, isValid: false }
    }

    const isValid = isCacheValid(cached.cachedAt)
    
    if (!isValid) {
      return { data: null, isValid: false }
    }

    return {
      data: {
        id: cached.cryptoId,
        symbol: cached.symbol,
        name: cached.name,
        description: cached.description || '',
        current_price: cached.current_price,
        price_change_percentage_24h: cached.price_change_percentage_24h,
        price_change_percentage_7d: cached.price_change_percentage_7d,
        price_change_percentage_30d: cached.price_change_percentage_30d,
        market_cap: cached.market_cap,
        market_cap_rank: cached.market_cap_rank,
        volume_24h: cached.volume_24h,
        circulating_supply: cached.circulating_supply,
        total_supply: cached.total_supply,
        max_supply: cached.max_supply,
        ath: cached.ath,
        ath_date: cached.ath_date,
        atl: cached.atl,
        atl_date: cached.atl_date,
        image: cached.image,
        website: cached.website || '',
        blockchain_site: cached.blockchain_site || '',
        official_forum_url: cached.official_forum_url || '',
        repos_url: cached.repos_url || ''
      },
      isValid: true
    }
  }

  /**
   * Update crypto detail cache
   */
  async updateCryptoDetailCache(detail: CryptoDetail): Promise<void> {
    await this.prisma.cryptoDetailCache.upsert({
      where: { cryptoId: detail.id },
      update: {
        symbol: detail.symbol,
        name: detail.name,
        description: detail.description,
        current_price: detail.current_price,
        price_change_percentage_24h: detail.price_change_percentage_24h,
        price_change_percentage_7d: detail.price_change_percentage_7d,
        price_change_percentage_30d: detail.price_change_percentage_30d,
        market_cap: detail.market_cap,
        market_cap_rank: detail.market_cap_rank,
        volume_24h: detail.volume_24h,
        circulating_supply: detail.circulating_supply,
        total_supply: detail.total_supply,
        max_supply: detail.max_supply,
        ath: detail.ath,
        ath_date: detail.ath_date,
        atl: detail.atl,
        atl_date: detail.atl_date,
        image: detail.image,
        website: detail.website,
        blockchain_site: detail.blockchain_site,
        official_forum_url: detail.official_forum_url,
        repos_url: detail.repos_url,
        cachedAt: new Date()
      },
      create: {
        cryptoId: detail.id,
        symbol: detail.symbol,
        name: detail.name,
        description: detail.description,
        current_price: detail.current_price,
        price_change_percentage_24h: detail.price_change_percentage_24h,
        price_change_percentage_7d: detail.price_change_percentage_7d,
        price_change_percentage_30d: detail.price_change_percentage_30d,
        market_cap: detail.market_cap,
        market_cap_rank: detail.market_cap_rank,
        volume_24h: detail.volume_24h,
        circulating_supply: detail.circulating_supply,
        total_supply: detail.total_supply,
        max_supply: detail.max_supply,
        ath: detail.ath,
        ath_date: detail.ath_date,
        atl: detail.atl,
        atl_date: detail.atl_date,
        image: detail.image,
        website: detail.website,
        blockchain_site: detail.blockchain_site,
        official_forum_url: detail.official_forum_url,
        repos_url: detail.repos_url,
        cachedAt: new Date()
      }
    })
  }

  /**
   * Get cached price history
   */
  async getCachedPriceHistory(cryptoId: string, days: string = '365'): Promise<{ data: ChartData[] | null, isValid: boolean }> {
    const cached = await this.prisma.priceHistoryCache.findUnique({
      where: { 
        cryptoId_days: {
          cryptoId,
          days
        }
      }
    })

    if (!cached) {
      return { data: null, isValid: false }
    }

    const isValid = isCacheValid(cached.cachedAt)
    
    if (!isValid) {
      return { data: null, isValid: false }
    }

    return {
      data: JSON.parse(cached.data),
      isValid: true
    }
  }

  /**
   * Update price history cache
   */
  async updatePriceHistoryCache(cryptoId: string, chartData: ChartData[], days: string = '365'): Promise<void> {
    await this.prisma.priceHistoryCache.upsert({
      where: { 
        cryptoId_days: {
          cryptoId,
          days
        }
      },
      update: {
        data: JSON.stringify(chartData),
        cachedAt: new Date()
      },
      create: {
        cryptoId,
        days,
        data: JSON.stringify(chartData),
        cachedAt: new Date()
      }
    })
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

export const dbService = new DatabaseService()