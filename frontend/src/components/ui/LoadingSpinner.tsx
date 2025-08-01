import { Spinner, Text } from '@shopify/polaris'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'large'
}

export const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'large' 
}: LoadingSpinnerProps) => {
  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <Spinner size={size} />
      <div style={{ marginTop: '16px' }}>
        <Text as="p" variant="bodyMd">{message}</Text>
      </div>
    </div>
  )
}