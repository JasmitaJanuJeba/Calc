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
    return raw
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
  const inputRef = useRef(null)
  const [showKb, setShowKb] = useState(false)

  const useKb = type === 'text' && !noKeyboard
  const latex  = useMemo(() => toLatex(value), [value])

  const openKb = () => {
    setShowKb(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  // Number/range inputs — keep plain
  if (!useKb) {
    return (
      <div className={styles.group}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          className={styles.inputPlain}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min} max={max} step={step}
        />
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    )
  }

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}

      {/* Hidden input for value + cursor tracking */}
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
        inputMode="none"
        readOnly={showKb}
      />

      {/* ── Rendered math display card (always visible) ── */}
      <div
        className={`${styles.preview} ${showKb ? styles.previewFocused : ''}`}
        style={{ borderLeftColor: accentColor, '--accent': accentColor }}
        onClick={openKb}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && openKb()}
        title="Tap to edit"
      >
        {latex ? (
          <BlockMath math={latex} />
        ) : (
          <span className={styles.placeholder}>{placeholder || 'Enter expression…'}</span>
        )}
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}

      {showKb && (
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
