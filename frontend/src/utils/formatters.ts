/**
 * Utility functions for formatting data
 */

/**
 * Format currency values with appropriate suffixes
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 8
  }).format(value)
}

/**
 * Format percentage values with + or - prefix
 */
export const formatPercentage = (value: number | null): string => {
  if (value === null || value === undefined) return 'N/A'
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

/**
 * Format date strings
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format large numbers with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}