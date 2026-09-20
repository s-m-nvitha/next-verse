import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface ExamCardProps {
  exam: {
    id: string
    name: string
    description?: string
    eligibility?: string
    applicationWindow?: {
      start: string
      end: string
    }
    examDate?: string
    subjects?: string[]
    level: string
  }
  isSelected: boolean
  onToggle: (id: string) => void
}

export default function ExamCard({ exam, isSelected, onToggle }: ExamCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const isApplicationOpen = () => {
    if (!exam.applicationWindow) return false
    const now = new Date()
    const start = new Date(exam.applicationWindow.start)
    const end = new Date(exam.applicationWindow.end)
    return now >= start && now <= end
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-150 rounded-none border-2 border-ink ${
          isSelected
            ? 'bg-[#C8FF32] text-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#C8FF32]'
            : 'bg-card text-card-foreground shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#222] hover:shadow-[5px_5px_0px_#11110F]'
        }`}
        onClick={() => onToggle(exam.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Level & Status Badges */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 border border-ink bg-white/70 dark:bg-neutral-800 text-ink">
                  {exam.level}
                </span>
                {isApplicationOpen() && (
                  <Badge variant="default" className="text-[10px] font-mono rounded-none border border-ink bg-[#62E89B] text-ink">
                    <Calendar className="h-2.5 w-2.5 mr-1" />
                    APPLICATIONS OPEN
                  </Badge>
                )}
              </div>

              <h3 className="font-display font-black text-base tracking-tight leading-tight mb-1">
                {exam.name}
              </h3>
              <p className={`text-xs leading-relaxed mb-3 ${isSelected ? 'text-ink/80 font-medium' : 'text-muted-foreground'}`}>
                {exam.description}
              </p>
              
              {/* Eligibility */}
              {exam.eligibility && (
                <div className="mb-2">
                  <div className={`text-[10px] font-mono uppercase tracking-wider font-bold mb-0.5 ${isSelected ? 'text-ink/70' : 'text-muted-foreground'}`}>Eligibility:</div>
                  <div className={`text-[11px] font-mono leading-tight ${isSelected ? 'text-ink/90 font-medium' : 'text-muted-foreground'}`}>
                    {exam.eligibility}
                  </div>
                </div>
              )}
              
              {/* Application Window */}
              {exam.applicationWindow && (
                <div className="mb-2">
                  <div className={`text-[10px] font-mono uppercase tracking-wider font-bold mb-0.5 ${isSelected ? 'text-ink/70' : 'text-muted-foreground'}`}>Window:</div>
                  <div className={`text-[11px] font-mono ${isSelected ? 'text-ink/90 font-medium' : 'text-muted-foreground'}`}>
                    {formatDate(exam.applicationWindow.start)} - {formatDate(exam.applicationWindow.end)}
                  </div>
                </div>
              )}
              
              {/* Exam Date */}
              {exam.examDate && (
                <div className="mb-2">
                  <div className={`text-[10px] font-mono uppercase tracking-wider font-bold mb-0.5 ${isSelected ? 'text-ink/70' : 'text-muted-foreground'}`}>Exam Date:</div>
                  <div className={`text-[11px] font-mono font-bold ${isSelected ? 'text-ink' : 'text-foreground'}`}>
                    {formatDate(exam.examDate)}
                  </div>
                </div>
              )}
              
              {/* Subjects */}
              {exam.subjects && exam.subjects.length > 0 && (
                <div className="mb-2">
                  <div className={`text-[10px] font-mono uppercase tracking-wider font-bold mb-1 ${isSelected ? 'text-ink/70' : 'text-muted-foreground'}`}>Subjects:</div>
                  <div className="flex flex-wrap gap-1">
                    {exam.subjects.slice(0, 3).map((subject: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-[10px] font-mono rounded-none border border-ink/40">
                        {subject}
                      </Badge>
                    ))}
                    {exam.subjects.length > 3 && (
                      <Badge variant="outline" className="text-[10px] font-mono rounded-none border border-ink/40">
                        +{exam.subjects.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className={`w-6 h-6 rounded-none border-2 border-ink flex items-center justify-center shrink-0 transition-colors ${
              isSelected ? 'bg-ink text-cream' : 'bg-white dark:bg-neutral-800'
            }`}>
              {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
