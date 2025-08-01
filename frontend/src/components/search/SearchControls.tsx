import { Card, Text, TextField, Select, Button } from '@shopify/polaris'
import { useMobile } from '../../hooks/useMobile'
import type { SortOption, SortOrder } from '../../types/crypto'

interface SearchControlsProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortBy: SortOption
  onSortByChange: (value: SortOption) => void
  sortOrder: SortOrder
  onSortOrderChange: (value: SortOrder) => void
}

export const SearchControls = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange
}: SearchControlsProps) => {
  const isMobile = useMobile()

  const sortOptions = [
    { label: 'Market Cap', value: 'market_cap' },
    { label: 'Price', value: 'current_price' },
    { label: '24h Change', value: 'price_change_percentage_24h' },
    { label: 'Volume', value: 'volume_24h' },
    { label: 'Name', value: 'name' }
  ]

  return (
    <Card>
      <div style={{ padding: isMobile ? '20px' : '32px' }}>
        {/* Search and Sort - Stack on mobile */}
        <div style={{ 
          display: isMobile ? 'block' : 'flex', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center', 
          gap: '20px', 
          marginBottom: '16px' 
        }}>
          <div style={{ 
            flex: 1, 
            maxWidth: isMobile ? '100%' : '400px',
            marginBottom: isMobile ? '16px' : '0'
          }}>
            <TextField
              label="Search cryptocurrencies"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search by name or symbol..."
              clearButton
              onClearButtonClick={() => onSearchChange('')}
              autoComplete="off"
            />
          </div>
          
          <div style={{ 
            display: isMobile ? 'flex' : 'block',
            gap: isMobile ? '12px' : '0',
            minWidth: isMobile ? 'auto' : '250px'
          }}>
            <div style={{ flex: 1 }}>
              <Select
                label="Sort by"
                options={sortOptions}
                value={sortBy}
                onChange={(value) => onSortByChange(value as SortOption)}
              />
            </div>
            {!isMobile && (
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                <Button
                  pressed={sortOrder === 'desc'}
                  onClick={() => onSortOrderChange('desc')}
                  size="slim"
                >
                  Desc
                </Button>
                <Button
                  pressed={sortOrder === 'asc'}
                  onClick={() => onSortOrderChange('asc')}
                  size="slim"
                >
                  Asc
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Sort order buttons for mobile */}
        {isMobile && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <Text as="p" variant="bodySm" tone="subdued">Sort Order</Text>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                pressed={sortOrder === 'desc'}
                onClick={() => onSortOrderChange('desc')}
                size="slim"
              >
                Descending
              </Button>
              <Button
                pressed={sortOrder === 'asc'}
                onClick={() => onSortOrderChange('asc')}
                size="slim"
              >
                Ascending
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}