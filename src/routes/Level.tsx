import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PageShell } from '@/components/PageShell'
import { useAuthStore } from '@/store/auth'
import { EducationLevel } from '@/lib/validators'
import { ArrowRight } from 'lucide-react'

export default function Level() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleLevelSelect = async (levelId: string = '12th') => {
    setIsLoading(true)

    try {
      if (profile) {
        const updatedProfile = {
          ...profile,
          educationLevel: levelId as EducationLevel,
          updatedAt: new Date(),
        }
        setProfile(updatedProfile)
      }

      navigate('/questionnaire')
    } catch (error) {
      console.error('Error updating education level:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#C8FF32] border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase mb-4 text-ink shadow-[2px_2px_0px_#11110F]">
            STEP 1 OF 5 • EDUCATIONAL STATUS
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-ink dark:text-[#F7F5EE] mb-3">
            WHAT IS YOUR CURRENT LEVEL?
          </h1>
          <p className="text-sm md:text-base font-medium text-ink/80 dark:text-[#F7F5EE]/80 max-w-xl mx-auto">
            This powers NEXT VERSE's recommendation engine to match state admissions, degree courses, and competitive entrance exams.
          </p>
        </div>

        {/* ONE Large Neo-Brutalist Content Section */}
        <div className="max-w-2xl mx-auto border-3 border-ink dark:border-[#F7F5EE] bg-white dark:bg-[#1A1A17] p-6 sm:p-8 shadow-[8px_8px_0px_#11110F] dark:shadow-[8px_8px_0px_#F7F5EE]">
          {/* Badge at top of card */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 border-2 border-ink dark:border-[#F7F5EE] bg-[#FFD84D] text-ink shadow-[2px_2px_0px_#11110F]">
              HIGHER SECONDARY
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-[#F7F5EE]/70">
              CURRENT LEVEL → 12TH / PUC
            </span>
          </div>

          {/* Prominent Centered Illustration */}
          <div className="w-full flex justify-center mb-8 border-2 border-ink dark:border-[#F7F5EE] bg-[#FDFBF7] dark:bg-[#11110F] p-4 sm:p-6 shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff]">
            <img
              src="/images/level-12th-hero.jpg"
              alt="12th Grade and PUC Students Illustration"
              className="w-full max-h-[340px] object-contain mx-auto"
            />
          </div>

          {/* Content & Heading */}
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-ink dark:text-[#F7F5EE] tracking-tight">
              12TH GRADE / PUC
            </h2>
            <p className="text-sm sm:text-base font-medium text-ink/80 dark:text-[#F7F5EE]/80 max-w-lg mx-auto">
              PUC / 12th Standard — choose your stream and discover your next step after 12th.
            </p>
          </div>

          {/* Neo-Brutalist SELECT Button */}
          <div className="pt-4 border-t-2 border-ink/15 dark:border-white/15 flex justify-center">
            <Button
              onClick={() => handleLevelSelect('12th')}
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-6 border-3 border-ink dark:border-white bg-[#C8FF32] text-ink font-heading font-black text-lg uppercase tracking-wide hover:bg-[#b8f020] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#11110F] transition-all flex items-center justify-center gap-3"
            >
              <span>{isLoading ? 'LOADING...' : 'SELECT'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-10 pt-6 border-t border-ink/20 dark:border-white/20">
          <p className="font-mono text-xs font-bold text-ink/60 dark:text-[#F7F5EE]/60 uppercase">
            ⚡ Accurate curriculum routing tailored for students in Karnataka and Pan-India
          </p>
        </div>
      </motion.div>
    </PageShell>
  )
}
