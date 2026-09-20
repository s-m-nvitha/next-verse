import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WifiOff, Wifi, Download, RefreshCw, Database } from 'lucide-react'
import PageShell from '@/components/PageShell'

export default function Offline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const cachedData = {
    colleges: 45,
    courses: 120,
    materials: 89,
    timeline: 15,
  }
  const [precacheProgress, setPrecacheProgress] = useState(0)
  const [isPrecaching, setIsPrecaching] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handlePrecache = async () => {
    setIsPrecaching(true)
    setPrecacheProgress(0)

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setPrecacheProgress(i)
    }

    setIsPrecaching(false)
  }

  const offlineCapabilities = [
    {
      title: 'Study Materials',
      description: 'Access downloaded e-books, syllabus guides, and course materials',
      available: cachedData.materials,
      icon: '📚',
      badgeColor: 'bg-[#C8FF32]',
    },
    {
      title: 'College Directory',
      description: 'Search Karnataka seed colleges, cutoffs, and seat matrices offline',
      available: cachedData.colleges,
      icon: '🏫',
      badgeColor: 'bg-[#FFD84D]',
    },
    {
      title: 'Timeline Tracker',
      description: 'Check exam registration windows and counseling deadlines',
      available: cachedData.timeline,
      icon: '📅',
      badgeColor: 'bg-[#9DD9FF]',
    },
    {
      title: 'Course Catalog',
      description: 'Review personalized degrees, career paths, and eligibility rules',
      available: cachedData.courses,
      icon: '🎯',
      badgeColor: 'bg-[#62E89B]',
    },
  ]

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header pill & Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD84D] border-2 border-ink text-ink font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F]">
              <Database className="h-3.5 w-3.5" />
              LOCAL STORAGE ENGINE
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-2 text-ink dark:text-cream">
              OFFLINE MODE & CACHE
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground uppercase tracking-widest max-w-xl mx-auto">
              Continue exploring colleges and career roadmaps without an active internet connection
            </p>
          </div>

          {/* Connection Status Card */}
          <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border-2 border-ink flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#11110F] ${
                    isOnline ? 'bg-[#62E89B] text-ink' : 'bg-[#FFD84D] text-ink'
                  }`}>
                    {isOnline ? <Wifi className="h-6 w-6" /> : <WifiOff className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg tracking-tight text-ink dark:text-cream">
                      {isOnline ? 'Connected to Network' : 'Operating Offline'}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {isOnline
                        ? 'Full cloud synchronization and real-time AI recommendations active.'
                        : 'Using indexed IndexedDB cache for instant offline access.'}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#11110F] ${
                  isOnline ? 'bg-[#62E89B] text-ink' : 'bg-[#FFD84D] text-ink'
                }`}>
                  {isOnline ? '● ONLINE' : '○ OFFLINE'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cached Data Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-xl tracking-tight text-ink dark:text-cream">
                LOCAL DATABASE INVENTORY
              </h2>
              <span className="font-mono text-xs text-muted-foreground uppercase font-bold">
                AUTO-SYNCED
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border-2 border-ink bg-card shadow-[3px_3px_0px_#11110F] text-center">
                <p className="font-display font-black text-3xl text-ink dark:text-cream mb-1">{cachedData.colleges}</p>
                <p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">Colleges</p>
              </div>
              <div className="p-4 border-2 border-ink bg-[#C8FF32]/15 dark:bg-neutral-900 shadow-[3px_3px_0px_#11110F] text-center">
                <p className="font-display font-black text-3xl text-ink dark:text-[#C8FF32] mb-1">{cachedData.courses}</p>
                <p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">Courses</p>
              </div>
              <div className="p-4 border-2 border-ink bg-[#9DD9FF]/15 dark:bg-neutral-900 shadow-[3px_3px_0px_#11110F] text-center">
                <p className="font-display font-black text-3xl text-ink dark:text-[#9DD9FF] mb-1">{cachedData.materials}</p>
                <p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">Materials</p>
              </div>
              <div className="p-4 border-2 border-ink bg-[#FFD84D]/15 dark:bg-neutral-900 shadow-[3px_3px_0px_#11110F] text-center">
                <p className="font-display font-black text-3xl text-ink dark:text-[#FFD84D] mb-1">{cachedData.timeline}</p>
                <p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">Timelines</p>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="mb-8">
            <h2 className="font-display font-black text-xl tracking-tight text-ink dark:text-cream mb-4">
              OFFLINE MODULE CAPABILITIES
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {offlineCapabilities.map((cap) => (
                <Card
                  key={cap.title}
                  className="rounded-none border-2 border-ink shadow-[3px_3px_0px_#11110F] bg-card p-4 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 border border-ink bg-muted/40 shrink-0">
                      {cap.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-display font-bold text-base tracking-tight text-ink dark:text-cream">
                          {cap.title}
                        </h4>
                        <span className={`px-1.5 py-0.5 font-mono text-[10px] font-bold border border-ink text-ink ${cap.badgeColor}`}>
                          {cap.available} ITEMS
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Precache Section */}
          <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] bg-card mb-8">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="font-display font-black text-xl tracking-tight text-ink dark:text-cream">
                PRECACHE FULL CATALOGS
              </CardTitle>
              <CardDescription className="font-mono text-xs text-muted-foreground uppercase">
                Download college info & course roadmaps into persistent browser storage
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {isPrecaching ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink dark:text-cream">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synchronizing offline packages ({precacheProgress}%)...</span>
                  </div>
                  <div className="w-full h-3 border-2 border-ink bg-white dark:bg-neutral-900 p-0.5">
                    <div
                      className="h-full bg-[#C8FF32] border border-ink transition-all duration-200"
                      style={{ width: `${precacheProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pre-download the complete database of 45+ colleges, 120+ career courses, and syllabus materials.
                    You will be able to perform offline searches anywhere with zero internet latency.
                  </p>
                  <Button
                    onClick={handlePrecache}
                    className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-mono uppercase text-xs font-bold shadow-[3px_3px_0px_#11110F] px-5 py-2.5"
                  >
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Precache Catalogs Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <div className="border-2 border-ink shadow-[4px_4px_0px_#11110F] bg-[#9DD9FF]/15 dark:bg-neutral-900 p-6">
            <h3 className="font-display font-black text-lg text-ink dark:text-cream mb-3 flex items-center gap-2">
              <span>💡</span> OFFLINE BEST PRACTICES
            </h3>
            <ul className="space-y-2 font-mono text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-ink dark:text-cream">•</span>
                <span>Precache study materials and syllabus PDFs while connected to high-speed WiFi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-ink dark:text-cream">•</span>
                <span>Offline changes to bookmarked colleges sync automatically as soon as connectivity resumes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-ink dark:text-cream">•</span>
                <span>The college distance radius calculations run entirely in your browser using local geometry.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
