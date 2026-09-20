import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AppShell } from '@/components/AppShell'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Lazy load pages
const Landing = lazy(() => import('@/routes/Landing'))
const Login = lazy(() => import('@/routes/Login'))
const ParentLogin = lazy(() => import('@/routes/ParentLogin'))
const StudentDetails = lazy(() => import('@/routes/StudentDetails'))
const EducationInfo = lazy(() => import('@/routes/EducationInfo'))
const Questionnaire = lazy(() => import('@/routes/Questionnaire'))
const Domains = lazy(() => import('@/routes/Domains'))
const Courses = lazy(() => import('@/routes/Courses'))
const Exams = lazy(() => import('@/routes/Exams'))
const Colleges = lazy(() => import('@/routes/Colleges'))
const CareerDomains = lazy(() => import('@/routes/CareerDomains'))
const CareerAssessment = lazy(() => import('@/routes/CareerAssessment'))
const DomainAnalysis = lazy(() => import('@/routes/DomainAnalysis'))
const CourseRecommendations = lazy(() => import('@/routes/CourseRecommendations'))
const ExamRecommendations = lazy(() => import('@/routes/ExamRecommendations'))
const CollegeRecommendations = lazy(() => import('@/routes/CollegeRecommendations'))
const Level = lazy(() => import('@/routes/Level'))
const Quiz = lazy(() => import('@/routes/Quiz'))
const Recommendations = lazy(() => import('@/routes/Recommendations'))
const Dashboard = lazy(() => import('@/routes/Dashboard'))
const Offline = lazy(() => import('@/routes/Offline'))
const Settings = lazy(() => import('@/routes/Settings'))
const DataManager = lazy(() => import('@/routes/DataManager'))
const TextConverter = lazy(() => import('@/routes/TextConverter'))
const Privacy = lazy(() => import('@/routes/legal/Privacy'))
const Terms = lazy(() => import('@/routes/legal/Terms'))

function App() {
  return (
    <div className="min-h-screen bg-cream dark:bg-[#11110F] text-ink dark:text-[#F7F5EE] transition-colors">
      <AppShell>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/parent/login" element={<ParentLogin />} />
            <Route path="/student-details" element={<StudentDetails />} />
            <Route path="/education-info" element={<EducationInfo />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/level" element={<Level />} />
            <Route path="/career-domains" element={<CareerDomains />} />
            <Route path="/career-assessment" element={<CareerAssessment />} />
            <Route path="/domain-analysis" element={<DomainAnalysis />} />
            <Route path="/course-recommendations" element={<CourseRecommendations />} />
            <Route path="/exam-recommendations" element={<ExamRecommendations />} />
            <Route path="/college-recommendations" element={<CollegeRecommendations />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/offline" element={<Offline />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/data-manager" element={<DataManager />} />
            <Route path="/text-converter" element={<TextConverter />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
          </Routes>
        </Suspense>
      </AppShell>
      <Toaster />
    </div>
  )
}

export default App
