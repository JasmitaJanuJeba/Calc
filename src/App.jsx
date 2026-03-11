import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Homepage from './components/Homepage'
import TopicPage from './components/TopicPage'
import CrossTopicPractice from './pages/CrossTopicPractice'
import FRQPractice from './pages/FRQPractice'
import './App.css'

export default function App() {
  const [currentTopic, setCurrentTopic] = useState(null)
  const [showCrossTopicPractice, setShowCrossTopicPractice] = useState(false)
  const [showFRQPractice, setShowFRQPractice] = useState(false)

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {showFRQPractice ? (
          <motion.div
            key="frq"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <FRQPractice onBack={() => setShowFRQPractice(false)} />
          </motion.div>
        ) : showCrossTopicPractice ? (
          <motion.div
            key="cross"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <CrossTopicPractice onBack={() => setShowCrossTopicPractice(false)} />
          </motion.div>
        ) : currentTopic === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <Homepage
              onSelectTopic={setCurrentTopic}
              onCrossTopicPractice={() => setShowCrossTopicPractice(true)}
              onFRQPractice={() => setShowFRQPractice(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key={currentTopic.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <TopicPage topic={currentTopic} onBack={() => setCurrentTopic(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
