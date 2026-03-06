import { useState, useMemo } from 'react'
import * as math from 'mathjs'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import styles from './CalcInput.module.css'
import MathKeyboard from './MathKeyboard'

function toLatex(expr) {
  if (!expr || !expr.trim()) return null
  try {
    return math.parse(expr).toTex({ parenthesis: 'auto' })
      .replace(/\{ /g, '{')
      .replace(/\\mathrm\{ln\}/g, '\\ln')
      .replace(/\\mathrm\{integrate\}/g, '\\int')
      .replace(/\\mathrm\{derivative\}/g, '\\frac{d}{dx}')
      .replace(/\\mathrm\{limit\}/g, '\\lim')
  } catch {
    return null
  }
}

export default function CalcInput({
  label, value, onChange, placeholder, hint,
  type = 'text', min, max, step,
  noKeyboard = false,
  accentColor = '#f97316',
}) {
  const [showKb, setShowKb] = useState(false)
  const [cursor, setCursor] = useState(0)

  const useKb = type === 'text' && !noKeyboard
  const latex = useMemo(() => toLatex(value), [value])

  // ── Insertion logic (pure React state, no DOM hacks) ──
  function insert(snippet) {
    const mark  = snippet.indexOf('§')
    const clean = snippet.replace(/§/g, '')
    const pos   = Math.min(cursor, value.length)
    const next  = value.slice(0, pos) + clean + value.slice(pos)
    const nextC = mark >= 0 ? pos + mark : pos + clean.length
    onChange(next)
    setCursor(nextC)
  }

  function backspace() {
    const pos = Math.min(cursor, value.length)
    if (pos === 0) return
    onChange(value.slice(0, pos - 1) + value.slice(pos))
    setCursor(pos - 1)
  }

  function moveCursor(dir) {
    setCursor(c => dir === 'left'
      ? Math.max(0, c - 1)
      : Math.min(value.length, c + 1)
    )
  }

  // Plain number inputs
  if (!useKb) {
    return (
      <div className={styles.group}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          className={styles.inputPlain}
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min} max={max} step={step}
        />
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    )
  }

  // Display: rendered LaTeX if valid, else raw string with cursor marker
  const displayContent = () => {
    if (latex) return <BlockMath math={latex} />
    if (!value) return <span className={styles.placeholder}>{placeholder || 'Tap to enter expression…'}</span>
    // Show raw with cursor bar so user can see what they typed
    const before = value.slice(0, Math.min(cursor, value.length))
    const after  = value.slice(Math.min(cursor, value.length))
    return (
      <span className={styles.rawExpr}>
        {before}<span className={styles.cursor}>|</span>{after}
      </span>
    )
  }

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}

      <div
        className={`${styles.preview} ${showKb ? styles.previewFocused : ''}`}
        onClick={() => setShowKb(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setShowKb(true)}
      >
        {displayContent()}
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}

      {showKb && (
        <div className={styles.keyboardAnchor}>
          <MathKeyboard
            onInsert={insert}
            onBackspace={backspace}
            onArrow={moveCursor}
            onClose={() => setShowKb(false)}
          />
        </div>
      )}
    </div>
  )
}
