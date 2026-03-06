import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0a0a1a', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 24,
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            maxWidth: 600, background: '#12122a', border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 16, padding: 32, textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: '#ef4444', marginBottom: 12, fontSize: '1.4rem' }}>Something went wrong</h2>
            <p style={{ color: 'rgba(240,240,255,0.6)', marginBottom: 16 }}>
              {this.props.message || 'A component encountered an error. Try refreshing the page.'}
            </p>
            <details style={{ textAlign: 'left', marginBottom: 20 }}>
              <summary style={{ color: 'rgba(240,240,255,0.4)', cursor: 'pointer', fontSize: '0.85rem' }}>
                Error details
              </summary>
              <pre style={{
                marginTop: 8, padding: 12, background: 'rgba(0,0,0,0.3)',
                borderRadius: 8, color: '#ef4444', fontSize: '0.75rem',
                overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              style={{
                background: '#7c3aed', color: '#fff', border: 'none',
                borderRadius: 10, padding: '10px 24px', fontSize: '0.95rem',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
