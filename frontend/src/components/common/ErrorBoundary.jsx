import { Component } from 'react'
import Button from './Button'
import GlassCard from './GlassCard'

/**
 * Catches render errors in the tree and shows a recovery UI.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
    this.props.onError?.(error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
    this.props.onReset?.()
  }

  render() {
    const { error } = this.state
    const { children, fallback, title, message } = this.props

    if (error) {
      if (typeof fallback === 'function') {
        return fallback({ error, reset: this.handleReset })
      }
      if (fallback != null) return fallback

      return (
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <GlassCard
            strong
            role="alert"
            className="border border-coral/20 px-6 py-8 text-center"
          >
            <h2 className="font-display text-2xl font-semibold text-ink">
              {title || 'Something broke'}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {message ||
                'An unexpected error stopped this view. You can try reloading the section.'}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button type="button" onClick={this.handleReset}>
                Try again
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </div>
          </GlassCard>
        </div>
      )
    }

    return children
  }
}
