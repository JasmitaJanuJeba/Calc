import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import styles from './GraphPanel.module.css'

const PLOTLY_CONFIG = {
  displayModeBar: true,
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  responsive: true,
}

const DARK_LAYOUT = {
  paper_bgcolor: 'rgba(18,18,42,0)',
  plot_bgcolor: 'rgba(18,18,42,0)',
  font: { color: '#a0a0c0', family: 'Inter, sans-serif', size: 12 },
  xaxis: {
    gridcolor: 'rgba(255,255,255,0.06)',
    zerolinecolor: 'rgba(255,255,255,0.2)',
    tickcolor: 'rgba(255,255,255,0.2)',
  },
  yaxis: {
    gridcolor: 'rgba(255,255,255,0.06)',
    zerolinecolor: 'rgba(255,255,255,0.2)',
    tickcolor: 'rgba(255,255,255,0.2)',
  },
  margin: { l: 50, r: 20, t: 30, b: 40 },
}

export default function GraphPanel({ title, data, layout = {}, height = 360, footer }) {
  const mergedLayout = useMemo(() => ({
    ...DARK_LAYOUT,
    ...layout,
    xaxis: { ...DARK_LAYOUT.xaxis, ...(layout.xaxis || {}) },
    yaxis: { ...DARK_LAYOUT.yaxis, ...(layout.yaxis || {}) },
    legend: {
      bgcolor: 'rgba(18,18,42,0.8)',
      bordercolor: 'rgba(255,255,255,0.1)',
      borderwidth: 1,
      font: { color: '#a0a0c0' },
      ...(layout.legend || {}),
    },
  }), [layout])

  return (
    <div className={styles.panel}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.plotWrapper}>
        <Plot
          data={data}
          layout={{ ...mergedLayout, height }}
          config={PLOTLY_CONFIG}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>
      {footer && <p className={styles.footer}>{footer}</p>}
    </div>
  )
}
