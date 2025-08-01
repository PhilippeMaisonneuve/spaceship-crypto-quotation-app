import { useNavigate } from 'react-router-dom'
import { Page, Layout, Banner, Card, Text } from '@shopify/polaris'
import { useCryptoData } from '../../hooks/useCryptoData'
import { usePagination } from '../../hooks/usePagination'
import { StatsSection } from '../crypto/StatsSection'
import { SearchControls } from '../search/SearchControls'
import { CryptoList } from '../crypto/CryptoList'

import { ErrorBanner } from '../ui/ErrorBanner'
import { SkeletonLoader } from '../ui/SkeletonLoader'

/**
 * Main homepage component displaying cryptocurrency market data
 */
export const HomePage = () => {
  const navigate = useNavigate()
  
  const {
    filteredAndSortedData,
    stats,
    loading,
    error,
    warning,
    lastUpdated,
    searchTerm,
    setSearchTerm,
    showExternalResults,
    isExternalSearchLoading,
    searchExternalAPI,
    backToCachedResults,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    fetchAllCryptoData
  } = useCryptoData()

  const {
    currentPage,
    perPage,
    totalPages,
    currentPageData,
    handlePageChange,
    handlePerPageChange
  } = usePagination(filteredAndSortedData, 100)

  const handleCryptoClick = (id: string) => {
    navigate(`/crypto/${id}`)
  }

  if (loading) {
    return (
      <Page title="🚀 Spaceship Crypto Quotation App" subtitle="Real-time cryptocurrency prices and market data">
        <Layout>
          <Layout.Section>
            <SkeletonLoader rows={10} showStats={true} />
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  return (
    <Page title="🚀 Spaceship Crypto Quotation App" subtitle="Real-time cryptocurrency prices and market data">
      <Layout>
        {/* Last Updated Status */}
        {lastUpdated && (
          <Layout.Section>
            <Banner title="Data Status" tone="success">
              <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </Banner>
          </Layout.Section>
        )}

        {/* Market Statistics */}
        {stats && (
          <Layout.Section>
            <StatsSection stats={stats} />
          </Layout.Section>
        )}

        {/* Search Controls */}
        <Layout.Section>
          <SearchControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </Layout.Section>

        {/* Error Handling */}
        {error && (
          <Layout.Section>
            <ErrorBanner 
              title="Connection Error" 
              message={error} 
              onRetry={() => fetchAllCryptoData()}
            />
          </Layout.Section>
        )}

        {/* Warning for Stale Data */}
        {warning && (
          <Layout.Section>
            <ErrorBanner 
              title="Using Cached Data" 
              message={warning} 
              tone="warning"
              onRetry={() => fetchAllCryptoData(true)}
            />
          </Layout.Section>
        )}

        {/* Cryptocurrency List */}
        <Layout.Section>
          <CryptoList
            data={currentPageData}
            totalCount={filteredAndSortedData.length}
            currentPage={currentPage}
            perPage={perPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            onCryptoClick={handleCryptoClick}
            onRefresh={() => fetchAllCryptoData(true)}
            showExternalResults={showExternalResults}
            searchTerm={searchTerm}
            isExternalSearchLoading={isExternalSearchLoading}
            onExternalSearch={searchExternalAPI}
            onBackToCached={backToCachedResults}
            loading={loading}
          />
        </Layout.Section>

        {/* CoinGecko Attribution */}
        <Layout.Section>
          <Card>
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              borderTop: '1px solid #e1e3e5',
              backgroundColor: '#f6f6f7'
            }}>
              <Text as="p" variant="bodySm" tone="subdued">
                Market data powered by
              </Text>
              <a 
                href="https://www.coingecko.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#5c6ac4', 
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                <img 
                  src="https://static.coingecko.com/s/coingecko-logo-5683263fd3ea8a4f152dd5f7299acfc5f84ee73955428acff22913b8e59e6c54.svg" 
                  alt="CoinGecko" 
                  style={{ height: '32px' }}
                />
              </a>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}