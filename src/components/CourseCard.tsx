import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, ExternalLink, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface CourseCardProps {
  course: {
    id: string
    name: string
    description?: string
    subjects?: string[]
    duration?: string
    careerPaths?: string[]
    nextSteps?: string[]
    syllabusUrl?: string
    videoUrl?: string
    level: string
  }
  isSelected: boolean
  onToggle: (id: string) => void
}

export default function CourseCard({ course, isSelected, onToggle }: CourseCardProps) {
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
        onClick={() => onToggle(course.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Duration and Level */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 border border-ink bg-white/70 dark:bg-neutral-800 text-ink">
                  {course.level}
                </span>
                {course.duration && (
                  <Badge variant="outline" className="text-[10px] font-mono rounded-none border border-ink/50 bg-background/50">
                    <Clock className="h-2.5 w-2.5 mr-1" />
                    {course.duration}
                  </Badge>
                )}
              </div>

              <h3 className="font-display font-black text-base tracking-tight leading-tight mb-1">
                {course.name}
              </h3>
              <p className={`text-xs leading-relaxed mb-3 ${isSelected ? 'text-ink/80 font-medium' : 'text-muted-foreground'}`}>
                {course.description}
              </p>
              
              {/* Subjects */}
              {course.subjects && course.subjects.length > 0 && (
                <div className="mb-2">
                  <div className={`text-[10px] font-mono uppercase tracking-wider font-bold mb-1 ${isSelected ? 'text-ink/70' : 'text-muted-foreground'}`}>Subjects:</div>
                  <div className="flex flex-wrap gap-1">
                    {course.subjects.slice(0, 3).map((subject: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-[10px] font-mono rounded-none border border-ink/40">
                        {subject}
                      </Badge>
                    ))}
                    {course.subjects.length > 3 && (
                      <Badge variant="outline" className="text-[10px] font-mono rounded-none border border-ink/40">
                        +{course.subjects.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Career Paths */}
              {course.careerPaths && course.careerPaths.length > 0 && (
                <div className="mb-2">
                  <div className={`text-[11px] font-mono ${isSelected ? 'text-ink/90 font-semibold' : 'text-muted-foreground'}`}>
                    <span className="font-bold uppercase tracking-wider">Careers:</span> {course.careerPaths.slice(0, 2).join(', ')}
                    {course.careerPaths.length > 2 && ` +${course.careerPaths.length - 2} more`}
                  </div>
                </div>
              )}
              
              {/* Next Steps */}
              {course.nextSteps && course.nextSteps.length > 0 && (
                <div className="mb-2">
                  <div className={`text-[11px] font-mono ${isSelected ? 'text-ink/90 font-semibold' : 'text-muted-foreground'}`}>
                    <span className="font-bold uppercase tracking-wider">Next:</span> {course.nextSteps.slice(0, 2).join(', ')}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {course.syllabusUrl && (
                  <button 
                    type="button"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-1 border border-ink bg-white dark:bg-neutral-800 text-ink dark:text-cream shadow-[2px_2px_0px_#11110F] hover:-translate-y-0.5 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(course.syllabusUrl, '_blank')
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Syllabus
                  </button>
                )}
                {course.videoUrl && (
                  <button 
                    type="button"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-1 border border-ink bg-white dark:bg-neutral-800 text-ink dark:text-cream shadow-[2px_2px_0px_#11110F] hover:-translate-y-0.5 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(course.videoUrl, '_blank')
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Video
                  </button>
                )}
              </div>
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
