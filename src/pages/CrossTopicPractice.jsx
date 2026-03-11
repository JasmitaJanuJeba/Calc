import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { CROSS_PROBLEMS } from '../data/crossProblems'
import GraphPanel from '../components/GraphPanel'
import CalcInput from '../components/CalcInput'
import styles from './CrossTopicPractice.module.css'

export default function CrossTopicPractice({ onBack }) {
  const [view, setView] = useState('list')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [sliderVal, setSliderVal] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [hintsShown, setHintsShown] = useState(0)
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [solvedIds, setSolvedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('calcbc-cross-solved') || '[]')) }
    catch { return new Set() }
  })
  const [filterDiff, setFilterDiff] = useState(0)

  function selectProblem(idx) {
    const p = CROSS_PROBLEMS[idx]
    setCurrentIdx(idx)
    setSliderVal(p.slider?.default ?? 0)
    setAnswer('')
    setSubmitted(false)
    setCorrect(false)
    setHintsShown(0)
    setSolutionVisible(false)
    setView('problem')
  }

  function handleCheck() {
    const p = CROSS_PROBLEMS[currentIdx]
    const isCorrect = p.check(answer)
    setCorrect(isCorrect)
    setSubmitted(true)
    if (isCorrect) {
      const newSolved = new Set([...solvedIds, p.id])
      setSolvedIds(newSolved)
      localStorage.setItem('calcbc-cross-solved', JSON.stringify([...newSolved]))
      setSolutionVisible(true)
    }
  }

  function handleShowSolution() {
    setSolutionVisible(true)
  }

  function handleNext() {
    const nextIdx = (currentIdx + 1) % CROSS_PROBLEMS.length
    selectProblem(nextIdx)
  }

  const filtered = CROSS_PROBLEMS
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => filterDiff === 0 || p.difficulty === filterDiff)

  const sortedFiltered = [
    ...filtered.filter(({ p }) => !solvedIds.has(p.id)),
    ...filtered.filter(({ p }) => solvedIds.has(p.id)),
  ]

  const p = CROSS_PROBLEMS[currentIdx]
  const setupGraph = p ? p.getSetupGraph(sliderVal) : null

  const diffLabel = ['★', '★★', '★★★']

  if (view === 'list') {
    return (
      <div className={styles.page}>
        <motion.div
          className={styles.heroSection}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button className={styles.backBtn} onClick={onBack}>← Back</button>
          <div className={styles.heroIcon}>⚡</div>
          <h1 className={styles.heroTitle}>Cross-Topic Challenges</h1>
          <p className={styles.heroSub}>
            Connect everything you know. Real-world problems bridging multiple calculus concepts.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.stat}><span>{CROSS_PROBLEMS.length}</span> Problems</div>
            <div className={styles.statDot} />
            <div className={styles.stat}><span>{solvedIds.size}</span> Solved</div>
            <div className={styles.statDot} />
            <div className={styles.stat}><span>{CROSS_PROBLEMS.length - solvedIds.size}</span> Remaining</div>
          </div>
        </motion.div>

        <div className={styles.filterRow}>
          {[0, 1, 2, 3].map(d => (
            <button
              key={d}
              className={`${styles.filterBtn} ${filterDiff === d ? styles.filterActive : ''}`}
              onClick={() => setFilterDiff(d)}
            >
              {d === 0 ? 'All' : `${'★'.repeat(d)} Difficulty ${d}`}
            </button>
          ))}
        </div>

        <motion.div
          className={styles.problemGrid}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
          {sortedFiltered.map(({ p: prob, i }) => {
            const isSolved = solvedIds.has(prob.id)
            return (
              <motion.button
                key={prob.id}
                className={`${styles.problemCard} ${isSolved ? styles.cardSolved : ''}`}
                onClick={() => selectProblem(i)}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{ '--card-color': prob.color }}
              >
                <div className={styles.cardColorBar} style={{ background: prob.color }} />
                {isSolved && <div className={styles.solvedOverlay}>✓</div>}
                <div className={styles.cardEmoji}>{prob.emoji}</div>
                <h3 className={styles.cardTitle}>{prob.title}</h3>
                <div className={styles.diffDots}>
                  {[1, 2, 3].map(d => (
                    <span key={d} className={`${styles.diffDot} ${d <= prob.difficulty ? styles.diffDotFilled : ''}`} style={d <= prob.difficulty ? { background: prob.color } : {}} />
                  ))}
                </div>
                <div className={styles.topicChips}>
                  {prob.topics.slice(0, 2).map(t => (
                    <span key={t} className={styles.topicChip} style={{ borderColor: prob.color + '50', color: prob.color }}>
                      {t}
                    </span>
                  ))}
                  {prob.topics.length > 2 && (
                    <span className={styles.topicChip} style={{ borderColor: prob.color + '50', color: prob.color }}>
                      +{prob.topics.length - 2}
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    )
  }

  // Problem view
  return (
    <div className={styles.page}>
      <div className={styles.problemHeader}>
        <button className={styles.backBtn} onClick={() => setView('list')}>← All Problems</button>
        <div className={styles.problemProgress}>
          <span className={styles.problemTitle}>{p.emoji} {p.title}</span>
          <span className={styles.progressBadge}>{currentIdx + 1} / {CROSS_PROBLEMS.length}</span>
        </div>
        <button className={styles.nextBtn} onClick={handleNext}>Next →</button>
      </div>

      <div className={styles.problemView}>
        {/* Left Panel: Setup */}
        <div className={styles.setupPanel}>
          <div className={styles.realWorldBadge}>
            🌍 {p.realWorld}
          </div>
          <p className={styles.introText}>{p.intro}</p>

          {setupGraph && (
            <GraphPanel
              data={setupGraph.data}
              layout={setupGraph.layout}
              height={280}
            />
          )}

          {p.slider && (
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>{p.slider.label(sliderVal)}</label>
              <input
                type="range"
                className={styles.slider}
                min={p.slider.min}
                max={p.slider.max}
                step={p.slider.step}
                value={sliderVal}
                onChange={e => setSliderVal(+e.target.value)}
              />
              <div className={styles.sliderRange}>
                <span>{p.slider.min}</span><span>{p.slider.max}</span>
              </div>
            </div>
          )}

          <div className={styles.topicsConnected}>
            <span className={styles.topicsLabel}>Topics Connected:</span>
            <div className={styles.topicPills}>
              {p.topics.map(t => (
                <span key={t} className={styles.topicPill} style={{ background: p.color + '22', borderColor: p.color + '60', color: p.color }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Solve */}
        <div className={styles.solvePanel}>
          <div className={styles.questionSection}>
            <h3 className={styles.questionText}>{p.question}</h3>
            <div className={styles.latexDisplay}>
              <BlockMath math={p.latex} />
            </div>
          </div>

          {!solutionVisible && (
            <div className={styles.answerSection}>
              <CalcInput
                label={`Your answer (${p.unit}):`}
                value={answer}
                onChange={setAnswer}
                placeholder="Enter answer…"
              />
              <button
                className={styles.checkBtn}
                onClick={handleCheck}
                disabled={!answer.trim()}
              >
                Check Answer
              </button>
            </div>
          )}

          <AnimatePresence>
            {submitted && !correct && !solutionVisible && (
              <motion.div
                className={styles.resultWrong}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <span>✗ Not quite. Try again or</span>
                <button className={styles.showSolBtn} onClick={handleShowSolution}>
                  Show Solution
                </button>
              </motion.div>
            )}
            {submitted && correct && (
              <motion.div
                className={styles.resultCorrect}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✓ Correct! <span className={styles.answerLatex}><BlockMath math={p.answerLatex} /></span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hints */}
          {!solutionVisible && (
            <div className={styles.hintsSection}>
              {p.hints.slice(0, hintsShown).map((h, i) => (
                <motion.div
                  key={i}
                  className={styles.hintCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className={styles.hintTitle}>💡 Hint {i + 1}: {h.title}</div>
                  {h.text && <p className={styles.hintText}>{h.text}</p>}
                  {h.formula && (
                    <div className={styles.hintFormula}><BlockMath math={h.formula} /></div>
                  )}
                </motion.div>
              ))}
              {hintsShown < p.hints.length && (
                <button className={styles.hintBtn} onClick={() => setHintsShown(n => n + 1)}>
                  💡 Show Hint {hintsShown + 1} of {p.hints.length}
                </button>
              )}
            </div>
          )}

          {/* Solution */}
          <AnimatePresence>
            {solutionVisible && (
              <motion.div
                className={styles.solutionSection}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.solutionHeader}>
                  <h3>Full Solution</h3>
                  <div className={styles.answerDisplay}>
                    <BlockMath math={p.answerLatex} />
                  </div>
                </div>

                <div className={styles.stepsContainer}>
                  {p.solution.map((step, i) => (
                    <motion.div
                      key={i}
                      className={styles.stepCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className={styles.stepNumber} style={{ background: p.color }}>{i + 1}</div>
                      <div className={styles.stepContent}>
                        <div className={styles.stepTitle}>{step.title}</div>
                        {step.text && <p className={styles.stepText}>{step.text}</p>}
                        {step.formula && (
                          <div className={styles.stepFormula}><BlockMath math={step.formula} /></div>
                        )}
                        {step.note && <p className={styles.stepNote}>{step.note}</p>}
                        {step.graph && (
                          <div className={styles.stepGraph}>
                            <GraphPanel
                              data={step.graph.data}
                              layout={step.graph.layout}
                              height={200}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className={styles.connectionNote}>
                  <div className={styles.connectionNoteHeader}>🔗 Topics Connected</div>
                  <div className={styles.connectionNotePills}>
                    {p.topics.map(t => (
                      <span key={t} className={styles.connectionPill} style={{ background: p.color + '22', borderColor: p.color + '60', color: p.color }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className={styles.connectionNoteText}>{p.connectionNote}</p>
                </div>

                <div className={styles.nextSection}>
                  <button className={styles.nextProblemBtn} onClick={handleNext} style={{ background: p.color }}>
                    Next Problem →
                  </button>
                  <button className={styles.backToListBtn} onClick={() => setView('list')}>
                    ← All Problems
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
