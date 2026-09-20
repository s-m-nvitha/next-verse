import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useUpcomingExams } from '@/hooks/useFirestoreData'
import { formatDate } from '@/lib/utils'
import { loadSeedExams, type SeedExam } from '@/services/seedDataService'
import { Bell, BellRing } from 'lucide-react'
import { TimelineAPI } from '@/services/api'
import { toast } from '@/hooks/use-toast'
import { useExamRemindersStore } from '@/store/examReminders'
import { requestNotificationPermission, dispatchExamReminderNotification } from '@/services/notificationService'

const daysUntil = (date: Date) => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.ceil((startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24))
}

export function ExamCountdownWidget() {
  const { profile } = useAuthStore()
  const level = profile?.educationLevel
  const { isReminderActive, toggleReminder } = useExamRemindersStore()

  const [seedExams, setSeedExams] = useState<SeedExam[]>([])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!level) {
        if (mounted) setSeedExams([])
        return
      }
      const list = await loadSeedExams(level)
      if (mounted) setSeedExams(list)
    }
    run()
    return () => {
      mounted = false
    }
  }, [level])

  const { data } = useUpcomingExams((level ?? '10th') as '10th' | '12th' | 'UG' | 'PG')
  const upcoming = data?.data ?? []

  const selectedExamIds = useMemo(() => new Set(profile?.selectedExamIds ?? []), [profile?.selectedExamIds])

  const selectedSeed = useMemo(() => {
    if (!selectedExamIds.size) return []
    const byId = new Map(seedExams.map((e) => [e.id, e]))
    return Array.from(selectedExamIds)
      .map((id) => byId.get(id))
      .filter((x): x is SeedExam => Boolean(x))
  }, [seedExams, selectedExamIds])

  const upcomingById = useMemo(() => {
    const map = new Map<string, Date>()
    for (const e of upcoming) {
      if (!e?.id || !e.examDate) continue
      const examDate = e.examDate instanceof Date ? e.examDate : new Date(e.examDate as unknown as string)
      if (!Number.isNaN(examDate.getTime())) map.set(e.id, examDate)
    }
    return map
  }, [upcoming])

  if (!level) {
    return (
      <div className="text-sm text-muted-foreground">
        Select your education level to see exam countdowns.
      </div>
    )
  }

  if (!selectedExamIds.size) {
    return (
      <div className="text-sm text-muted-foreground">
        Select exams in the Exams section to enable countdown tracking.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {selectedSeed.slice(0, 6).map((exam) => {
        const examDate = upcomingById.get(exam.id) ?? null
        const d = examDate ? daysUntil(examDate) : null
        return (
          <Card key={exam.id} className="border-2 border-ink bg-card shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#222] rounded-none">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display font-black text-base truncate text-ink dark:text-cream">{exam.name}</div>
                  <div className="font-mono text-xs text-muted-foreground mt-0.5">
                    {examDate ? formatDate(examDate) : exam.eligibility ?? exam.duration ?? 'Date not available'}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`h-7 px-2 border-2 border-ink rounded-none transition-transform hover:-translate-y-0.5 ${
                      isReminderActive(exam.id)
                        ? 'bg-[#62E89B] text-ink font-black shadow-[2px_2px_0px_#11110F] hover:bg-[#62E89B]/90'
                        : 'bg-white dark:bg-neutral-800 text-ink dark:text-cream shadow-[1px_1px_0px_#11110F]'
                    }`}
                    onClick={async () => {
                      if (!level) return
                      const dateIso = examDate ? examDate.toISOString() : null
                      const { active, reminder } = toggleReminder({
                        examId: exam.id,
                        examName: exam.name,
                        examDate: dateIso,
                      })

                      if (!active) {
                        toast({
                          title: 'Reminder turned off',
                          description: `Disabled reminder for ${exam.name}.`,
                        })
                        return
                      }

                      // Request browser notification permission if available
                      const permission = await requestNotificationPermission()

                      if (permission === 'granted' && reminder) {
                        await dispatchExamReminderNotification(reminder)
                        toast({
                          title: reminder.isTba ? 'Announcement Reminder Set' : 'Exam Reminder Set',
                          description: reminder.isTba
                            ? `Date is TBA for ${exam.name}. Announcement alerts enabled.`
                            : `Reminder enabled for ${exam.name} (${formatDate(new Date(reminder.examDate!))}).`,
                        })
                      } else if (reminder) {
                        toast({
                          title: reminder.isTba ? 'In-App Announcement Reminder' : 'In-App Reminder Active',
                          description: reminder.isTba
                            ? `Date is TBA for ${exam.name}. We will track and alert you inside NEXT VERSE.`
                            : `Reminder active for ${exam.name} on ${formatDate(new Date(reminder.examDate!))}.`,
                        })
                      }

                      // Background sync to Timeline API if real date is available
                      if (examDate) {
                        void TimelineAPI.createUserReminder({
                          title: `${exam.name} Reminder`,
                          date: examDate,
                          level: level as '10th' | '12th' | 'UG' | 'PG',
                          description: `Exam date: ${formatDate(examDate)}`,
                          link: exam.website,
                        }).catch(() => {})
                      }
                    }}
                    aria-label={`${isReminderActive(exam.id) ? 'Disable reminder' : 'Set reminder'} for ${exam.name}`}
                    title={isReminderActive(exam.id) ? 'Click to turn off reminder' : 'Click to set reminder'}
                  >
                    {isReminderActive(exam.id) ? (
                      <>
                        <BellRing className="h-3 w-3 mr-1 text-ink animate-pulse" />
                        <span className="font-mono text-[10px] font-black uppercase text-ink tracking-tight">REMINDER ON</span>
                      </>
                    ) : (
                      <>
                        <Bell className="h-3 w-3 mr-1" />
                        <span className="font-mono text-[10px] font-bold uppercase">REMIND</span>
                      </>
                    )}
                  </Button>
                  {typeof d === 'number' ? (
                    <span className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-ink shadow-[1px_1px_0px_#11110F] ${
                      d <= 7 ? 'bg-[#FF6B6B] text-white' : d <= 30 ? 'bg-[#FFD84D] text-ink' : 'bg-[#C8FF32] text-ink'
                    }`}>
                      {d <= 0 ? 'TODAY' : `${d} DAYS`}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-ink bg-muted text-muted-foreground">
                      DATE TBA
                    </span>
                  )}
                  {exam.category && (
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-ink/40 bg-muted/40 text-muted-foreground">
                      {exam.category.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>

              {exam.eligibility ? (
                <div className="mt-2 text-xs font-mono text-muted-foreground border-t border-ink/10 pt-2">
                  <span className="font-bold uppercase">Eligibility:</span> {exam.eligibility}
                </div>
              ) : null}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
