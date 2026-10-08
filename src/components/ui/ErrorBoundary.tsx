import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from './ErrorState'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Photobooth runtime error intercepted:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[50vh] p-4">
          <ErrorState
            code="ERR_RUNTIME_RECOVERABLE"
            message="A temporary kiosk display glitch occurred. Your session can be restarted cleanly below."
            onRetry={this.handleReset}
            onDismiss={() => {
              this.setState({ hasError: false, error: null })
              window.location.href = '/'
            }}
          />
        </div>
      )
    }

    return this.props.children
  }
}
