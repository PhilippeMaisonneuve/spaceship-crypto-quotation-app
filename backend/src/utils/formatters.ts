/**
 * Data formatting and transformation utilities
 */

/**
 * Formats CoinGecko API response to our standard format
 */
export const formatCryptoData = (apiData: any) => ({
  id: apiData.id,
  symbol: apiData.symbol,
  name: apiData.name,
  current_price: apiData.current_price,
  price_change_percentage_24h: apiData.price_change_percentage_24h,
  market_cap: apiData.market_cap,
  volume_24h: apiData.total_volume,
  image: apiData.image,
  market_cap_rank: apiData.market_cap_rank
})

/**
 * Formats cached data to API response format
 */
export const formatCachedCryptoData = (cachedData: any) => ({
  id: cachedData.cryptoId,
  symbol: cachedData.symbol,
  name: cachedData.name,
  current_price: cachedData.current_price,
  price_change_percentage_24h: cachedData.price_change_percentage_24h,
  market_cap: cachedData.market_cap,
  volume_24h: cachedData.volume_24h,
  image: cachedData.image,
  market_cap_rank: cachedData.market_cap_rank
})

/**
 * Formats CoinGecko coin detail response
 */
export const formatCryptoDetail = (apiData: any) => ({
  id: apiData.id,
  symbol: apiData.symbol,
  name: apiData.name,
  description: apiData.description?.en || '',
  current_price: apiData.market_data?.current_price?.usd || 0,
  price_change_percentage_24h: apiData.market_data?.price_change_percentage_24h || null,
  price_change_percentage_7d: apiData.market_data?.price_change_percentage_7d || null,
  price_change_percentage_30d: apiData.market_data?.price_change_percentage_30d || null,
  market_cap: apiData.market_data?.market_cap?.usd || 0,
  market_cap_rank: apiData.market_cap_rank || 0,
  volume_24h: apiData.market_data?.total_volume?.usd || 0,
  circulating_supply: apiData.market_data?.circulating_supply || null,
  total_supply: apiData.market_data?.total_supply || null,
  max_supply: apiData.market_data?.max_supply || null,
  ath: apiData.market_data?.ath?.usd || 0,
  ath_date: apiData.market_data?.ath_date?.usd || '',
  atl: apiData.market_data?.atl?.usd || 0,
  atl_date: apiData.market_data?.atl_date?.usd || '',
  image: apiData.image?.large || '',
  website: apiData.links?.homepage?.[0] || '',
  blockchain_site: apiData.links?.blockchain_site?.[0] || '',
  official_forum_url: apiData.links?.official_forum_url?.[0] || '',
  repos_url: apiData.links?.repos_url?.github?.[0] || ''
})

/**
 * Formats chart data from CoinGecko API
 */
export const formatChartData = (apiData: number[][]) => {
  return apiData.map(([timestamp, price]) => ({
    date: new Date(timestamp).toISOString().split('T')[0],
    price: price
  }))
}