import { useRef, useState, useMemo, useCallback } from 'react'
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
  } catch { return null }
}

// Insert snippet into a real <input> using native setter so React's onChange fires
function nativeInsert(el, snippet) {
  if (!el) return
  const start  = el.selectionStart ?? el.value.length
  const end    = el.selectionEnd   ?? el.value.length
  const mark   = snippet.indexOf('§')
  const clean  = snippet.replace(/§/g, '')
  const newVal = el.value.slice(0, start) + clean + el.value.slice(end)
  const cursor = mark >= 0 ? start + mark : start + clean.length

  // Bypass React's synthetic onChange so the controlled input updates
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(el, newVal)
  el.dispatchEvent(new Event('input', { bubbles: true }))

  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(cursor, cursor)
  })
}

function nativeBackspace(el) {
  if (!el) return
  const start = el.selectionStart
  const end   = el.selectionEnd
  if (start === end && start === 0) return
  const newVal = start !== end
    ? el.value.slice(0, start) + el.value.slice(end)
    : el.value.slice(0, start - 1) + el.value.slice(start)
  const cursor = start !== end ? start : Math.max(0, start - 1)
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(el, newVal)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  requestAnimationFrame(() => { el.focus(); el.setSelectionRange(cursor, cursor) })
}

function nativeArrow(el, dir) {
  if (!el) return
  const pos = dir === 'left'
    ? Math.max(0, el.selectionStart - 1)
    : Math.min(el.value.length, el.selectionEnd + 1)
  requestAnimationFrame(() => { el.focus(); el.setSelectionRange(pos, pos) })
}

export default function CalcInput({
  label, value, onChange, placeholder, hint,
  type = 'text', min, max, step,
  noKeyboard = false,
}) {
  const inputRef = useRef(null)
  const [showKb, setShowKb] = useState(false)

  const useKb = type === 'text' && !noKeyboard
  const latex = useMemo(() => toLatex(value), [value])

  const onInsert     = useCallback(s  => nativeInsert(inputRef.current, s),   [])
  const onBackspace  = useCallback(()  => nativeBackspace(inputRef.current),   [])
  const onArrow      = useCallback(dir => nativeArrow(inputRef.current, dir),  [])

  // Plain number inputs — unchanged
  if (!useKb) {
    return (
      <div className={styles.group}>
        {label && <label className={styles.label}>{label}</label>}
        <input className={styles.inputPlain} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder} min={min} max={max} step={step} />
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    )
  }

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}

      {/* KaTeX preview — shown when expression is valid */}
      {latex && (
        <div className={styles.preview} onClick={() => inputRef.current?.focus()}>
          <BlockMath math={latex} />
        </div>
      )}

      {/* Real visible input — always present, handles cursor natively */}
      <input
        ref={inputRef}
        className={`${styles.textInput} ${showKb ? styles.textInputFocused : ''}`}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={latex ? '' : (placeholder || 'Enter expression…')}
        onFocus={() => setShowKb(true)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        inputMode="none"
      />

      {hint && <p className={styles.hint}>{hint}</p>}

      {showKb && (
        <div className={styles.keyboardAnchor}>
          <MathKeyboard
            onInsert={onInsert}
            onBackspace={onBackspace}
            onArrow={onArrow}
            onClose={() => { setShowKb(false); inputRef.current?.blur() }}
          />
        </div>
      )}
    </div>
  )
}
