import { useRef, useState, useMemo, useCallback } from 'react'
import * as math from 'mathjs'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import styles from './CalcInput.module.css'
import MathKeyboard from './MathKeyboard'

function toLatex(expr) {
  if (expr == null) return null
  const s = typeof expr === 'string' ? expr : String(expr)
  if (!s.trim()) return null
  try {
    return math.parse(s).toTex({ parenthesis: 'auto' })
      .replace(/\{ /g, '{')
      .replace(/\\mathrm\{ln\}/g, '\\ln')
      .replace(/\\mathrm\{integrate\}/g, '\\int')
      .replace(/\\mathrm\{derivative\}/g, '\\frac{d}{dx}')
      .replace(/\\mathrm\{limit\}/g, '\\lim')
  } catch { return null }
}

function nativeInsert(el, snippet) {
  if (!el) return
  const start  = el.selectionStart ?? el.value.length
  const end    = el.selectionEnd   ?? el.value.length
  const mark   = snippet.indexOf('§')
  const clean  = snippet.replace(/§/g, '')
  const newVal = el.value.slice(0, start) + clean + el.value.slice(end)
  const cur    = mark >= 0 ? start + mark : start + clean.length

  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(el, newVal)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(cur, cur)
    // Fire 'select' so React's onSelect handler updates curPos for the raw cursor display
    el.dispatchEvent(new Event('select', { bubbles: true }))
  })
}

function nativeBackspace(el) {
  if (!el) return
  const start = el.selectionStart, end = el.selectionEnd
  if (start === end && start === 0) return
  const newVal = start !== end
    ? el.value.slice(0, start) + el.value.slice(end)
    : el.value.slice(0, start - 1) + el.value.slice(start)
  const cur = start !== end ? start : Math.max(0, start - 1)
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(el, newVal)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(cur, cur)
    el.dispatchEvent(new Event('select', { bubbles: true }))
  })
}

function nativeArrow(el, dir) {
  if (!el) return
  const pos = dir === 'left'
    ? Math.max(0, el.selectionStart - 1)
    : Math.min(el.value.length, el.selectionEnd + 1)
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(pos, pos)
    el.dispatchEvent(new Event('select', { bubbles: true }))
  })
}

export default function CalcInput({
  label, value, onChange, placeholder, hint,
  type = 'text', min, max, step,
  noKeyboard = false,
}) {
  const inputRef  = useRef(null)
  const [showKb, setShowKb]   = useState(false)
  const [curPos, setCurPos]   = useState(0)

  const useKb = type === 'text' && !noKeyboard
  const latex = useMemo(() => toLatex(value), [value])

  const onInsert    = useCallback(s   => nativeInsert(inputRef.current, s),   [])
  const onBackspace = useCallback(()  => nativeBackspace(inputRef.current),   [])
  const onArrow     = useCallback(dir => nativeArrow(inputRef.current, dir),  [])

  const syncCursor = () => {
    const el = inputRef.current
    if (el) setCurPos(el.selectionStart ?? el.value.length)
  }

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

  // What to show in the KaTeX card
  const CardContent = () => {
    if (!value) {
      return <span className={styles.placeholder}>{placeholder || 'Tap to enter expression…'}</span>
    }
    if (latex) {
      // Valid expression — show KaTeX + blinking cursor at end
      return (
        <span className={styles.katexWrap}>
          <BlockMath math={latex} />
          {showKb && <span className={styles.mathCursor} />}
        </span>
      )
    }
    // Partially typed / invalid — show raw text with cursor
    const pos    = Math.min(curPos, value.length)
    const before = value.slice(0, pos)
    const after  = value.slice(pos)
    return (
      <span className={styles.rawExpr}>
        {before}<span className={styles.rawCursor} />{after}
      </span>
    )
  }

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}

      {/* Off-screen input — real dimensions so selectionStart works on iOS */}
      <input
        ref={inputRef}
        className={styles.offscreen}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => { setShowKb(true); syncCursor() }}
        onSelect={syncCursor}
        onKeyUp={syncCursor}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        inputMode="none"
      />

      {/* KaTeX display card — the only visible thing */}
      <div
        className={`${styles.card} ${showKb ? styles.cardFocused : ''}`}
        onClick={() => inputRef.current?.focus()}
        role="button"
        tabIndex={0}
      >
        <CardContent />
      </div>

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
