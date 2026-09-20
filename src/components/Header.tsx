import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Menu, X, User, Settings, LogOut, ArrowRight } from 'lucide-react'

export function Header() {
  const { t } = useTranslation()
  const { user, profile, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-cream dark:bg-[#11110F] border-b-2 border-ink dark:border-[#F7F5EE] transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-yellow-accent border-b-2 border-ink py-1.5 px-4 font-mono text-[11px] md:text-xs font-bold text-ink text-center uppercase tracking-wider flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 bg-ink rounded-full animate-ping" />
        <span>⚡ ADMISSIONS & EXAM UPDATES 2026-27 ARE NOW LIVE IN KARNATAKA & ALL INDIA</span>
        <Link to="/exams" className="underline hover:bg-ink hover:text-yellow-accent px-1 transition-colors hidden sm:inline">
          EXPLORE CATALOG →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-lime-accent nb-border flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#F7F5EE] group-hover:rotate-6 transition-transform text-ink">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-xl tracking-tighter text-ink dark:text-[#F7F5EE] leading-none">
              NEXT VERSE
            </span>
            <span className="font-mono text-[9px] font-bold tracking-widest text-ink/70 dark:text-[#F7F5EE]/70 uppercase">
              CAREER INTEL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-heading font-bold text-xs tracking-tight">
          <Link
            to="/level"
            className="hover:bg-yellow-accent text-ink dark:text-[#F7F5EE] dark:hover:text-ink px-3 py-1.5 border-2 border-transparent hover:border-ink transition-all uppercase"
          >
            ADVISER FLOW
          </Link>
          <Link
            to="/domains"
            className="hover:bg-blue-accent text-ink dark:text-[#F7F5EE] dark:hover:text-ink px-3 py-1.5 border-2 border-transparent hover:border-ink transition-all uppercase"
          >
            DOMAINS
          </Link>
          <Link
            to="/courses"
            className="hover:bg-mint-accent text-ink dark:text-[#F7F5EE] dark:hover:text-ink px-3 py-1.5 border-2 border-transparent hover:border-ink transition-all uppercase"
          >
            COURSES
          </Link>
          <Link
            to="/exams"
            className="hover:bg-lime-accent text-ink dark:text-[#F7F5EE] dark:hover:text-ink px-3 py-1.5 border-2 border-transparent hover:border-ink transition-all uppercase"
          >
            EXAMS
          </Link>
          <Link
            to="/colleges"
            className="hover:bg-yellow-accent text-ink dark:text-[#F7F5EE] dark:hover:text-ink px-3 py-1.5 border-2 border-transparent hover:border-ink transition-all uppercase"
          >
            COLLEGES
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Prominent Neo-Brutalist Light/Dark Toggle */}
          <ThemeToggle />

          {user || profile?.displayName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative nb-btn bg-white dark:bg-[#1A1A17] p-1 flex items-center gap-1.5 text-xs font-mono font-bold"
                >
                  <Avatar className="h-6 w-6 border border-ink">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                    <AvatarFallback className="bg-lime-accent text-ink font-bold text-[10px]">
                      {user?.displayName?.charAt(0) || profile?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-ink dark:text-[#F7F5EE]">
                    {user?.displayName?.split(' ')[0] || profile?.displayName?.split(' ')[0] || 'ACCOUNT'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 nb-card bg-cream dark:bg-[#1A1A17] border-2 border-ink dark:border-[#F7F5EE] shadow-brutal p-2"
                align="end"
                forceMount
              >
                <div className="flex flex-col space-y-1 p-2 border-b border-ink/20 dark:border-white/20 mb-1">
                  <p className="text-sm font-heading font-black text-ink dark:text-[#F7F5EE] leading-none">
                    {user?.displayName || profile?.displayName || 'Student'}
                  </p>
                  <p className="text-xs font-mono text-ink/70 dark:text-[#F7F5EE]/70 truncate">
                    {user?.email || profile?.studentDetails?.district || 'Karnataka, India'}
                  </p>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-yellow-accent hover:text-ink font-heading font-bold text-xs p-2">
                  <Link to="/dashboard" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('dashboard')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-blue-accent hover:text-ink font-heading font-bold text-xs p-2">
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-ink/20 dark:bg-white/20 my-1" />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer hover:bg-rose-300 hover:text-ink font-heading font-bold text-xs p-2 text-rose-600 dark:text-rose-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="nb-btn bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE] px-3.5 py-1.5 text-xs font-heading font-extrabold uppercase hover:bg-yellow-accent dark:hover:bg-yellow-accent dark:hover:text-ink"
              >
                SIGN IN
              </Link>
              <Link
                to="/login"
                className="nb-btn bg-lime-accent text-ink px-4 py-1.5 text-xs font-heading font-black uppercase flex items-center gap-1.5 hover:bg-lime-300 shadow-brutal-sm"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden nb-btn bg-white dark:bg-[#1A1A17] p-1.5 text-ink dark:text-[#F7F5EE]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-ink dark:border-[#F7F5EE] bg-cream dark:bg-[#11110F] px-4 py-4 space-y-3 font-heading font-bold text-sm">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/level"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 nb-card text-center text-xs uppercase hover:bg-yellow-accent dark:hover:text-ink"
            >
              ADVISER FLOW
            </Link>
            <Link
              to="/domains"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 nb-card text-center text-xs uppercase hover:bg-blue-accent dark:hover:text-ink"
            >
              DOMAINS
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 nb-card text-center text-xs uppercase hover:bg-mint-accent dark:hover:text-ink"
            >
              COURSES
            </Link>
            <Link
              to="/exams"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 nb-card text-center text-xs uppercase hover:bg-lime-accent dark:hover:text-ink"
            >
              EXAMS
            </Link>
            <Link
              to="/colleges"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 nb-card text-center text-xs uppercase hover:bg-yellow-accent dark:hover:text-ink col-span-2"
            >
              KARNATAKA COLLEGES CATALOG
            </Link>
          </div>

          <div className="pt-2 border-t border-ink/20 dark:border-white/20 flex items-center justify-between">
            <span className="font-mono text-xs text-ink/70 dark:text-[#F7F5EE]/70">THEME PREFERENCE</span>
            <ThemeToggle compact />
          </div>

          {!user && (
            <div className="pt-2 flex gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-1/2 nb-btn bg-white dark:bg-[#1A1A17] text-center py-2 text-xs uppercase"
              >
                SIGN IN
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-1/2 nb-btn bg-lime-accent text-ink text-center py-2 text-xs uppercase"
              >
                GET STARTED →
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
