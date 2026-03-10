import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import CalcInput from './CalcInput'
import styles from './PracticePage.module.css'
import { PROBLEMS } from '../data/problems'
import { GENERATORS } from '../data/generators'
import { getSection, recordSolve } from '../utils/progress'

// Build a shuffled batch of unseen problems: static first, then generated
function buildBatch(topicId, seenSet) {
  const gens = GENERATORS[topicId] || []
  const batch = []

  // Add all unseen static problems
  const staticPool = PROBLEMS[topicId] || []
  staticPool.forEach(p => {
    if (!seenSet.has(p.id)) {
      seenSet.add(p.id)
      batch.push(p)
    }
  })

  // Fill up to ~20 problems using generators
  const target = Math.max(20, batch.length + 10)
  let tries = 0
  while (batch.length < target && gens.length > 0 && tries < gens.length * 25) {
    tries++
    const p = gens[Math.floor(Math.random() * gens.length)]()
    if (p && !seenSet.has(p.id)) {
      seenSet.add(p.id)
      batch.push(p)
    }
  }

  // Shuffle
  for (let i = batch.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[batch[i], batch[j]] = [batch[j], batch[i]]
  }
  return batch
}

export default function PracticePage({ topic }) {
  const seenIds = useRef(new Set())
  const queueRef = useRef([])
  const [nonce, setNonce] = useState(0) // drives AnimatePresence key

  const [currentProblem, setCurrentProblem] = useState(() => {
    const batch = buildBatch(topic.id, seenIds.current)
    queueRef.current = batch.slice(1)
    return batch[0] || null
  })

  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(false)
  const [hintsShown, setHintsShown] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [section, setSection] = useState(() => getSection(topic.id))
  const [showSolution, setShowSolution] = useState(false)

  const advanceProblem = useCallback(() => {
    // Refill when queue is running low
    if (queueRef.current.length < 5) {
      const more = buildBatch(topic.id, seenIds.current)
      if (more.length === 0) {
        // All generators exhausted — reset and start fresh
        seenIds.current.clear()
        const fresh = buildBatch(topic.id, seenIds.current)
        queueRef.current = [...queueRef.current, ...fresh]
      } else {
        queueRef.current = [...queueRef.current, ...more]
      }
    }
    const next = queueRef.current.shift()
    setCurrentProblem(next || null)
    setNonce(n => n + 1)
  }, [topic.id])

  const handleCheck = useCallback(() => {
    if (!answer.trim() || submitted || !currentProblem) return
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    const isCorrect = currentProblem.check(answer)
    setCorrect(isCorrect)
    setSubmitted(true)
    if (isCorrect) {
      const clean = newAttempts === 1 && !hintsUsed
      setSection(recordSolve(topic.id, clean))
    }
  }, [answer, submitted, attempts, currentProblem, hintsUsed, topic.id])

  const handleNext = useCallback(() => {
    advanceProblem()
    setAnswer('')
    setSubmitted(false)
    setCorrect(false)
    setHintsUsed(false)
    setHintsShown(0)
    setAttempts(0)
    setShowSolution(false)
  }, [advanceProblem])

  const handleRetry = useCallback(() => {
    setAnswer('')
    setSubmitted(false)
    setCorrect(false)
  }, [])

  const handleRevealHint = useCallback(() => {
    setHintsUsed(true)
    setHintsShown(n => Math.min(n + 1, currentProblem.hints.length))
  }, [currentProblem])

  const handleShowSolution = useCallback(() => {
    setHintsUsed(true)
    setHintsShown(currentProblem.hints.length)
    setShowSolution(true)
  }, [currentProblem])

  if (!currentProblem) {
    return <div className={styles.empty}>No practice problems available for this section yet.</div>
  }

  const toMastery = Math.max(0, 10 - section.streak)
  const streakPct = Math.min(100, section.streak * 10)

  return (
    <div className={styles.page}>

      {/* ── Progress strip ── */}
      <div className={styles.progressStrip}>
        <div className={styles.progressLeft}>
          <span className={styles.solvedCount}>
            {section.totalSolved} solved
          </span>
          {section.mastered ? (
            <span className={styles.masteredBadge}>👑 Mastered!</span>
          ) : (
            <span className={styles.streakInfo}>
              🔥 {section.streak} streak &mdash; {toMastery} more to mastery
            </span>
          )}
        </div>
        <div className={styles.streakBarWrap}>
          <div
            className={styles.streakBarFill}
            style={{
              width: `${streakPct}%`,
              background: section.mastered
                ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                : `linear-gradient(90deg,${topic.color},${topic.color}99)`,
            }}
          />
        </div>
      </div>

      {/* ── Problem card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={nonce}
          className={styles.card}
          style={{ '--color': topic.color }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question */}
          <div className={styles.questionBlock} style={{ borderBottomColor: topic.color + '33' }}>
            <p className={styles.questionText}>{currentProblem.question}</p>
            <div className={styles.mathDisplay}>
              <BlockMath math={currentProblem.latex} />
            </div>
          </div>

          {/* Answer input — only while not yet correctly submitted */}
          {!submitted && (
            <div className={styles.answerBlock}>
              <label className={styles.answerLabel}>Your answer</label>
              <CalcInput
                value={answer}
                onChange={setAnswer}
                placeholder="Type or use the keyboard…"
              />
              <div className={styles.btnRow}>
                <button
                  className={styles.checkBtn}
                  style={{ background: topic.color }}
                  onClick={handleCheck}
                  disabled={!answer.trim()}
                >
                  Check Answer
                </button>

                {hintsShown < currentProblem.hints.length && (
                  <button className={styles.hintBtn} onClick={handleRevealHint}>
                    💡 Hint ({hintsShown + 1}/{currentProblem.hints.length})
                  </button>
                )}
                {hintsShown === currentProblem.hints.length && !showSolution && (
                  <button className={styles.hintBtn} onClick={handleShowSolution}>
                    👁 Show solution
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Result banner */}
          {submitted && (
            <motion.div
              className={correct ? styles.resultCorrect : styles.resultWrong}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {correct ? (
                <>
                  <span className={styles.resultIcon}>✓</span>
                  <div>
                    <p className={styles.resultTitle}>Correct!</p>
                    <p className={styles.resultSub}>
                      {attempts === 1 && !hintsUsed
                        ? `Perfect solve 🔥  Streak: ${section.streak}/10`
                        : 'Well done — streak reset (need first-try, no hints to build it)'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.resultIcon}>✗</span>
                  <div>
                    <p className={styles.resultTitle}>Not quite.</p>
                    <p className={styles.resultSub}>
                      Answer: <strong>{currentProblem.answerLatex}</strong>
                    </p>
                    <div className={styles.retryRow}>
                      <button className={styles.retryBtn} onClick={handleRetry}>
                        Try Again
                      </button>
                      {!showSolution && (
                        <button className={styles.hintBtn} onClick={handleShowSolution}>
                          👁 Show solution
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {submitted && (
            <button
              className={styles.nextBtn}
              style={{ '--color': topic.color }}
              onClick={handleNext}
            >
              Next Problem →
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Step-by-step hints ── */}
      {hintsShown > 0 && (
        <div className={styles.hintsPanel}>
          <h3 className={styles.hintsPanelTitle}>Solution Steps</h3>

          {currentProblem.hints.slice(0, hintsShown).map((hint, i) => (
            <motion.div
              key={i}
              className={styles.hintStep}
              style={{ borderLeftColor: topic.color }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <p className={styles.hintTitle}>
                Step {i + 1}: {hint.title}
              </p>
              {hint.body && <p className={styles.hintBody}>{hint.body}</p>}
              {hint.formula && (
                <div className={styles.hintFormula}>
                  <BlockMath math={hint.formula} />
                </div>
              )}
            </motion.div>
          ))}

          {/* Reveal next step button while answering */}
          {!submitted && hintsShown < currentProblem.hints.length && (
            <button
              className={styles.nextStepBtn}
              style={{ color: topic.color, borderColor: topic.color + '44' }}
              onClick={handleRevealHint}
            >
              Reveal next step →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
