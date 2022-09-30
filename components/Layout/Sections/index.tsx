import classNames from 'classnames'

import styles from './styles.module.less'

export const Main = ({ children }: { children: any }) => (
  <div className="main-section">{children}</div>
)

export const Sider = ({ children }: { children: any }) => (
  <div className="sider-section">{children}</div>
)

export const Section = ({
  bordered = true,
  children,
  className,
  id,
  title,
  titleSize,
}: {
  children: any
  id?: string
  title?: any
  titleSize?: any
  className?: any
  bordered?: boolean
}) => (
  <div
    className={classNames('page-section', className, titleSize, {
      bordered: bordered,
      'without-title': !title,
    })}
    id={id}
  >
    {title && <h2 className="section-title">{title}</h2>}
    <div className="section-content">{children}</div>
  </div>
)
