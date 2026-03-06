import { InlineMath, BlockMath } from 'react-katex'

/**
 * Renders a list of items. Each item can be:
 *   - a string (with $...$ for inline math and $$...$$ for block math)
 *   - a React element
 */
export function MathText({ children }) {
  if (typeof children !== 'string') return <>{children}</>
  const parts = children.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('$$') && p.endsWith('$$')) return <BlockMath key={i} math={p.slice(2, -2)} />
        if (p.startsWith('$') && p.endsWith('$')) return <InlineMath key={i} math={p.slice(1, -1)} />
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

export function MathItem({ children }) {
  return <li><MathText>{children}</MathText></li>
}

export function MathList({ items }) {
  return (
    <ul>
      {items.map((item, i) => <MathItem key={i}>{item}</MathItem>)}
    </ul>
  )
}

export function ConceptCard({ title, color, children, items }) {
  return (
    <div style={{
      background: '#12122a',
      border: `1px solid ${color}30`,
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{
        fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.07em', color, marginBottom: 14
      }}>
        {title}
      </div>
      <div style={{ fontSize: '0.9rem', color: 'rgba(240,240,255,0.75)', lineHeight: 1.7 }}>
        {items ? <MathList items={items} /> : children}
      </div>
    </div>
  )
}
