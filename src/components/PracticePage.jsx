import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import CalcInput from './CalcInput'
import styles from './PracticePage.module.css'
import { PROBLEMS } from '../data/problems'
import { getSection, recordSolve } from '../utils/progress'

function pickRandom(arr, exclude) {
  if (arr.length === 0) return 0
  if (arr.length === 1) return 0
  let idx
  do { idx = Math.floor(Math.random() * arr.length) } while (idx === exclude)
  return idx
}

export default function PracticePage({ topic }) {
  const problems = PROBLEMS[topic.id] || []
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * Math.max(problems.length, 1)))
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(false)
  const [hintsShown, setHintsShown] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [section, setSection] = useState(() => getSection(topic.id))
  const [showSolution, setShowSolution] = useState(false)

  const problem = problems[idx]

  const handleCheck = useCallback(() => {
    if (!answer.trim() || submitted) return
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    const isCorrect = problem.check(answer)
    setCorrect(isCorrect)
    setSubmitted(true)
    if (isCorrect) {
      const clean = newAttempts === 1 && !hintsUsed
      setSection(recordSolve(topic.id, clean))
    }
  }, [answer, submitted, attempts, problem, hintsUsed, topic.id])

  const handleNext = useCallback(() => {
    setIdx(i => pickRandom(problems, i))
    setAnswer('')
    setSubmitted(false)
    setCorrect(false)
    setHintsUsed(false)
    setHintsShown(0)
    setAttempts(0)
    setShowSolution(false)
  }, [problems])

  const handleRetry = useCallback(() => {
    setAnswer('')
    setSubmitted(false)
    setCorrect(false)
    // keep hintsUsed/attempts — they already broke the streak
  }, [])

  const handleRevealHint = useCallback(() => {
    setHintsUsed(true)
    setHintsShown(n => Math.min(n + 1, problem.hints.length))
  }, [problem])

  const handleShowSolution = useCallback(() => {
    setHintsUsed(true)
    setHintsShown(problem.hints.length)
    setShowSolution(true)
  }, [problem])

  if (!problem) {
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
          key={idx}
          className={styles.card}
          style={{ '--color': topic.color }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question */}
          <div className={styles.questionBlock} style={{ borderBottomColor: topic.color + '33' }}>
            <p className={styles.questionText}>{problem.question}</p>
            <div className={styles.mathDisplay}>
              <BlockMath math={problem.latex} />
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

                {hintsShown < problem.hints.length && (
                  <button className={styles.hintBtn} onClick={handleRevealHint}>
                    💡 Hint ({hintsShown + 1}/{problem.hints.length})
                  </button>
                )}
                {hintsShown === problem.hints.length && !showSolution && (
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
                      Answer: <strong>{problem.answerLatex}</strong>
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

          {problem.hints.slice(0, hintsShown).map((hint, i) => (
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
          {!submitted && hintsShown < problem.hints.length && (
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
