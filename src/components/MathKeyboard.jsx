import { useState } from 'react'
import styles from './MathKeyboard.module.css'

const TABS = [
  { id: 'nums',    label: '123' },
  { id: 'calc',    label: '∫π'  },
  { id: 'symbols', label: '!<>' },
]

const KEYS = {
  nums: [
    [
      { label: 'x',   insert: 'x' },
      { label: 'y',   insert: 'y' },
      { label: 'z',   insert: 'z' },
      { label: '(',   insert: '(' },
      { label: ')',   insert: ')' },
      { label: '^',   insert: '^' },
      { label: '√',   insert: 'sqrt(§)' },
    ],
    [
      { label: 'x²',  insert: '^2' },
      { label: 'xⁿ',  insert: '^(§)' },
      { label: 'a/b', insert: '(§)/()' },
      { label: '7',   insert: '7' },
      { label: '8',   insert: '8' },
      { label: '9',   insert: '9' },
      { label: '÷',   insert: '/' },
    ],
    [
      { label: '∫',   insert: 'integrate(§,x)' },
      { label: 'd/dx',insert: 'derivative(§,x)' },
      { label: 'lim', insert: 'limit(§,x,0)' },
      { label: '4',   insert: '4' },
      { label: '5',   insert: '5' },
      { label: '6',   insert: '6' },
      { label: '×',   insert: '*' },
    ],
    [
      { label: 'sin', insert: 'sin(§)' },
      { label: 'cos', insert: 'cos(§)' },
      { label: 'ln',  insert: 'log(§)' },
      { label: '1',   insert: '1' },
      { label: '2',   insert: '2' },
      { label: '3',   insert: '3' },
      { label: '−',   insert: '-' },
    ],
    [
      { label: 'π',   insert: 'pi' },
      { label: 'e',   insert: 'e' },
      { label: '|x|', insert: 'abs(§)' },
      { label: '.',   insert: '.' },
      { label: '0',   insert: '0' },
      { label: '=',   insert: '=' },
      { label: '+',   insert: '+' },
    ],
  ],
  calc: [
    [
      { label: '∫',     insert: 'integrate(§,x)' },
      { label: '∫ₐᵇ',   insert: 'integrate(§,x,a,b)' },
      { label: 'd/dx',  insert: 'derivative(§,x)' },
      { label: '∂/∂x',  insert: 'derivative(§,x)' },
      { label: 'lim',   insert: 'limit(§,x,a)', wide: true },
      { label: 'Σ',     insert: 'sum(§,k,1,n)' },
      { label: 'π',     insert: 'pi' },
    ],
    [
      { label: 'sin',   insert: 'sin(§)' },
      { label: 'cos',   insert: 'cos(§)' },
      { label: 'tan',   insert: 'tan(§)' },
      { label: 'sec',   insert: 'sec(§)' },
      { label: 'cot',   insert: 'cot(§)' },
      { label: 'csc',   insert: 'csc(§)' },
      { label: 'x²',    insert: '^2' },
    ],
    [
      { label: 'sin⁻¹', insert: 'asin(§)' },
      { label: 'cos⁻¹', insert: 'acos(§)' },
      { label: 'tan⁻¹', insert: 'atan(§)' },
      { label: 'ln',    insert: 'log(§)' },
      { label: 'log',   insert: 'log10(§)' },
      { label: 'eˣ',    insert: 'exp(§)' },
      { label: '√',     insert: 'sqrt(§)' },
    ],
    [
      { label: 'n',     insert: 'n' },
      { label: 'i',     insert: 'i' },
      { label: 'θ',     insert: 'theta' },
      { label: '∞',     insert: 'Infinity' },
      { label: 'nCr',   insert: 'combinations(n,r)' },
      { label: 'nPr',   insert: 'permutations(n,r)' },
      { label: '|x|',   insert: 'abs(§)' },
    ],
  ],
  symbols: [
    [
      { label: 'x',    insert: 'x' },
      { label: 'y',    insert: 'y' },
      { label: 'z',    insert: 'z' },
      { label: 't',    insert: 't' },
      { label: 'a',    insert: 'a' },
      { label: 'b',    insert: 'b' },
      { label: 'c',    insert: 'c' },
    ],
    [
      { label: 'log₁₀',insert: 'log10(§)' },
      { label: 'log₂', insert: 'log2(§)' },
      { label: 'log',  insert: 'log(§)' },
      { label: 'ln',   insert: 'log(§)' },
      { label: '(□)',  insert: '(§)' },
      { label: '{□}',  insert: '{§}' },
      { label: '[□]',  insert: '[§]' },
    ],
    [
      { label: '<',    insert: '<' },
      { label: '>',    insert: '>' },
      { label: '≤',    insert: '<=' },
      { label: '≥',    insert: '>=' },
      { label: 'and',  insert: ' and ', wide: true },
      { label: 'or',   insert: ' or ',  wide: true },
      { label: '≠',    insert: '!=' },
    ],
    [
      { label: '%',    insert: '/100' },
      { label: '!',    insert: '!' },
      { label: ',',    insert: ',' },
      { label: '^',    insert: '^' },
      { label: '*',    insert: '*' },
      { label: '/',    insert: '/' },
      { label: '_',    insert: '_' },
    ],
  ],
}

export default function MathKeyboard({ onInsert, onBackspace, onArrow, onClose }) {
  const [tab, setTab] = useState('nums')
  const rows = KEYS[tab] || []

  // Prevent any keyboard button from stealing focus from the off-screen input.
  // onMouseDown preventDefault stops focus transfer on both desktop and mobile
  // (mobile fires mousedown as part of the tap sequence, before click).
  // onClick is still used for the action — no double-fire risk.
  const stopFocusTheft = e => e.preventDefault()

  return (
    <div className={styles.keyboard} onMouseDown={stopFocusTheft}>
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.rows}>
        {rows.map((row, ri) => (
          <div key={ri} className={styles.row}>
            {row.map((key, ki) => (
              <button
                key={ki}
                className={`${styles.key} ${key.wide ? styles.wide : ''}`}
                onClick={() => onInsert(key.insert)}
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <button className={styles.toolBtn} onClick={() => onArrow('left')}>←</button>
        <button className={styles.toolBtn} onClick={() => onArrow('right')}>→</button>
        <button className={`${styles.toolBtn} ${styles.backspace}`} onClick={onBackspace}>⌫</button>
        <button className={`${styles.toolBtn} ${styles.go}`} onClick={onClose}>GO</button>
      </div>
    </div>
  )
}
