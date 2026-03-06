import { useState } from 'react'
import styles from './MathKeyboard.module.css'

const TABS = [
  { id: 'nums',    label: '123',  icon: null },
  { id: 'calc',    label: '∫π',   icon: null },
  { id: 'symbols', label: '!<>',  icon: null },
]

// Each key: { label, insert, superscript?, subscript?, wide? }
// insert: string to insert; if it contains §, cursor is placed there
const KEYS = {
  nums: [
    [
      { label: 'x',    insert: 'x' },
      { label: 'y',    insert: 'y' },
      { label: 'z',    insert: 'z' },
      { label: '(',    insert: '(' },
      { label: ')',    insert: ')' },
      { label: '[',    insert: '[' },
      { label: ']',    insert: ']' },
    ],
    [
      { label: 'x²',   insert: '^2',   sup: '2' },
      { label: '√',    insert: 'sqrt(§)' },
      { label: 'ⁿ√',   insert: 'nthRoot(§,n)', sup: 'n' },
      { label: 'xⁿ',   insert: '^(§)',  sup: 'n' },
      { label: 'a/b',  insert: '(§)/()', frac: true },
      { label: '7',    insert: '7' },
      { label: '8',    insert: '8' },
      { label: '9',    insert: '9' },
      { label: '÷',    insert: '/' },
    ],
    [
      { label: '∫',    insert: 'integrate(§,x)' },
      { label: 'd/dx', insert: 'derivative(§,x)', sup: '' },
      { label: 'lim',  insert: 'limit(§,x,0)', wide: true },
      { label: '4',    insert: '4' },
      { label: '5',    insert: '5' },
      { label: '6',    insert: '6' },
      { label: '×',    insert: '*' },
    ],
    [
      { label: 'sin',  insert: 'sin(§)' },
      { label: 'cos',  insert: 'cos(§)' },
      { label: 'log',  insert: 'log(§)', sup: '', sub: '10' },
      { label: 'ln',   insert: 'log(§)' },
      { label: 'eˣ',   insert: 'exp(§)', sup: 'x' },
      { label: '1',    insert: '1' },
      { label: '2',    insert: '2' },
      { label: '3',    insert: '3' },
      { label: '−',    insert: '-' },
    ],
    [
      { label: 'π',    insert: 'pi' },
      { label: 'e',    insert: 'e' },
      { label: '|x|',  insert: 'abs(§)' },
      { label: '.',    insert: '.' },
      { label: '0',    insert: '0' },
      { label: '=',    insert: '=' },
      { label: '+',    insert: '+' },
    ],
  ],
  calc: [
    [
      { label: '∫',       insert: 'integrate(§,x)' },
      { label: '∫ₐᵇ',     insert: 'integrate(§,x,a,b)' },
      { label: 'd/dx',    insert: 'derivative(§,x)' },
      { label: '∂/∂x',    insert: 'derivative(§,x)' },
      { label: 'limₓ→a',  insert: 'limit(§,x,a)', wide: true },
      { label: 'Σ',       insert: 'sum(§,k,0,n)' },
      { label: 'π',       insert: 'pi' },
    ],
    [
      { label: '(□)',     insert: '(§)' },
      { label: '□\'',     insert: 'derivative(§,x)' },
      { label: 'f\'\'',   insert: 'derivative(§,x,2)' },
      { label: '|□|',     insert: 'abs(§)' },
      { label: '□ₙ',      insert: '(§)_n' },
      { label: 'U',       insert: 'union(§)' },
      { label: '⊞',       insert: 'matrix([§])' },
    ],
    [
      { label: 'n',       insert: 'n' },
      { label: 'i',       insert: 'i' },
      { label: 'f(x)',    insert: 'f(x)' },
      { label: 'nPr',     insert: 'permutations(n,r)', sub: '' },
      { label: 'nCr',     insert: 'combinations(n,r)', sup: 'r', sub: 'n' },
      { label: 'θ',       insert: 'theta' },
      { label: '∞',       insert: 'Infinity' },
    ],
    [
      { label: 'sin',     insert: 'sin(§)' },
      { label: 'cos',     insert: 'cos(§)' },
      { label: 'tan',     insert: 'tan(§)' },
      { label: 'sec',     insert: 'sec(§)' },
      { label: 'cot',     insert: 'cot(§)' },
      { label: 'csc',     insert: 'csc(§)' },
      { label: 'x²',      insert: '^2' },
    ],
  ],
  symbols: [
    [
      { label: 'x',   insert: 'x' },
      { label: 'y',   insert: 'y' },
      { label: 'z',   insert: 'z' },
      { label: '□‾',  insert: 'mean(§)', wide: true },
      { label: '×□',  insert: '*(§)' },
      { label: '+□',  insert: '+(§)' },
      { label: '−□',  insert: '-(§)' },
    ],
    [
      { label: 'log₁₀', insert: 'log10(§)', sub: '10' },
      { label: 'log₂',  insert: 'log2(§)',  sub: '2' },
      { label: 'log',   insert: 'log(§)' },
      { label: 'ln',    insert: 'log(§)' },
      { label: '(□)',   insert: '(§)' },
      { label: '{□}',   insert: '{§}' },
      { label: '[□]',   insert: '[§]' },
    ],
    [
      { label: '<',   insert: '<' },
      { label: '>',   insert: '>' },
      { label: '≤',   insert: '<=' },
      { label: '≥',   insert: '>=' },
      { label: 'and', insert: ' and ', wide: true },
      { label: 'or',  insert: ' or ',  wide: true },
      { label: '{□',  insert: 'piecewise(§)' },
    ],
    [
      { label: '%',   insert: '/100' },
      { label: '!',   insert: '!' },
      { label: ',',   insert: ',' },
      { label: ';',   insert: ';' },
      { label: ':',   insert: ':' },
      { label: '≠',   insert: '!=' },
      { label: '*',   insert: '*' },
    ],
  ],
}

