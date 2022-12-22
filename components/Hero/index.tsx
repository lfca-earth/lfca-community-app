import styles from './styles.module.less'

interface HeroProps {
  subtitle?: string
  title: string
}

export const Hero = ({ subtitle, title }: HeroProps) => {
  return (
    <div className={styles['hero']}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </div>
  )
}
