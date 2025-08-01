import { Banner } from '@shopify/polaris'

interface ErrorBannerProps {
  title: string
  message: string
  tone?: 'critical' | 'warning'
  onRetry?: () => void
}

export const ErrorBanner = ({ 
  title, 
  message, 
  tone = 'critical',
  onRetry 
}: ErrorBannerProps) => {
  return (
    <Banner
      title={title}
      tone={tone}
      action={onRetry ? { content: 'Retry', onAction: onRetry } : undefined}
    >
      <p>{message}</p>
    </Banner>
  )
}