import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-[#11110F] text-ink dark:text-[#F7F5EE] transition-colors">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}
