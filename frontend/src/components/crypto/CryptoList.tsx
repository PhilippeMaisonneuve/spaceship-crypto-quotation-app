import { Card, Text, Button, Banner, DataTable, Badge, Select } from '@shopify/polaris'
import { useMobile } from '../../hooks/useMobile'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import { CryptoCard } from './CryptoCard'
import { LoadingMessage } from '../ui/LoadingMessage'
import type { CryptoData } from '../../types/crypto'

interface CryptoListProps {
  data: CryptoData[]
  totalCount: number
  currentPage: number
  perPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  onCryptoClick: (id: string) => void
  onRefresh: () => void
  showExternalResults: boolean
  searchTerm: string
  isExternalSearchLoading: boolean
  onExternalSearch: (query: string) => void
  onBackToCached: () => void
  loading: boolean
}

export const CryptoList = ({
  data,
  totalCount,
  currentPage,
  perPage,
  totalPages,
  onPageChange,
  onPerPageChange,
  onCryptoClick,
  onRefresh,
  showExternalResults,
  searchTerm,
  isExternalSearchLoading,
  onExternalSearch,
  onBackToCached,
  loading
}: CryptoListProps) => {
  const isMobile = useMobile()

  // Create table rows for desktop view
  const tableRows = data.map((crypto) => [
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        cursor: 'pointer',
        padding: isMobile ? '8px' : '12px',
        borderRadius: '4px',
        transition: 'background-color 0.2s'
      }}
      onClick={() => onCryptoClick(crypto.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f6f6f7'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <img 
        src={crypto.image} 
        alt={crypto.name} 
        style={{ width: isMobile ? '24px' : '32px', height: isMobile ? '24px' : '32px', borderRadius: '50%' }}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/24x24/666666/FFFFFF?text=' + crypto.symbol.charAt(0)
        }}
      />
      <div>
        <Text as="p" variant="bodyMd" fontWeight="bold">{crypto.symbol}</Text>
        <Text as="p" variant="bodySm">{crypto.name}</Text>
        <Text as="p" variant="bodySm">#{crypto.market_cap_rank}</Text>
      </div>
    </div>,
    <Text as="p" variant="bodyMd" fontWeight="bold">{formatCurrency(crypto.current_price)}</Text>,
    <Badge 
      tone={crypto.price_change_percentage_24h !== null && crypto.price_change_percentage_24h >= 0 ? 'success' : 'critical'}
    >
      {formatPercentage(crypto.price_change_percentage_24h)}
    </Badge>,
    <Text as="p" variant="bodyMd" fontWeight="bold">{formatCurrency(crypto.market_cap)}</Text>,
    <Text as="p" variant="bodyMd" fontWeight="bold">{formatCurrency(crypto.volume_24h)}</Text>
  ])

  return (
    <Card>
      {/* Loading overlay for refreshes */}
      {loading && data.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <LoadingMessage 
            title="Refreshing Data" 
            message="Updating cryptocurrency prices..."
          />
        </div>
      )}
      
      {/* External search loading */}
      {isExternalSearchLoading && (
        <div style={{ marginBottom: '16px' }}>
          <LoadingMessage 
            title="Searching CoinGecko" 
            message={`Searching for "${searchTerm}" in the complete database...`}
          />
        </div>
      )}
      
      {data.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          {showExternalResults ? (
            <div>
              <Text as="h2" variant="headingMd" fontWeight="bold" alignment="center">
                No results found
              </Text>
              <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                <Text as="p" variant="bodyMd" alignment="center">
                  No cryptocurrencies found matching "{searchTerm}" in the external search.
                </Text>
              </div>
              <Button onClick={onBackToCached}>Back to main list</Button>
            </div>
          ) : (
            <div>
              <Text as="h2" variant="headingMd" fontWeight="bold" alignment="center">
                No cryptocurrencies found
              </Text>
              <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                <Text as="p" variant="bodyMd" alignment="center">
                  No matches found in our database of 1000+ cryptocurrencies.
                </Text>
                {searchTerm && (
                  <div style={{ marginTop: '12px' }}>
                    <Text as="p" variant="bodySm" alignment="center">
                      Want to search the entire CoinGecko database for "{searchTerm}"?
                    </Text>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button onClick={() => window.location.reload()}>Clear search</Button>
                {searchTerm && (
                  <Button 
                    onClick={() => onExternalSearch(searchTerm)} 
                    variant="primary" 
                    loading={isExternalSearchLoading} 
                    disabled={isExternalSearchLoading}
                  >
                    Search CoinGecko API
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: isMobile ? '20px' : '32px' }}>
          {showExternalResults && (
            <div style={{ marginBottom: '16px' }}>
              <Banner>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Showing results from CoinGecko API search for "{searchTerm}"</span>
                  <Button size="slim" onClick={onBackToCached}>
                    Back to main list
                  </Button>
                </div>
              </Banner>
            </div>
          )}
          
          {/* Mobile-responsive pagination controls */}
          <div style={{ 
            marginBottom: isMobile ? '16px' : '24px', 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'stretch' : 'center',
            gap: '12px'
          }}>
            <Text as="h3" variant="headingMd" fontWeight="bold">
              Showing {data.length} of {totalCount} cryptocurrencies
              {!isMobile && totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </Text>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-end'
            }}>
              {/* Items per page control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!isMobile && <Text as="p" variant="bodySm">Show:</Text>}
                <Select
                  label={isMobile ? "Show per page" : ""}
                  labelInline={!isMobile}
                  options={[
                    { label: '50', value: '50' },
                    { label: '100', value: '100' },
                    { label: '200', value: '200' }
                  ]}
                  value={perPage.toString()}
                  onChange={(value) => onPerPageChange(parseInt(value))}
                />
                {!isMobile && <Text as="p" variant="bodySm">per page</Text>}
              </div>
              {totalPages > 1 && (
                <>
                  <Button
                    size="slim"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                  >
                    {isMobile ? 'Prev' : 'Previous'}
                  </Button>
                  <Text as="p" variant="bodySm">
                    {currentPage} of {totalPages}
                  </Text>
                  <Button
                    size="slim"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </>
              )}
              <Button
                size="slim"
                onClick={onRefresh}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Responsive data display */}
          {isMobile ? (
            // Mobile card layout
            <div style={{ margin: '0 -8px' }}>
              {data.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} onClick={() => onCryptoClick(crypto.id)} />
              ))}
            </div>
          ) : (
            // Desktop table layout
            <DataTable
              columnContentTypes={['text', 'numeric', 'text', 'numeric', 'numeric']}
              headings={['Cryptocurrency', 'Price', '24h Change', 'Market Cap', 'Volume (24h)']}
              rows={tableRows}
              hoverable
            />
          )}
        </div>
      )}
    </Card>
  )
}