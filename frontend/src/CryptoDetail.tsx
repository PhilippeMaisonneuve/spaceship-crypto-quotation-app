import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Page,
  Layout,
  Card,
  Text,
  Badge,
  Spinner,
  Banner,
  Button,
  DataTable
} from '@shopify/polaris'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface CryptoDetail {
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

interface ChartData {
  date: string
  price: number
}

function CryptoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cryptoDetail, setCryptoDetail] = useState<CryptoDetail | null>(null)
  const [allChartData, setAllChartData] = useState<ChartData[]>([])
  const [displayChartData, setDisplayChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('365')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Mobile detection hook
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (id) {
      fetchCryptoDetail()
      fetchAllChartData()
    }
  }, [id])

  useEffect(() => {
    // Filter chart data based on time range without making API calls
    if (allChartData.length > 0) {
      const days = parseInt(timeRange)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      
      const filteredData = allChartData.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= cutoffDate
      })
      
      setDisplayChartData(filteredData)
    }
  }, [timeRange, allChartData])

  const fetchCryptoDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cryptos/${id}/details`)
      const result = await response.json()
      
      if (result.success) {
        setCryptoDetail(result.data)
      } else {
        setError('Failed to fetch crypto details')
      }
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllChartData = async () => {
    try {
      // Fetch 1 year of data (maximum range) once
      const response = await fetch(`/api/cryptos/${id}/history?days=365`)
      const result = await response.json()
      
      if (result.success) {
        setAllChartData(result.data)
        setDisplayChartData(result.data) // Initially show all data
      }
    } catch (err) {
      console.error('Failed to fetch chart data:', err)
    }
  }

  const formatCurrency = (value: number) => {
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
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A'
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  if (loading) {
    return (
      <Page title="Loading...">
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <Spinner size="large" />
                <div style={{ marginTop: '16px' }}>
                  <Text as="p" variant="bodyMd">Loading crypto details...</Text>
                </div>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  if (error || !cryptoDetail) {
    return (
      <Page title="Error">
        <Layout>
          <Layout.Section>
            <Banner
              title="Error"
              tone="critical"
              action={{ content: 'Go Back', onAction: () => window.history.back() }}
            >
              <p>{error || 'Failed to load crypto details'}</p>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  const statsData = [
    ['Market Cap Rank', `#${cryptoDetail.market_cap_rank}`],
    ['Market Cap', formatCurrency(cryptoDetail.market_cap)],
    ['24h Volume', formatCurrency(cryptoDetail.volume_24h)],
    ['Circulating Supply', cryptoDetail.circulating_supply ? formatNumber(cryptoDetail.circulating_supply) : 'N/A'],
    ['Total Supply', cryptoDetail.total_supply ? formatNumber(cryptoDetail.total_supply) : 'N/A'],
    ['Max Supply', cryptoDetail.max_supply ? formatNumber(cryptoDetail.max_supply) : 'N/A'],
    ['All Time High', formatCurrency(cryptoDetail.ath)],
    ['All Time High Date', cryptoDetail.ath_date ? formatDate(cryptoDetail.ath_date) : 'N/A'],
    ['All Time Low', formatCurrency(cryptoDetail.atl)],
    ['All Time Low Date', cryptoDetail.atl_date ? formatDate(cryptoDetail.atl_date) : 'N/A']
  ]

  return (
    <Page
      title={cryptoDetail.name}
      backAction={{ content: 'Back to Market', onAction: () => navigate('/') }}
    >
      <Layout>
        {/* Header with basic info */}
        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginBottom: '16px',
                flexDirection: isMobile ? 'column' : 'row',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <img 
                  src={cryptoDetail.image} 
                  alt={cryptoDetail.name} 
                  style={{ width: isMobile ? '64px' : '48px', height: isMobile ? '64px' : '48px', borderRadius: '50%' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/48x48/666666/FFFFFF?text=' + cryptoDetail.symbol.charAt(0)
                  }}
                />
                <div>
                  <Text as="h1" variant={isMobile ? "headingMd" : "headingLg"} fontWeight="bold">
                    {cryptoDetail.name} ({cryptoDetail.symbol})
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Rank #{cryptoDetail.market_cap_rank}
                  </Text>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginBottom: '16px',
                flexDirection: isMobile ? 'column' : 'row',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <Text as="h2" variant={isMobile ? "headingLg" : "headingXl"} fontWeight="bold">
                  {formatCurrency(cryptoDetail.current_price)}
                </Text>
                <Badge 
                  tone={cryptoDetail.price_change_percentage_24h !== null && cryptoDetail.price_change_percentage_24h >= 0 ? 'success' : 'critical'}
                >
                  {`${formatPercentage(cryptoDetail.price_change_percentage_24h)} (24h)`}
                </Badge>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '16px',
                justifyContent: isMobile ? 'center' : 'flex-start',
                flexWrap: 'wrap'
              }}>
                <Text as="p" variant="bodyMd">
                  7d: <span style={{ color: cryptoDetail.price_change_percentage_7d !== null && cryptoDetail.price_change_percentage_7d >= 0 ? 'green' : 'red' }}>
                    {formatPercentage(cryptoDetail.price_change_percentage_7d)}
                  </span>
                </Text>
                <Text as="p" variant="bodyMd">
                  30d: <span style={{ color: cryptoDetail.price_change_percentage_30d !== null && cryptoDetail.price_change_percentage_30d >= 0 ? 'green' : 'red' }}>
                    {formatPercentage(cryptoDetail.price_change_percentage_30d)}
                  </span>
                </Text>
              </div>
            </div>
          </Card>
        </Layout.Section>

        {/* Price Chart */}
        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '12px' : '0'
              }}>
                <Text as="h3" variant="headingMd" fontWeight="bold">
                  Price Chart ({timeRange} days)
                </Text>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['7', '30', '90', '365'].map((days) => (
                    <Button
                      key={days}
                      size="slim"
                      pressed={timeRange === days}
                      onClick={() => setTimeRange(days)}
                    >
                      {days}d
                    </Button>
                  ))}
                </div>
              </div>
              
              <div style={{ height: isMobile ? '300px' : '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={(value) => isMobile ? `$${(value/1000).toFixed(0)}K` : `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </Layout.Section>

        {/* Market Statistics */}
        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Text as="h3" variant="headingMd" fontWeight="bold">
                  Market Statistics
                </Text>
              </div>
{isMobile ? (
                // Mobile card layout for stats
                <div style={{ display: 'grid', gap: '12px' }}>
                  {statsData.map(([metric, value], index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: '#f6f6f7',
                        borderRadius: '8px'
                      }}
                    >
                      <Text as="p" variant="bodySm" tone="subdued">{metric}</Text>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">{value}</Text>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop table layout
                <DataTable
                  columnContentTypes={['text', 'text']}
                  headings={['Metric', 'Value']}
                  rows={statsData}
                />
              )}
            </div>
          </Card>
        </Layout.Section>

        {/* Description */}
        {cryptoDetail.description && (
          <Layout.Section>
            <Card>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <Text as="h3" variant="headingMd" fontWeight="bold">
                    About {cryptoDetail.name}
                  </Text>
                </div>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: cryptoDetail.description.substring(0, 500) + '...' 
                  }}
                  style={{ lineHeight: '1.6' }}
                />
              </div>
            </Card>
          </Layout.Section>
        )}

        {/* Links */}
        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Text as="h3" variant="headingMd" fontWeight="bold">
                  Useful Links
                </Text>
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                gap: isMobile ? '12px' : '8px',
                flexWrap: 'wrap'
              }}>
                {cryptoDetail.website && (
                  <a 
                    href={cryptoDetail.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#5c6ac4', 
                      textDecoration: 'none',
                      padding: isMobile ? '12px' : '8px',
                      backgroundColor: isMobile ? '#f6f6f7' : 'transparent',
                      borderRadius: isMobile ? '8px' : '0',
                      display: 'block'
                    }}
                  >
                    🌐 Official Website
                  </a>
                )}
                {cryptoDetail.blockchain_site && (
                  <a 
                    href={cryptoDetail.blockchain_site} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#5c6ac4', 
                      textDecoration: 'none',
                      padding: isMobile ? '12px' : '8px',
                      backgroundColor: isMobile ? '#f6f6f7' : 'transparent',
                      borderRadius: isMobile ? '8px' : '0',
                      display: 'block'
                    }}
                  >
                    🔗 Blockchain Explorer
                  </a>
                )}
                {cryptoDetail.repos_url && (
                  <a 
                    href={cryptoDetail.repos_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#5c6ac4', 
                      textDecoration: 'none',
                      padding: isMobile ? '12px' : '8px',
                      backgroundColor: isMobile ? '#f6f6f7' : 'transparent',
                      borderRadius: isMobile ? '8px' : '0',
                      display: 'block'
                    }}
                  >
                    📁 GitHub Repository
                  </a>
                )}
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default CryptoDetail 