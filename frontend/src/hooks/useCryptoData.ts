import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { CryptoApiService } from '../services/cryptoApi'
import type { CryptoData, CryptoStats, SortOption, SortOrder } from '../types/crypto'

/**
 * Hook for managing cryptocurrency data, search, and sorting
 */
export const useCryptoData = () => {
  // Data state
  const [allCryptoData, setAllCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [externalSearchResults, setExternalSearchResults] = useState<CryptoData[]>([])
  const [isExternalSearchLoading, setIsExternalSearchLoading] = useState(false)
  const [showExternalResults, setShowExternalResults] = useState(false)

  // Sorting state
  const [sortBy, setSortBy] = useState<SortOption>('market_cap')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const location = useLocation()

  /**
   * Fetch all cryptocurrency data
   */
  const fetchAllCryptoData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      setWarning(null)
      
      const result = await CryptoApiService.getAllCryptos(forceRefresh)
      
      if (result.success) {
        setAllCryptoData(result.data)
        setLastUpdated(new Date(result.timestamp))
        
        if (result.warning) {
          setWarning(result.warning)
        }
      } else {
        setError('Failed to fetch cryptocurrency data')
      }
    } catch (err) {
      console.error('Error fetching crypto data:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Search external API
   */
  const searchExternalAPI = useCallback(async (query: string) => {
    if (!query.trim()) return

    try {
      setIsExternalSearchLoading(true)
      setError(null)
      
      const result = await CryptoApiService.searchCryptos(query)
      
      if (result.success) {
        setExternalSearchResults(result.data)
        setShowExternalResults(true)
      } else {
        setError('Failed to search cryptocurrencies')
      }
    } catch (err) {
      console.error('Error searching:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setIsExternalSearchLoading(false)
    }
  }, [])

  /**
   * Return to cached results
   */
  const backToCachedResults = useCallback(() => {
    setShowExternalResults(false)
    setExternalSearchResults([])
    setSearchTerm('')
  }, [])

  /**
   * Filter and sort data
   */
  const filteredAndSortedData = useMemo(() => {
    const dataToFilter = showExternalResults ? externalSearchResults : allCryptoData
    
    // Filter by search term
    const filtered = dataToFilter.filter((crypto) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        crypto.name.toLowerCase().includes(searchLower) ||
        crypto.symbol.toLowerCase().includes(searchLower)
      )
    })

    // Sort data
    return filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      // Handle null values
      if (aValue === null && bValue === null) return 0
      if (aValue === null) return sortOrder === 'asc' ? -1 : 1
      if (bValue === null) return sortOrder === 'asc' ? 1 : -1

      // Convert to numbers for numeric fields
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      // String comparison for text fields
      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()
      
      if (sortOrder === 'asc') {
        return aString < bString ? -1 : aString > bString ? 1 : 0
      } else {
        return aString > bString ? -1 : aString < bString ? 1 : 0
      }
    })
  }, [allCryptoData, externalSearchResults, showExternalResults, searchTerm, sortBy, sortOrder])

  /**
   * Calculate market statistics
   */
  const stats = useMemo((): CryptoStats | null => {
    if (allCryptoData.length === 0) return null

    const totalMarketCap = allCryptoData.reduce((sum, crypto) => sum + crypto.market_cap, 0)
    const totalVolume = allCryptoData.reduce((sum, crypto) => sum + crypto.volume_24h, 0)
    
    const gainers = allCryptoData.filter(crypto => 
      crypto.price_change_percentage_24h !== null && crypto.price_change_percentage_24h > 0
    ).length
    
    const losers = allCryptoData.filter(crypto => 
      crypto.price_change_percentage_24h !== null && crypto.price_change_percentage_24h < 0
    ).length

    return { totalMarketCap, totalVolume, gainers, losers }
  }, [allCryptoData])

  // Auto-refresh when returning to page
  useEffect(() => {
    if (location.pathname === '/' && lastUpdated) {
      const now = new Date()
      const timeDiff = now.getTime() - lastUpdated.getTime()
      
      if (timeDiff > 60000) { // More than 1 minute
        fetchAllCryptoData()
      }
    }
  }, [location.pathname, lastUpdated, fetchAllCryptoData])

  // Auto-refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastUpdated) {
        const now = new Date()
        const timeDiff = now.getTime() - lastUpdated.getTime()
        
        if (timeDiff > 60000) { // More than 1 minute
          fetchAllCryptoData()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [lastUpdated, fetchAllCryptoData])

  // Initial data load
  useEffect(() => {
    fetchAllCryptoData()
  }, [fetchAllCryptoData])

  return {
    // Data
    allCryptoData,
    filteredAndSortedData,
    stats,
    loading,
    error,
    warning,
    lastUpdated,

    // Search
    searchTerm,
    setSearchTerm,
    externalSearchResults,
    isExternalSearchLoading,
    showExternalResults,
    searchExternalAPI,
    backToCachedResults,

    // Sorting
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // Actions
    fetchAllCryptoData
  }
}