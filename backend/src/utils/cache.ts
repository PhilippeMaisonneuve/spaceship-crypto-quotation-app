import { config } from '../config/environment'

/**
 * Cache utility functions
 */

/**
 * Checks if cache data is still valid (less than cache duration old)
 */
export const isCacheValid = (cachedAt: Date): boolean => {
  const now = new Date()
  const cacheAge = now.getTime() - cachedAt.getTime()
  return cacheAge < config.cacheDurationMs
}

/**
 * Global cache state management
 */
class CacheManager {
  private _isCacheUpdating = false

  get isCacheUpdating(): boolean {
    return this._isCacheUpdating
  }

  setUpdating(updating: boolean): void {
    this._isCacheUpdating = updating
  }

  async withLock<T>(operation: () => Promise<T>): Promise<T> {
    if (this._isCacheUpdating) {
      throw new Error('Cache update already in progress')
    }
    
    this._isCacheUpdating = true
    try {
      return await operation()
    } finally {
      this._isCacheUpdating = false
    }
  }
}

export const cacheManager = new CacheManager()