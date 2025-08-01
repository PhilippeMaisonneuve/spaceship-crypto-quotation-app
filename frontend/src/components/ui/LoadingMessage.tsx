import { Banner, Text } from '@shopify/polaris'

interface LoadingMessageProps {
  title?: string
  message?: string
  progress?: string
}

/**
 * Informative loading message component
 */
export const LoadingMessage = ({ 
  title = "Loading Data", 
  message = "Fetching cryptocurrency data...",
  progress
}: LoadingMessageProps) => {
  return (
    <Banner tone="info">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          className="loading-spinner" 
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #e1e3e5',
            borderTop: '2px solid #5c6ac4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            flexShrink: 0
          }} 
        />
        <div>
          <Text as="p" variant="bodyMd" fontWeight="semibold">{title}</Text>
          <Text as="p" variant="bodySm">{message}</Text>
          {progress && (
            <Text as="p" variant="bodySm" tone="subdued">{progress}</Text>
          )}
        </div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Banner>
  )
}