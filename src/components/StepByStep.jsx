import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import styles from './StepByStep.module.css'

export default function StepByStep({ steps, title = 'Step-by-Step Solution', color = '#7c3aed', answer }) {
  const [revealed, setRevealed] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const display = showAll ? steps : steps.slice(0, revealed + 1)

  function renderText(text) {
    if (!text) return null
    // Split on $...$ for inline math and $$...$$ for block math
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g)
    return parts.map((part, i) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const latex = part.slice(2, -2)
        return <BlockMath key={i} math={latex} />
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1)
        return <InlineMath key={i} math={latex} />
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon} style={{ background: color }}>✦</div>
        <h3 className={styles.title}>{title}</h3>
        <button
          className={styles.toggleBtn}
          onClick={() => setShowAll(s => !s)}
          style={{ borderColor: color + '40', color }}
        >
          {showAll ? 'Step by step' : 'Show all'}
        </button>
      </div>

      <div className={styles.steps}>
        <AnimatePresence>
          {display.map((step, i) => (
            <motion.div
              key={i}
              className={styles.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: showAll ? i * 0.05 : 0 }}
              style={{ '--step-color': color }}
            >
              <div className={styles.stepNumber} style={{ background: color }}>
                {i + 1}
              </div>
              <div className={styles.stepContent}>
                {step.title && (
                  <div className={styles.stepTitle} style={{ color }}>{step.title}</div>
                )}
                <div className={styles.stepText}>{renderText(step.text)}</div>
                {step.formula && (
                  <div className={styles.formula}>
                    <BlockMath math={step.formula} />
                  </div>
                )}
                {step.note && (
                  <div className={styles.note}>
                    <span>💡</span> {renderText(step.note)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!showAll && revealed < steps.length - 1 && (
        <motion.button
          className={styles.nextBtn}
          onClick={() => setRevealed(r => Math.min(r + 1, steps.length - 1))}
          style={{ background: color }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Next Step →
        </motion.button>
      )}

      {answer && (revealed === steps.length - 1 || showAll) && (
        <motion.div
          className={styles.answer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ borderColor: color, background: color + '14' }}
        >
          <span className={styles.answerLabel} style={{ color }}>✓ Final Answer</span>
          <div className={styles.answerValue}>
            <BlockMath math={answer} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
