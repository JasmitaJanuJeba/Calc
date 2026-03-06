import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Homepage from './components/Homepage'
import TopicPage from './components/TopicPage'
import './App.css'

export default function App() {
  const [currentTopic, setCurrentTopic] = useState(null)

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentTopic === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <Homepage onSelectTopic={setCurrentTopic} />
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
