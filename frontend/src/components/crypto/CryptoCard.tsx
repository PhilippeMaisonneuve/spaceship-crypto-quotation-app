import { Card, Text, Badge } from '@shopify/polaris'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import type { CryptoData } from '../../types/crypto'

interface CryptoCardProps {
  crypto: CryptoData
  onClick: () => void
}

/**
 * Mobile-optimized card component for displaying cryptocurrency data
 */
export const CryptoCard = ({ crypto, onClick }: CryptoCardProps) => {
  return (
    <div style={{ marginBottom: '12px' }}>
      <Card>
        <div 
          style={{ 
            padding: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onClick={onClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f6f6f7'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {/* Top row: Image, Name/Symbol, Price/Change */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '12px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <img 
                src={crypto.image} 
                alt={crypto.name} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/40x40/666666/FFFFFF?text=' + crypto.symbol.charAt(0)
                }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text as="p" variant="bodyLg" fontWeight="bold">{crypto.symbol}</Text>
                <div style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  <Text as="p" variant="bodySm" tone="subdued">{crypto.name}</Text>
                </div>
                <Text as="p" variant="bodySm" tone="subdued">#{crypto.market_cap_rank}</Text>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginLeft: '12px', flexShrink: 0 }}>
              <div style={{ whiteSpace: 'nowrap' }}>
                <Text as="p" variant="bodyLg" fontWeight="bold">{formatCurrency(crypto.current_price)}</Text>
              </div>
              <Badge 
                tone={crypto.price_change_percentage_24h !== null && crypto.price_change_percentage_24h >= 0 ? 'success' : 'critical'}
              >
                {formatPercentage(crypto.price_change_percentage_24h)}
              </Badge>
            </div>
          </div>
          
          {/* Bottom row: Market Cap and Volume */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid #e1e3e5'
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Text as="p" variant="bodySm" tone="subdued">Market Cap</Text>
              <div style={{ whiteSpace: 'nowrap' }}>
                <Text as="p" variant="bodySm" fontWeight="semibold">{formatCurrency(crypto.market_cap)}</Text>
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 0, flex: 1 }}>
              <Text as="p" variant="bodySm" tone="subdued">Volume 24h</Text>
              <div style={{ whiteSpace: 'nowrap' }}>
                <Text as="p" variant="bodySm" fontWeight="semibold">{formatCurrency(crypto.volume_24h)}</Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}