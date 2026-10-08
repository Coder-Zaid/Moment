import { PhotoboothProvider } from './context/PhotoboothContext'
import { AppShell } from './components/ui/AppShell'
import { ScreenRenderer } from './screens/ScreenRenderer'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

export function App() {
  return (
    <PhotoboothProvider>
      <AppShell>
        <ErrorBoundary>
          <ScreenRenderer />
        </ErrorBoundary>
      </AppShell>
    </PhotoboothProvider>
  )
}

export default App
