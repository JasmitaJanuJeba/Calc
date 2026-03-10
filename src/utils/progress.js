const KEY = 'calcbc-progress'

const blank = () => ({ totalSolved: 0, streak: 0, mastered: false })

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch { return {} }
}

export function getSection(topicId) {
  return loadProgress()[topicId] || blank()
}

/** Call after each problem attempt.
 *  isClean = answered correctly on first try with no hints used.
 *  Returns the updated section object. */
export function recordSolve(topicId, isClean) {
  const progress = loadProgress()
  const section = progress[topicId] || blank()
  section.totalSolved += 1
  if (isClean) {
    section.streak += 1
    if (section.streak >= 10) section.mastered = true
  } else {
    section.streak = 0
  }
  progress[topicId] = section
  try { localStorage.setItem(KEY, JSON.stringify(progress)) } catch {}
  return section
}
