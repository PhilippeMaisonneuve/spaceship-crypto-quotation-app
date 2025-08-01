import axios from 'axios'
import { config } from '../config/environment'
import { CryptoData, CryptoDetail, ChartData } from '../types/crypto'
import { formatCryptoData, formatCryptoDetail, formatChartData } from '../utils/formatters'

/**
 * CoinGecko API service for fetching cryptocurrency data
 */
export class CoinGeckoService {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = config.coinGeckoBaseUrl
    this.headers = {
      'x-cg-demo-api-key': config.coinGeckoApiKey
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<{ ping: any, markets_count: number }> {
    const ping = await axios.get(`${this.baseUrl}/ping`, { headers: this.headers })
    const markets = await axios.get(`${this.baseUrl}/coins/markets`, {
      headers: this.headers,
      params: {
        vs_currency: 'usd',
        per_page: 250,
        page: 1,
        sparkline: false,
        locale: 'en'
      }
    })

    return {
      ping: ping.data,
      markets_count: markets.data.length
    }
  }

  /**
   * Fetch top 1000 cryptocurrencies (4 pages of 250 each)
   */
  async fetchTopCryptos(): Promise<CryptoData[]> {
    const allCryptos: CryptoData[] = []
    const pages = [1, 2, 3, 4] // 4 pages × 250 = 1000 cryptos

    const pagePromises = pages.map(async (page) => {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        headers: this.headers,
        params: {
          vs_currency: 'usd',
          per_page: 250,
          page,
          sparkline: false,
          locale: 'en'
        }
      })

      return response.data.map(formatCryptoData)
    })

    const pageResults = await Promise.all(pagePromises)
    pageResults.forEach(pageData => allCryptos.push(...pageData))

    return allCryptos
  }

  /**
   * Fetch detailed information for a specific cryptocurrency
   */
  async fetchCryptoDetail(cryptoId: string): Promise<CryptoDetail> {
    const response = await axios.get(`${this.baseUrl}/coins/${cryptoId}`, {
      headers: this.headers,
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    })

    return formatCryptoDetail(response.data)
  }

  /**
   * Fetch price history for a cryptocurrency
   */
  async fetchPriceHistory(cryptoId: string, days: number = 365): Promise<ChartData[]> {
    const response = await axios.get(`${this.baseUrl}/coins/${cryptoId}/market_chart`, {
      headers: this.headers,
      params: {
        vs_currency: 'usd',
        days,
        interval: days <= 30 ? 'hourly' : 'daily'
      }
    })

    return formatChartData(response.data.prices)
  }

  /**
   * Search cryptocurrencies by query
   */
  async searchCryptos(query: string): Promise<any[]> {
    const response = await axios.get(`${this.baseUrl}/search`, {
      headers: this.headers,
      params: { query }
    })

    return response.data.coins || []
  }

  /**
   * Handle API errors with specific error messages
   */
  static handleApiError(error: any): { status: number, message: string, details?: any } {
    const status = error.response?.status || 500
    let message = 'Failed to fetch data from CoinGecko API'

    switch (status) {
      case 429:
        message = 'Rate limit exceeded – too many requests. Please try again in a few minutes.'
        break
      case 401:
        message = 'Authentication failed – check your CoinGecko API key'
        break
      case 404:
        message = 'Cryptocurrency not found'
        break
      case 500:
      case 502:
      case 503:
        message = 'CoinGecko API is temporarily unavailable'
        break
      default:
        message = `API error: ${error.response?.statusText || error.message}`
    }

    return {
      status,
      message,
      details: error.response?.data || error.message
    }
  }
}

export const coinGeckoService = new CoinGeckoService()