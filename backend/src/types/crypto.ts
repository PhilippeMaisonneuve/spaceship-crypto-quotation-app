/**
 * Core cryptocurrency data types
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

export interface CryptoDetail {
  id: string
  symbol: string
  name: string
  description: string
  current_price: number
  price_change_percentage_24h: number | null
  price_change_percentage_7d: number | null
  price_change_percentage_30d: number | null
  market_cap: number
  market_cap_rank: number
  volume_24h: number
  circulating_supply: number | null
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_date: string
  atl: number
  atl_date: string
  image: string
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
  data?: T
  error?: string
  status?: number
  cached?: boolean
  timestamp?: string
  total_count?: number
  found_count?: number
  query?: string
  details?: any
}

export interface CacheStatus {
  isCacheUpdating: boolean
}