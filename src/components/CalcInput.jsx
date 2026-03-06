import styles from './CalcInput.module.css'

export default function CalcInput({ label, value, onChange, placeholder, hint, type = 'text', min, max, step }) {
  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}
