import { useRef, useState } from 'react'
import styles from './CalcInput.module.css'
import MathKeyboard from './MathKeyboard'

export default function CalcInput({
  label, value, onChange, placeholder, hint,
  type = 'text', min, max, step,
  noKeyboard = false,
}) {
  const inputRef = useRef(null)
  const [showKb, setShowKb] = useState(false)

  const useKb = type === 'text' && !noKeyboard

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
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
