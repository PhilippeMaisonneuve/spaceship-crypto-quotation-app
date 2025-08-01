import { Card, Text } from '@shopify/polaris'
import { useMobile } from '../../hooks/useMobile'
import { formatCurrency } from '../../utils/formatters'
import type { CryptoStats } from '../../types/crypto'

interface StatsSectionProps {
  stats: CryptoStats
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const isMobile = useMobile()

  return (
    <Card>
      <div style={{ padding: isMobile ? '20px' : '24px' }}>
        <div 
          className={isMobile ? "crypto-stats-grid" : ""}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '20px',
            textAlign: 'center'
          }}
        >
          <div 
            className={isMobile ? "crypto-stats-item" : ""}
            style={!isMobile ? {} : { padding: '16px', backgroundColor: '#f6f6f7', borderRadius: '8px' }}
          >
            <Text as="h3" variant={isMobile ? "bodySm" : "headingMd"} fontWeight="bold">
              {isMobile ? "Market Cap" : "Total Market Cap"}
            </Text>
            <Text as="p" variant={isMobile ? "bodyLg" : "headingLg"} fontWeight="bold">
              {formatCurrency(stats.totalMarketCap)}
            </Text>
          </div>
          
          <div 
            className={isMobile ? "crypto-stats-item" : ""}
            style={!isMobile ? {} : { padding: '16px', backgroundColor: '#f6f6f7', borderRadius: '8px' }}
          >
            <Text as="h3" variant={isMobile ? "bodySm" : "headingMd"} fontWeight="bold">
              24h Volume
            </Text>
            <Text as="p" variant={isMobile ? "bodyLg" : "headingLg"} fontWeight="bold">
              {formatCurrency(stats.totalVolume)}
            </Text>
          </div>
          
          <div 
            className={isMobile ? "crypto-stats-item" : ""}
            style={!isMobile ? {} : { padding: '16px', backgroundColor: '#f6f6f7', borderRadius: '8px' }}
          >
            <Text as="h3" variant={isMobile ? "bodySm" : "headingMd"} fontWeight="bold">
              Gainers
            </Text>
            <Text as="p" variant={isMobile ? "bodyLg" : "headingLg"} fontWeight="bold">
              {stats.gainers}
            </Text>
          </div>
          
          <div 
            className={isMobile ? "crypto-stats-item" : ""}
            style={!isMobile ? {} : { padding: '16px', backgroundColor: '#f6f6f7', borderRadius: '8px' }}
          >
            <Text as="h3" variant={isMobile ? "bodySm" : "headingMd"} fontWeight="bold">
              Losers
            </Text>
            <Text as="p" variant={isMobile ? "bodyLg" : "headingLg"} fontWeight="bold">
              {stats.losers}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  )
}