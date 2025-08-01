/**
 * Type definitions for cryptocurrency data
 */

export interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number | null
  market_cap: number
  volume_24h: number
  image: string
  market_cap_rank: number
}

export interface CryptoDetail extends CryptoData {
  description: string
  price_change_percentage_7d: number | null
  price_change_percentage_30d: number | null
  circulating_supply: number | null
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_date: string
  atl: number
  atl_date: string
  website: string
  blockchain_site: string
  official_forum_url: string
  repos_url: string
}

export interface ChartData {
  date: string
  price: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  total_count?: number
  cached?: boolean
  stale?: boolean
  timestamp: string
  warning?: string
}

export interface CryptoStats {
  totalMarketCap: number
  totalVolume: number
  gainers: number
  losers: number
}

export type SortOption = 'market_cap' | 'current_price' | 'price_change_percentage_24h' | 'volume_24h' | 'name'
export type SortOrder = 'asc' | 'desc'