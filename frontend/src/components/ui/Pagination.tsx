import { Button, Text, Select } from '@shopify/polaris'
import { useMobile } from '../../hooks/useMobile'

interface PaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  totalCount: number
  dataCount: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  onRefresh?: () => void
  loading?: boolean
}

/**
 * Reusable pagination component with mobile responsiveness
 */
export const Pagination = ({
  currentPage,
  totalPages,
  perPage,
  totalCount,
  dataCount,
  onPageChange,
  onPerPageChange,
  onRefresh,
  loading = false
}: PaginationProps) => {
  const isMobile = useMobile()

  return (
    <div style={{ 
      marginBottom: isMobile ? '16px' : '24px', 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between', 
      alignItems: isMobile ? 'stretch' : 'center',
      gap: '12px'
    }}>
      <Text as="h3" variant="headingMd" fontWeight="bold">
        Showing {dataCount} of {totalCount} cryptocurrencies
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
        
        {/* Page navigation */}
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
        
        {/* Refresh button */}
        {onRefresh && (
          <Button
            size="slim"
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        )}
      </div>
    </div>
  )
}