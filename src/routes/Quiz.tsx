import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth'
import { useRecommendationsStore } from '@/store/recommendations'
import { educationLevelService } from '@/services/education-level-service'
import { EducationLevel } from '@/lib/validators'
import {
  getTopRecommendations,
  inferCourseFromSeed,
  saveRecommendationSnapshot,
  type EducationLevelKey,
  type Interest,
  type UserProfile,
} from '@/services/aiRecommendationService'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import InterestCard from '@/components/InterestCard'
import CourseCard from '@/components/CourseCard'
import ExamCard from '@/components/ExamCard'
import PageShell from '@/components/PageShell'

// Dynamic data will be loaded based on education level

type QuizStep = 'interests' | 'courses' | 'exams' | 'summary'

type QuizInterestOption = {
  id: string
  labelKey: string
  descriptionKey: string
  level: EducationLevelKey
}

type QuizSeedCourse = {
  id: string
  name: string
  level: EducationLevelKey
  exams?: string[]
}

type QuizSeedExam = {
  id: string
  name: string
  level: EducationLevelKey
}

type QuizEducationData = {
  interests: QuizInterestOption[]
  courses: QuizSeedCourse[]
  exams: QuizSeedExam[]
  colleges: unknown[]
  timeline: unknown[]
}

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    promise
      .then((v) => {
        clearTimeout(timer)
        resolve(v)
      })
      .catch((e: unknown) => {
        clearTimeout(timer)
        reject(e)
      })
  })
}

