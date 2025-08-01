import type { CryptoData, CryptoDetail, ApiResponse, ChartData } from '../types/crypto'

// Dynamic API base URL for different environments
const API_BASE_URL = '/api'

/**
 * API service for cryptocurrency data
 */
export class CryptoApiService {
  /**
   * Fetch all cryptocurrencies
   */
  static async getAllCryptos(forceRefresh: boolean = false): Promise<ApiResponse<CryptoData[]>> {
    const url = forceRefresh 
      ? `${API_BASE_URL}/cryptos/all?refresh=${Date.now()}`
      : `${API_BASE_URL}/cryptos/all`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch cryptocurrencies`)
    }
    
    return response.json()
  }

  /**
   * Fetch detailed information for a specific cryptocurrency
   */
  static async getCryptoDetails(id: string): Promise<ApiResponse<CryptoDetail>> {
    const response = await fetch(`${API_BASE_URL}/cryptos/${id}/details`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch crypto details`)
    }
    
    return response.json()
  }

  /**
   * Fetch historical price data
   */
  static async getCryptoHistory(id: string, days: number = 365): Promise<ApiResponse<ChartData[]>> {
    const response = await fetch(`${API_BASE_URL}/cryptos/${id}/history?days=${days}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch price history`)
    }
    
    return response.json()
  }

  /**
   * Search cryptocurrencies
   */
  static async searchCryptos(query: string): Promise<ApiResponse<CryptoData[]>> {
    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to search cryptocurrencies`)
    }
    
    return response.json()
  }
}