function insertIntoInput(inputEl, snippet) {
  const start = inputEl.selectionStart
  const end   = inputEl.selectionEnd
  const val   = inputEl.value

  const cursorPos = snippet.indexOf('§')
  const clean     = snippet.replace('§', '')

  const newVal    = val.slice(0, start) + clean + val.slice(end)
  const newCursor = cursorPos >= 0 ? start + cursorPos : start + clean.length

  // Use native input setter to trigger React's onChange
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  nativeSetter.call(inputEl, newVal)
  inputEl.dispatchEvent(new Event('input', { bubbles: true }))

  requestAnimationFrame(() => {
    inputEl.focus()
    inputEl.setSelectionRange(newCursor, newCursor)
  })
}

export default function MathKeyboard({ inputRef, onClose }) {
  const [tab, setTab] = useState('nums')

  const handleKey = (key) => {
    if (!inputRef?.current) return
    insertIntoInput(inputRef.current, key.insert)
  }

  const handleBackspace = () => {
    if (!inputRef?.current) return
    const el = inputRef.current
    const start = el.selectionStart
    const end   = el.selectionEnd
    if (start === end && start === 0) return
    const val    = el.value
    const newVal = start !== end
      ? val.slice(0, start) + val.slice(end)
      : val.slice(0, start - 1) + val.slice(start)
    const newCursor = start !== end ? start : Math.max(0, start - 1)
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    nativeSetter.call(el, newVal)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(newCursor, newCursor)
    })
  }

  const handleArrow = (dir) => {
    if (!inputRef?.current) return
    const el = inputRef.current
    const pos = dir === 'left'
      ? Math.max(0, el.selectionStart - 1)
      : Math.min(el.value.length, el.selectionEnd + 1)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(pos, pos)
    })
  }

  const rows = KEYS[tab] || []

  return (
    <div className={styles.keyboard}>
      {/* Tab bar */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onMouseDown={e => { e.preventDefault(); setTab(t.id) }}
          >
            {t.label}
          </button>
        ))}
        <button
          className={styles.closeBtn}
          onMouseDown={e => { e.preventDefault(); onClose?.() }}
        >
          ✕
        </button>
      </div>

      {/* Key rows */}
      <div className={styles.rows}>
        {rows.map((row, ri) => (
          <div key={ri} className={styles.row}>
            {row.map((key, ki) => (
              <button
                key={ki}
                className={`${styles.key} ${key.wide ? styles.wide : ''}`}
                onMouseDown={e => { e.preventDefault(); handleKey(key) }}
                title={key.insert.replace('§', '□')}
              >
                <span className={styles.keyLabel}>{key.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom toolbar */}
      <div className={styles.toolbar}>
        <button className={styles.toolBtn} onMouseDown={e => { e.preventDefault(); handleKey({ insert: 'x' }) }}>ABC</button>
        <button className={styles.toolBtn} onMouseDown={e => { e.preventDefault(); handleArrow('left') }}>←</button>
        <button className={styles.toolBtn} onMouseDown={e => { e.preventDefault(); handleArrow('right') }}>→</button>
        <button className={styles.toolBtn} onMouseDown={e => { e.preventDefault(); handleKey({ insert: '\n' }) }}>↵</button>
        <button className={`${styles.toolBtn} ${styles.backspace}`} onMouseDown={e => { e.preventDefault(); handleBackspace() }}>⌫</button>
        <button className={`${styles.toolBtn} ${styles.go}`} onMouseDown={e => { e.preventDefault(); onClose?.() }}>GO</button>
      </div>
    </div>
  )
}