export default function Quiz() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { setRecommendations } = useRecommendationsStore()
  const [currentStep, setCurrentStep] = useState<QuizStep>('interests')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedExams, setSelectedExams] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [educationData, setEducationData] = useState<QuizEducationData | null>(null)
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Load education level specific data
  useEffect(() => {
    const loadEducationData = async () => {
      if (!profile?.questionnaire) {
        navigate('/questionnaire')
        return
      }

      if (!profile?.educationLevel) {
        console.log('No education level selected, redirecting to level selection')
        navigate('/level')
        return
      }

      if (!profile?.selectedCareerDomain) {
        navigate('/career-domains')
        return
      }

      try {
        setIsDataLoading(true)
        console.log('🔍 DEBUG: Loading data for level:', profile.educationLevel)
        const data = await educationLevelService.getDataForLevel(profile.educationLevel as EducationLevel)
        console.log('🔍 DEBUG: Data loaded successfully:', data)
        console.log('🔍 DEBUG: Interests count:', data?.interests?.length)
        setEducationData(data as QuizEducationData)
      } catch (error) {
        console.error('Error loading education data:', error)
        // Set empty data to prevent infinite loading
        setEducationData({
          interests: [],
          courses: [],
          exams: [],
          colleges: [],
          timeline: []
        })
      } finally {
        setIsDataLoading(false)
      }
    }

    loadEducationData()
  }, [profile?.educationLevel, profile?.questionnaire, profile?.selectedCareerDomain, navigate])

  if (isDataLoading) {
    return (
      <PageShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="border-2 border-ink bg-card p-8 shadow-[6px_6px_0px_#11110F] text-center max-w-sm">
            <div className="w-8 h-8 border-2 border-ink border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Loading data for {profile?.educationLevel}...
            </p>
          </div>
        </div>
      </PageShell>
    )
  }

  // Debug information
  console.log('Quiz component state:', {
    educationLevel: profile?.educationLevel,
    educationData,
    isDataLoading,
    currentStep
  })

  const steps = [
    { id: 'interests', title: 'Interests', progress: 25 },
    { id: 'courses', title: 'Courses', progress: 50 },
    { id: 'exams', title: 'Exams', progress: 75 },
    { id: 'summary', title: 'Summary', progress: 100 },
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const currentStepData = steps[currentStepIndex]

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const handleExamToggle = (examId: string) => {
    setSelectedExams(prev =>
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    )
  }

  const handleNext = () => {
    if (currentStep === 'interests') {
      setCurrentStep('courses')
    } else if (currentStep === 'courses') {
      setCurrentStep('exams')
    } else if (currentStep === 'exams') {
      setCurrentStep('summary')
    }
  }

  const handlePrevious = () => {
    if (currentStep === 'courses') {
      setCurrentStep('interests')
    } else if (currentStep === 'exams') {
      setCurrentStep('courses')
    } else if (currentStep === 'summary') {
      setCurrentStep('exams')
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Update profile with quiz results
      if (profile) {
        const interestWeights: Interest[] = selectedInterests
          .map((id) => id.trim().toLowerCase())
          .filter((id): id is Interest['id'] =>
            id === 'science' ||
            id === 'technology' ||
            id === 'medicine' ||
            id === 'arts' ||
            id === 'commerce' ||
            id === 'law' ||
            id === 'sports'
          )
          .map((id) => ({ id, weight: 1 }))

        const updatedProfile = {
          ...profile,
          interests: interestWeights,
          updatedAt: new Date(),
        }
        setProfile(updatedProfile)

        const educationLevel = updatedProfile.educationLevel as EducationLevelKey | undefined
        if (educationLevel) {
          const seedCourses = educationData?.courses ?? []

          const aiProfile: UserProfile = {
            uid: updatedProfile.uid,
            educationLevel,
            interests: interestWeights,
          }

          const courses = seedCourses.map(inferCourseFromSeed)

          const recommendations = await withTimeout(
            getTopRecommendations({
              profile: aiProfile,
              courses,
              limit: 10,
              includeBehaviorBoost: true,
            }),
            8000,
            'Generating recommendations'
          ).catch((e: unknown) => {
            console.error('Recommendation generation failed:', e)
            return []
          })

          setRecommendations(recommendations)

          if (recommendations.length > 0) {
            await withTimeout(
              saveRecommendationSnapshot({
                uid: updatedProfile.uid,
                educationLevel,
                interests: interestWeights,
                recommendations,
              }),
              6000,
              'Saving recommendation snapshot'
            ).catch((e: unknown) => {
              console.error('Saving recommendation snapshot failed:', e)
            })
          }
        }
      }

      // Simulate API call
      await withTimeout(new Promise<void>((resolve) => setTimeout(resolve, 1000)), 2000, 'Finalizing quiz')

      navigate('/recommendations')
    } catch (error) {
      console.error('Error completing quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'interests':
        return selectedInterests.length > 0
      case 'courses':
        return selectedCourses.length > 0
      case 'exams':
        return selectedExams.length > 0
      case 'summary':
        return true
      default:
        return false
    }
  }

  const renderInterests = () => {
    console.log('🔍 DEBUG: renderInterests called')
    console.log('🔍 DEBUG: educationData:', educationData)
    console.log('🔍 DEBUG: interests array:', educationData?.interests)
    console.log('🔍 DEBUG: interests length:', educationData?.interests?.length)
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('quiz.interests')}</h2>
          <p className="text-muted-foreground">{t('quiz.interestsDescription')}</p>
        </div>
        
        {educationData?.interests?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {educationData.interests.map((interest) => (
              <InterestCard
                key={interest.id}
                interest={interest}
                isSelected={selectedInterests.includes(interest.id)}
                onToggle={handleInterestToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Interests Data</h3>
              <p className="text-yellow-700 mb-4">The interests data is not loading properly.</p>
              <div className="text-left bg-white p-4 rounded border">
                <p className="text-sm font-medium mb-2">Debug Information:</p>
                <p className="text-xs text-gray-600">Education Data: {JSON.stringify(educationData, null, 2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/level')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {t('common.next')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('quiz.courses')}</h2>
        <p className="text-muted-foreground">Recommended courses based on your interests</p>
      </div>

      {educationData?.courses?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {educationData.courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={selectedCourses.includes(course.id)}
              onToggle={handleCourseToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Courses Data</h3>
            <p className="text-yellow-700 mb-4">The courses data is not loading properly.</p>
            <div className="text-left bg-white p-4 rounded border">
              <p className="text-sm font-medium mb-2">Debug Information:</p>
              <p className="text-xs text-gray-600">Education Data: {JSON.stringify(educationData, null, 2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.previous')}
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {t('common.next')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderExams = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('quiz.exams')}</h2>
        <p className="text-muted-foreground">Relevant entrance exams</p>
      </div>

      {educationData?.exams?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {educationData.exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isSelected={selectedExams.includes(exam.id)}
              onToggle={handleExamToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Exams Data</h3>
            <p className="text-yellow-700 mb-4">The exams data is not loading properly.</p>
            <div className="text-left bg-white p-4 rounded border">
              <p className="text-sm font-medium mb-2">Debug Information:</p>
              <p className="text-xs text-gray-600">Education Data: {JSON.stringify(educationData, null, 2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.previous')}
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {t('common.next')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('quiz.summary')}</h2>
        <p className="text-muted-foreground">Review your selections</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Selected Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interestId) => {
                const interest = educationData?.interests?.find((i: QuizInterestOption) => i.id === interestId)
                return (
                  <Badge key={interestId} variant="secondary">
                    {interest ? t(interest.labelKey) : interestId}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedCourses.map((courseId) => {
                const course = educationData?.courses?.find((c: QuizSeedCourse) => c.id === courseId)
                return (
                  <div key={courseId} className="flex items-center justify-between p-2 border rounded">
                    <span>{course?.name || courseId}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedExams.map((examId) => {
                const exam = educationData?.exams?.find((e: QuizSeedExam) => e.id === examId)
                return (
                  <div key={examId} className="flex items-center justify-between p-2 border rounded">
                    <span>{exam?.name || examId}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.previous')}
        </Button>
        <Button onClick={handleComplete} disabled={isLoading}>
          {isLoading ? t('common.loading') : 'Go to Dashboard'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header pill & Progress */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8FF32] border-2 border-ink text-ink font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#11110F]">
                STEP {currentStepIndex + 1} OF {steps.length} • {currentStepData.title.toUpperCase()}
              </span>
              <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {currentStepData.progress}% COMPLETE
              </span>
            </div>
            
            <div className="w-full h-3 border-2 border-ink bg-white dark:bg-neutral-900 p-0.5 shadow-[2px_2px_0px_#11110F]">
              <div
                className="h-full bg-[#C8FF32] border border-ink transition-all duration-300"
                style={{ width: `${currentStepData.progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'interests' && renderInterests()}
              {currentStep === 'courses' && renderCourses()}
              {currentStep === 'exams' && renderExams()}
              {currentStep === 'summary' && renderSummary()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </PageShell>
  )
}
