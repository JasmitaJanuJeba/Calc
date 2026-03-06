import { motion } from 'framer-motion'
import { TOPICS } from '../data/topics'
import styles from './Homepage.module.css'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 2,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
  color: ['#7c3aed','#ec4899','#06b6d4','#10b981','#f59e0b'][Math.floor(Math.random() * 5)],
}))

export default function Homepage({ onSelectTopic }) {
  return (
    <div className={styles.home}>
      {/* Animated background particles */}
      <div className={styles.particles}>
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className={styles.badge}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ∫
        </motion.div>
        <h1 className={styles.title}>
          AP Calculus BC
          <span className={styles.titleGradient}> Interactive</span>
        </h1>
        <p className={styles.subtitle}>
          Master every topic with step-by-step solutions, interactive graphs, and stunning 3D visualizations
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}><span>8</span> Units</div>
          <div className={styles.statDot} />
          <div className={styles.stat}><span>40+</span> Topics</div>
          <div className={styles.statDot} />
          <div className={styles.stat}><span>∞</span> Practice</div>
        </div>
      </motion.div>

      {/* Topic Grid */}
      <motion.div
        className={styles.grid}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {TOPICS.map((topic, i) => (
          <motion.button
            key={topic.id}
            className={styles.card}
            onClick={() => onSelectTopic(topic)}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.9 },
              show: { opacity: 1, y: 0, scale: 1 }
            }}
            whileHover={{ scale: 1.04, y: -6 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
            style={{ '--card-color': topic.color }}
          >
            <div className={styles.cardGlow} style={{ background: topic.gradient }} />
            <div className={styles.cardInner}>
              <div className={styles.unitBadge}>Unit {topic.unit}</div>
              <div className={styles.cardEmoji}>{topic.emoji}</div>
              <h3 className={styles.cardTitle}>{topic.name}</h3>
              <p className={styles.cardDesc}>{topic.description}</p>
              <div className={styles.subtopics}>
                {topic.subtopics.slice(0, 3).map(s => (
                  <span key={s} className={styles.subtopic} style={{ borderColor: topic.color + '40', color: topic.color }}>
                    {s}
                  </span>
                ))}
                {topic.subtopics.length > 3 && (
                  <span className={styles.subtopic} style={{ borderColor: topic.color + '40', color: topic.color }}>
                    +{topic.subtopics.length - 3} more
                  </span>
                )}
              </div>
              <div className={styles.cardArrow} style={{ color: topic.color }}>
                Explore →
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Built for AP Calculus BC students • Interactive • Visual • Animated</p>
      </motion.div>
    </div>
  )
}
