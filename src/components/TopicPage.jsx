import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './TopicPage.module.css'
import LimitsTopic from '../topics/LimitsTopic'
import DerivativesTopic from '../topics/DerivativesTopic'
import AppDerivativesTopic from '../topics/AppDerivativesTopic'
import IntegralsTopic from '../topics/IntegralsTopic'
import AppIntegralsTopic from '../topics/AppIntegralsTopic'
import DiffEqTopic from '../topics/DiffEqTopic'
import ParametricTopic from '../topics/ParametricTopic'
import SeriesTopic from '../topics/SeriesTopic'

const TOPIC_COMPONENTS = {
  limits: LimitsTopic,
  derivatives: DerivativesTopic,
  appDerivatives: AppDerivativesTopic,
  integrals: IntegralsTopic,
  appIntegrals: AppIntegralsTopic,
  diffEq: DiffEqTopic,
  parametric: ParametricTopic,
  series: SeriesTopic,
}

export default function TopicPage({ topic, onBack }) {
  const [activeSubtopic, setActiveSubtopic] = useState(0)
  const TopicComponent = TOPIC_COMPONENTS[topic.id]

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header} style={{ '--color': topic.color }}>
        <div className={styles.headerBg} style={{ background: topic.gradient }} />
        <div className={styles.headerContent}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
          <div className={styles.topicInfo}>
            <span className={styles.topicEmoji}>{topic.emoji}</span>
            <div>
              <p className={styles.unitLabel}>Unit {topic.unit}</p>
              <h1 className={styles.topicTitle}>{topic.name}</h1>
            </div>
          </div>
        </div>

        {/* Subtopic tabs */}
        <div className={styles.tabs}>
          {topic.subtopics.map((sub, i) => (
            <motion.button
              key={sub}
              className={`${styles.tab} ${activeSubtopic === i ? styles.tabActive : ''}`}
              onClick={() => setActiveSubtopic(i)}
              style={{ '--tab-color': topic.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              {sub}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubtopic}
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {TopicComponent ? (
            <TopicComponent
              subtopicIndex={activeSubtopic}
              subtopic={topic.subtopics[activeSubtopic]}
              color={topic.color}
            />
          ) : (
            <div className={styles.placeholder}>
              <p>Content coming soon for {topic.name}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
