import { ReactNode } from 'react'

export function PageShell({
  children,
  containerClassName = 'max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-14',
}: {
  children: ReactNode
  containerClassName?: string
}) {
  return (
    <div className="w-full flex-grow relative transition-colors">
      <div className={`${containerClassName} relative z-10`}>{children}</div>
    </div>
  )
}

export default PageShell
