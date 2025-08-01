import { Card, Text } from '@shopify/polaris'
import { useMobile } from '../../hooks/useMobile'

interface SkeletonLoaderProps {
  rows?: number
  showStats?: boolean
}

/**
 * Skeleton loading component for better UX during data loading
 */
export const SkeletonLoader = ({ rows = 10, showStats = true }: SkeletonLoaderProps) => {
  const isMobile = useMobile()

  const SkeletonBar = ({ width = '100%', height = '16px' }: { width?: string; height?: string }) => (
    <div
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite'
      }}
    />
  )

  const SkeletonStatsCard = () => (
    <div style={{ 
      padding: '16px', 
      backgroundColor: '#f6f6f7', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <SkeletonBar width="60%" height="14px" />
      <div style={{ marginTop: '8px' }}>
        <SkeletonBar width="80%" height="20px" />
      </div>
    </div>
  )

  const SkeletonCryptoCard = () => (
    <div style={{ marginBottom: '12px' }}>
      <Card>
        <div style={{ padding: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '12px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#f0f0f0' 
                }}
              />
              <div style={{ flex: 1 }}>
                <SkeletonBar width="60px" height="16px" />
                <div style={{ marginTop: '4px' }}>
                  <SkeletonBar width="120px" height="14px" />
                </div>
                <div style={{ marginTop: '4px' }}>
                  <SkeletonBar width="40px" height="12px" />
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <SkeletonBar width="80px" height="16px" />
              <div style={{ marginTop: '4px' }}>
                <SkeletonBar width="60px" height="20px" />
              </div>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid #e1e3e5'
          }}>
            <div>
              <SkeletonBar width="60px" height="12px" />
              <div style={{ marginTop: '4px' }}>
                <SkeletonBar width="80px" height="14px" />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <SkeletonBar width="60px" height="12px" />
              <div style={{ marginTop: '4px' }}>
                <SkeletonBar width="80px" height="14px" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const SkeletonTableRow = () => (
    <tr>
      <td style={{ padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#f0f0f0' 
            }}
          />
          <div>
            <SkeletonBar width="60px" height="14px" />
            <div style={{ marginTop: '4px' }}>
              <SkeletonBar width="100px" height="12px" />
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px' }}>
        <SkeletonBar width="80px" height="14px" />
      </td>
      <td style={{ padding: '12px' }}>
        <SkeletonBar width="60px" height="20px" />
      </td>
      <td style={{ padding: '12px' }}>
        <SkeletonBar width="100px" height="14px" />
      </td>
      <td style={{ padding: '12px' }}>
        <SkeletonBar width="100px" height="14px" />
      </td>
    </tr>
  )

  return (
    <>
      <style>
        {`
          @keyframes skeleton-pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      {/* Loading banner */}
      <Card>
        <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div className="loading-spinner" style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e1e3e5',
              borderTop: '2px solid #5c6ac4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <Text as="p" variant="bodyMd" fontWeight="medium">
              Loading cryptocurrency data from CoinGecko...
            </Text>
          </div>
        </div>
      </Card>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Stats skeleton */}
      {showStats && (
        <Card>
          <div style={{ padding: isMobile ? '20px' : '24px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '12px' : '20px'
            }}>
              <SkeletonStatsCard />
              <SkeletonStatsCard />
              <SkeletonStatsCard />
              <SkeletonStatsCard />
            </div>
          </div>
        </Card>
      )}

      {/* Controls skeleton */}
      <Card>
        <div style={{ padding: isMobile ? '20px' : '32px' }}>
          <div style={{ 
            display: isMobile ? 'block' : 'flex', 
            gap: '20px', 
            marginBottom: '16px' 
          }}>
            <div style={{ flex: 1, marginBottom: isMobile ? '16px' : '0' }}>
              <SkeletonBar width="100%" height="44px" />
            </div>
            <div style={{ minWidth: isMobile ? 'auto' : '250px' }}>
              <SkeletonBar width="100%" height="44px" />
            </div>
          </div>
        </div>
      </Card>

      {/* Data skeleton */}
      <Card>
        <div style={{ padding: isMobile ? '20px' : '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <SkeletonBar width="300px" height="20px" />
          </div>
          
          {isMobile ? (
            // Mobile cards skeleton
            <div style={{ margin: '0 -8px' }}>
              {Array.from({ length: rows }, (_, i) => (
                <SkeletonCryptoCard key={i} />
              ))}
            </div>
          ) : (
            // Desktop table skeleton
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e1e3e5' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>
                    <SkeletonBar width="120px" height="14px" />
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>
                    <SkeletonBar width="60px" height="14px" />
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>
                    <SkeletonBar width="80px" height="14px" />
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>
                    <SkeletonBar width="90px" height="14px" />
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>
                    <SkeletonBar width="100px" height="14px" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }, (_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </>
  )
}