import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Plus, Bell, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

// Mock timeline data
const timelineItems = [
  {
    id: '1',
    title: 'JEE Main Application',
    date: new Date('2025-01-15'),
    category: 'application' as const,
    examId: 'jee_main',
    description: 'Last date to submit JEE Main application form',
    link: 'https://jeemain.nta.ac.in',
    isUpcoming: true,
  },
  {
    id: '2',
    title: 'NEET Exam',
    date: new Date('2025-05-05'),
    category: 'exam' as const,
    examId: 'neet_ug',
    description: 'National Eligibility cum Entrance Test',
    link: 'https://neet.nta.nic.in',
    isUpcoming: true,
  },
  {
    id: '3',
    title: 'JEE Advanced',
    date: new Date('2025-06-02'),
    category: 'exam' as const,
    examId: 'jee_advanced',
    description: 'Joint Entrance Examination Advanced',
    link: 'https://jeeadv.ac.in',
    isUpcoming: true,
  },
  {
    id: '4',
    title: 'JEE Main Result',
    date: new Date('2024-12-15'),
    category: 'result' as const,
    examId: 'jee_main',
    description: 'JEE Main 2024 results declared',
    link: 'https://jeemain.nta.ac.in',
    isUpcoming: false,
  },
]

const categoryColors = {
  application: 'bg-[#9DD9FF] text-ink border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
  exam: 'bg-[#FF6B6B] text-white border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
  result: 'bg-[#C8FF32] text-ink border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
  counselling: 'bg-[#FFD84D] text-ink border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
}

export function TimelineWidget() {
  const { profile } = useAuthStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: '',
    description: '',
  })

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save to Firestore
    console.log('Adding reminder:', newReminder)
    setNewReminder({ title: '', date: '', description: '' })
    setShowAddForm(false)
  }

  const selectedExamIds = useMemo(() => new Set(profile?.selectedExamIds ?? []), [profile?.selectedExamIds])

  const visibleTimelineItems = useMemo(() => {
    return timelineItems.filter((item) => {
      const examId = (item as { examId?: string }).examId
      if (!examId) return true
      if (selectedExamIds.size === 0) return false
      return selectedExamIds.has(examId)
    })
  }, [selectedExamIds])

  const upcomingItems = visibleTimelineItems.filter(item => item.isUpcoming)
  const pastItems = visibleTimelineItems.filter(item => !item.isUpcoming)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-lg tracking-tight text-ink dark:text-cream">
          IMPORTANT TIMELINES & DEADLINES
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#11110F]"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Reminder
        </Button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="border-2 border-ink rounded-none shadow-[4px_4px_0px_#11110F] bg-card">
            <CardContent className="p-4">
              <form onSubmit={handleAddReminder} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-mono text-xs uppercase font-bold">Reminder Title</Label>
                  <Input
                    id="title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Application deadline"
                    className="border-2 border-ink rounded-none font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="font-mono text-xs uppercase font-bold">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                    className="border-2 border-ink rounded-none font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="font-mono text-xs uppercase font-bold">Description</Label>
                  <Input
                    id="description"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details"
                    className="border-2 border-ink rounded-none font-mono text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#11110F]"
                  >
                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                    Save Reminder
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-2 border-ink rounded-none font-mono text-xs font-bold uppercase shadow-[1px_1px_0px_#11110F]"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="font-mono text-xs font-black uppercase tracking-wider text-ink dark:text-cream mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#62E89B] border border-ink" />
            Upcoming Milestones
          </h4>
          <div className="space-y-3">
            {upcomingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-2 border-ink rounded-none shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#222] bg-card">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            {formatDate(item.date)}
                          </span>
                          <span className={categoryColors[item.category]}>
                            {item.category}
                          </span>
                        </div>
                        <h5 className="font-display font-black text-base tracking-tight text-ink dark:text-cream mb-1">
                          {item.title}
                        </h5>
                        <p className="text-xs text-muted-foreground font-mono leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {item.link && (
                          <Button variant="outline" size="sm" asChild className="h-8 px-2.5 border-2 border-ink rounded-none shadow-[1px_1px_0px_#11110F] hover:-translate-y-0.5">
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Portal
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {pastItems.length > 0 && (
          <div>
            <h4 className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-muted-foreground border border-ink" />
              Concluded Milestones
            </h4>
            <div className="space-y-3">
              {pastItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border border-ink/40 rounded-none bg-muted/20 opacity-70">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-mono text-xs text-muted-foreground">
                              {formatDate(item.date)}
                            </span>
                            <span className="border border-ink/40 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5">
                              {item.category}
                            </span>
                          </div>
                          <h5 className="font-display font-bold text-sm text-ink dark:text-cream mb-1">{item.title}</h5>
                          <p className="text-xs text-muted-foreground font-mono">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

