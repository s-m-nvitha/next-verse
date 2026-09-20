import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface InterestCardProps {
  interest: {
    id: string
    name?: string
    description?: string
    labelKey?: string
    descriptionKey?: string
    subjects?: string[]
    careerPaths?: string[]
    level: string
  }
  isSelected: boolean
  onToggle: (id: string) => void
}

type InterestCardInterest = InterestCardProps['interest']

export default function InterestCard({ interest, isSelected, onToggle }: InterestCardProps) {
  // Create a clean display name
  const getDisplayName = (interest: InterestCardInterest) => {
    if (interest.name) return interest.name
    
    const rawName = interest.labelKey || interest.id || 'Unknown Interest'
    const cleanName = rawName
      .replace(/^interests\./, '')
      .replace(/\([^)]*\)/g, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase())
      .trim()
    
    return cleanName || 'Interest'
  }

  const getDisplayDescription = (interest: InterestCardInterest) => {
    if (interest.description) return interest.description
    
    const rawDesc = interest.descriptionKey || ''
    const cleanDesc = rawDesc
      .replace(/^interests\./, '')
      .replace(/Description$/, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase())
      .trim()
    
    return cleanDesc || 'Explore this area of interest'
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
        onClick={() => onToggle(interest.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 border border-ink bg-white/70 dark:bg-neutral-800 text-ink">
                  {interest.level || 'INTEREST'}
                </span>
              </div>
              <h3 className="font-display font-black text-base tracking-tight leading-tight mb-1">
                {getDisplayName(interest)}
              </h3>
              <p className={`text-xs leading-relaxed mb-3 ${isSelected ? 'text-ink/80 font-medium' : 'text-muted-foreground'}`}>
                {getDisplayDescription(interest)}
              </p>
              
              {interest.subjects && interest.subjects.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {interest.subjects.slice(0, 3).map((subject: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-[10px] font-mono rounded-none border border-ink/40">
                      {subject}
                    </Badge>
                  ))}
                  {interest.subjects.length > 3 && (
                    <Badge variant="outline" className="text-[10px] font-mono rounded-none border border-ink/40">
                      +{interest.subjects.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              {interest.careerPaths && interest.careerPaths.length > 0 && (
                <div className={`text-[11px] font-mono ${isSelected ? 'text-ink/90 font-semibold' : 'text-muted-foreground'}`}>
                  <span className="font-bold uppercase tracking-wider">Paths:</span> {interest.careerPaths.slice(0, 2).join(', ')}
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
