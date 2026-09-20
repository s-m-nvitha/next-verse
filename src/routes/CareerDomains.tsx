import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { CAREER_DOMAINS, type CareerDomainId } from '@/data/careerMapping'
import { saveSelectedCareerDomain } from '@/services/profileService'
import { PageShell } from '@/components/PageShell'

export default function CareerDomains() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const [savingId, setSavingId] = useState<CareerDomainId | null>(null)

  const selected = useMemo(() => profile?.selectedCareerDomain as CareerDomainId | undefined, [profile?.selectedCareerDomain])

  const handleSelect = async (id: CareerDomainId) => {
    if (!profile?.uid) return
    setSavingId(id)
    try {
      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        await Promise.race([
          saveSelectedCareerDomain({ uid: profile.uid, selectedCareerDomain: id }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      setProfile({
        ...profile,
        selectedCareerDomain: id,
        updatedAt: new Date(),
      })
      navigate('/quiz')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save career domain'
      console.error(message)
      alert(message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#C8FF32] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
            CAREER BLUEPRINT
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Choose Your Career Domain
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Pick your target track to unlock curriculum paths, exams, and verified next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAREER_DOMAINS.map((d, index) => {
            const active = selected === d.id
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div
                  className={`border-2 border-ink dark:border-white p-6 transition-all duration-150 ${
                    active
                      ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#C8FF32] -translate-y-1'
                      : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-xl font-black font-display text-ink dark:text-cream">{d.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-sans">{d.description}</p>
                    </div>
                    {active ? (
                      <span className="font-mono text-xs font-bold uppercase bg-[#C8FF32] text-ink border-2 border-ink px-2.5 py-0.5 shadow-[1.5px_1.5px_0px_#11110F] shrink-0">
                        Selected
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-4 pt-3 border-t-2 border-ink/10 dark:border-white/10">
                    <div>
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        Skills Required
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {d.skillsRequired.map((s) => (
                          <span
                            key={s}
                            className="font-mono text-xs border border-ink dark:border-white bg-white dark:bg-neutral-900 text-ink dark:text-cream px-2 py-0.5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                        Typical Paths
                      </p>
                      <div className="space-y-1">
                        {d.typicalPaths.map((p) => (
                          <p key={p} className="text-xs font-sans text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#C8FF32] border border-ink shrink-0" /> {p}
                          </p>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-bold hover:bg-[#b8f020] shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff] active:translate-y-0.5"
                      onClick={() => handleSelect(d.id)}
                      disabled={savingId !== null}
                    >
                      {savingId === d.id ? 'Saving...' : active ? 'Selected Track' : 'Select Track →'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </PageShell>
  )
}
