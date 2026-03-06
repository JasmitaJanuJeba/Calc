import { useRef, useState, useMemo } from 'react'
import * as math from 'mathjs'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import styles from './CalcInput.module.css'
import MathKeyboard from './MathKeyboard'

function toLatex(expr) {
  if (!expr || !expr.trim()) return null
  try {
    const raw = math.parse(expr).toTex({ parenthesis: 'auto' })
    // Clean up mathjs's toTex quirks
    return raw
      .replace(/\{ /g, '{')
      .replace(/\mathrm\{ln\}/g, '\\ln')
      .replace(/\mathrm\{integrate\}/g, '\\int')
      .replace(/\mathrm\{derivative\}/g, "\\frac{d}{dx}")
      .replace(/\mathrm\{limit\}/g, '\\lim')
  } catch {
    return null
  }
}

export default function CalcInput({
  label, value, onChange, placeholder, hint,
  type = 'text', min, max, step,
  noKeyboard = false,
  accentColor = '#f97316',  // orange by default
}) {
  const inputRef = useRef(null)
  const [showKb, setShowKb] = useState(false)

  const useKb  = type === 'text' && !noKeyboard
  const latex  = useMemo(() => toLatex(value), [value])
  const showPreview = useKb && value && latex

  const openKb = () => {
    if (!useKb) return
    setShowKb(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}

      {/* ── Math preview card (shown when there's a valid expression) ── */}
      {showPreview && (
        <div
          className={styles.preview}
          style={{ borderLeftColor: accentColor }}
          onClick={openKb}
          title="Tap to edit"
        >
          <BlockMath math={latex} />
        </div>
      )}

      {/* ── Input row ── */}
      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          className={`${styles.input} ${useKb && showKb ? styles.inputActive : ''}`}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          onFocus={() => useKb && setShowKb(true)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          inputMode={useKb ? 'none' : undefined}
        />
        {useKb && (
          <button
            className={styles.kbToggle}
            style={{ borderColor: accentColor + '60', color: accentColor }}
            onMouseDown={e => { e.preventDefault(); setShowKb(v => !v) }}
            title="Math keyboard"
          >
            ∫
          </button>
        )}
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}

      {showKb && useKb && (
        <div className={styles.keyboardAnchor}>
          <MathKeyboard
            inputRef={inputRef}
            onClose={() => { setShowKb(false); inputRef.current?.blur() }}
          />
        </div>
      )}
    </div>
  )
}
