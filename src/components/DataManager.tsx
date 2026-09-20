import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save } from 'lucide-react'

interface InterestData {
  id: string
  labelKey: string
  descriptionKey: string
  level: string
  subjects: string[]
  careerPaths: string[]
}

interface CourseData {
  id: string
  name: string
  level: string
  description: string
  subjects: string[]
  duration: string
  careerPaths: string[]
  nextSteps: string[]
}

interface ExamData {
  id: string
  name: string
  level: string
  description: string
  eligibility: string
  applicationWindow: {
    start: string
    end: string
  }
  examDate: string
  subjects: string[]
}

export default function DataManager() {
  const [activeTab, setActiveTab] = useState<'interests' | 'courses' | 'exams'>('interests')
  
  // Interest form state
  const [interestForm, setInterestForm] = useState<InterestData>({
    id: '',
    labelKey: '',
    descriptionKey: '',
    level: '10th',
    subjects: [],
    careerPaths: []
  })
  
  // Course form state
  const [courseForm, setCourseForm] = useState<CourseData>({
    id: '',
    name: '',
    level: '10th',
    description: '',
    subjects: [],
    duration: '',
    careerPaths: [],
    nextSteps: []
  })
  
  // Exam form state
  const [examForm, setExamForm] = useState<ExamData>({
    id: '',
    name: '',
    level: '10th',
    description: '',
    eligibility: '',
    applicationWindow: { start: '', end: '' },
    examDate: '',
    subjects: []
  })

  const [newSubject, setNewSubject] = useState('')
  const [newCareerPath, setNewCareerPath] = useState('')
  const [newNextStep, setNewNextStep] = useState('')

  const addSubject = (type: 'interests' | 'courses' | 'exams') => {
    if (!newSubject.trim()) return
    
    if (type === 'interests') {
      setInterestForm(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }))
    } else if (type === 'courses') {
      setCourseForm(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }))
    } else if (type === 'exams') {
      setExamForm(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }))
    }
    
    setNewSubject('')
  }

  const addCareerPath = (type: 'interests' | 'courses') => {
    if (!newCareerPath.trim()) return
    
    if (type === 'interests') {
      setInterestForm(prev => ({
        ...prev,
        careerPaths: [...prev.careerPaths, newCareerPath.trim()]
      }))
    } else if (type === 'courses') {
      setCourseForm(prev => ({
        ...prev,
        careerPaths: [...prev.careerPaths, newCareerPath.trim()]
      }))
    }
    
    setNewCareerPath('')
  }

  const addNextStep = () => {
    if (!newNextStep.trim()) return
    
    setCourseForm(prev => ({
      ...prev,
      nextSteps: [...prev.nextSteps, newNextStep.trim()]
    }))
    
    setNewNextStep('')
  }

  const removeItem = (type: 'subjects' | 'careerPaths' | 'nextSteps', index: number, formType: 'interests' | 'courses' | 'exams') => {
    if (formType === 'interests') {
      if (type === 'subjects') {
        setInterestForm(prev => ({
          ...prev,
          subjects: prev.subjects.filter((_, i) => i !== index)
        }))
      } else if (type === 'careerPaths') {
        setInterestForm(prev => ({
          ...prev,
          careerPaths: prev.careerPaths.filter((_, i) => i !== index)
        }))
      }
    } else if (formType === 'courses') {
      if (type === 'subjects') {
        setCourseForm(prev => ({
          ...prev,
          subjects: prev.subjects.filter((_, i) => i !== index)
        }))
      } else if (type === 'careerPaths') {
        setCourseForm(prev => ({
          ...prev,
          careerPaths: prev.careerPaths.filter((_, i) => i !== index)
        }))
      } else if (type === 'nextSteps') {
        setCourseForm(prev => ({
          ...prev,
          nextSteps: prev.nextSteps.filter((_, i) => i !== index)
        }))
      }
    } else if (formType === 'exams') {
      if (type === 'subjects') {
        setExamForm(prev => ({
          ...prev,
          subjects: prev.subjects.filter((_, i) => i !== index)
        }))
      }
    }
  }

  const generateId = (name: string, level: string) => {
    return `${name.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`
  }

  const saveInterest = () => {
    const interestData = {
      ...interestForm,
      id: interestForm.id || generateId(interestForm.labelKey, interestForm.level)
    }
    
    console.log('Saving interest:', interestData)
    // Here you would save to your data source
    alert('Interest saved! Check console for data structure.')
  }

  const saveCourse = () => {
    const courseData = {
      ...courseForm,
      id: courseForm.id || generateId(courseForm.name, courseForm.level)
    }
    
    console.log('Saving course:', courseData)
    alert('Course saved! Check console for data structure.')
  }

  const saveExam = () => {
    const examData = {
      ...examForm,
      id: examForm.id || generateId(examForm.name, examForm.level)
    }
    
    console.log('Saving exam:', examData)
    alert('Exam saved! Check console for data structure.')
  }

  const renderInterestForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Add New Interest</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="interest-id">ID</Label>
            <Input
              id="interest-id"
              value={interestForm.id}
              onChange={(e) => setInterestForm(prev => ({ ...prev, id: e.target.value }))}
              placeholder="science-10th"
            />
          </div>
          <div>
            <Label htmlFor="interest-level">Education Level</Label>
            <Select value={interestForm.level} onValueChange={(value) => setInterestForm(prev => ({ ...prev, level: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
                <SelectItem value="UG">Undergraduate</SelectItem>
                <SelectItem value="PG">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="interest-label">Label Key</Label>
          <Input
            id="interest-label"
            value={interestForm.labelKey}
            onChange={(e) => setInterestForm(prev => ({ ...prev, labelKey: e.target.value }))}
            placeholder="interests.science"
          />
        </div>
        
        <div>
          <Label htmlFor="interest-description">Description Key</Label>
          <Input
            id="interest-description"
            value={interestForm.descriptionKey}
            onChange={(e) => setInterestForm(prev => ({ ...prev, descriptionKey: e.target.value }))}
            placeholder="interests.scienceDescription"
          />
        </div>
        
        <div>
          <Label>Subjects</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add subject"
            />
            <Button onClick={() => addSubject('interests')} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interestForm.subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {subject}
                <button onClick={() => removeItem('subjects', index, 'interests')}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Career Paths</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newCareerPath}
              onChange={(e) => setNewCareerPath(e.target.value)}
              placeholder="Add career path"
            />
            <Button onClick={() => addCareerPath('interests')} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interestForm.careerPaths.map((path, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {path}
                <button onClick={() => removeItem('careerPaths', index, 'interests')}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <Button onClick={saveInterest} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Interest
        </Button>
      </CardContent>
    </Card>
  )

  const renderCourseForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="course-id">ID</Label>
            <Input
              id="course-id"
              value={courseForm.id}
              onChange={(e) => setCourseForm(prev => ({ ...prev, id: e.target.value }))}
              placeholder="science-foundation-10th"
            />
          </div>
          <div>
            <Label htmlFor="course-level">Education Level</Label>
            <Select value={courseForm.level} onValueChange={(value) => setCourseForm(prev => ({ ...prev, level: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
                <SelectItem value="UG">Undergraduate</SelectItem>
                <SelectItem value="PG">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="course-name">Course Name</Label>
          <Input
            id="course-name"
            value={courseForm.name}
            onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Science Foundation Course"
          />
        </div>
        
        <div>
          <Label htmlFor="course-description">Description</Label>
          <Textarea
            id="course-description"
            value={courseForm.description}
            onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Basic science concepts for 10th grade students"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="course-duration">Duration</Label>
            <Input
              id="course-duration"
              value={courseForm.duration}
              onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="1 year"
            />
          </div>
        </div>
        
        <div>
          <Label>Subjects</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add subject"
            />
            <Button onClick={() => addSubject('courses')} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {courseForm.subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {subject}
                <button onClick={() => removeItem('subjects', index, 'courses')}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Career Paths</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newCareerPath}
              onChange={(e) => setNewCareerPath(e.target.value)}
              placeholder="Add career path"
            />
            <Button onClick={() => addCareerPath('courses')} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {courseForm.careerPaths.map((path, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {path}
                <button onClick={() => removeItem('careerPaths', index, 'courses')}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Next Steps</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newNextStep}
              onChange={(e) => setNewNextStep(e.target.value)}
              placeholder="Add next step"
            />
            <Button onClick={addNextStep} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {courseForm.nextSteps.map((step, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {step}
                <button onClick={() => removeItem('nextSteps', index, 'courses')}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <Button onClick={saveCourse} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Course
        </Button>
      </CardContent>
    </Card>
  )

  const renderExamForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Add New Exam</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="exam-id">ID</Label>
            <Input
              id="exam-id"
              value={examForm.id}
              onChange={(e) => setExamForm(prev => ({ ...prev, id: e.target.value }))}
              placeholder="jee-main-12th"
            />
          </div>
          <div>
            <Label htmlFor="exam-level">Education Level</Label>
            <Select value={examForm.level} onValueChange={(value) => setExamForm(prev => ({ ...prev, level: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
                <SelectItem value="UG">Undergraduate</SelectItem>
                <SelectItem value="PG">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="exam-name">Exam Name</Label>
          <Input
            id="exam-name"
            value={examForm.name}
            onChange={(e) => setExamForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="JEE Main"
          />
        </div>
        
        <div>
          <Label htmlFor="exam-description">Description</Label>
          <Textarea
            id="exam-description"
            value={examForm.description}
            onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Joint Entrance Examination Main"
          />
        </div>
        
        <div>
          <Label htmlFor="exam-eligibility">Eligibility</Label>
          <Input
            id="exam-eligibility"
            value={examForm.eligibility}
            onChange={(e) => setExamForm(prev => ({ ...prev, eligibility: e.target.value }))}
            placeholder="Class 12 passed students"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="application-start">Application Start Date</Label>
            <Input
              id="application-start"
              type="date"
              value={examForm.applicationWindow.start}
              onChange={(e) => setExamForm(prev => ({ 
                ...prev, 
                applicationWindow: { ...prev.applicationWindow, start: e.target.value }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="application-end">Application End Date</Label>
            <Input
              id="application-end"
              type="date"
              value={examForm.applicationWindow.end}
              onChange={(e) => setExamForm(prev => ({ 
                ...prev, 
                applicationWindow: { ...prev.applicationWindow, end: e.target.value }
              }))}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="exam-date">Exam Date</Label>
          <Input
            id="exam-date"
            type="date"
            value={examForm.examDate}
            onChange={(e) => setExamForm(prev => ({ ...prev, examDate: e.target.value }))}
          />
        </div>
        
        <div>
          <Label>Subjects</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add subject"
            />
            <Button onClick={() => addSubject('exams')} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {examForm.subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {subject}
                <button onClick={() => removeItem('subjects', index, 'exams')}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <Button onClick={saveExam} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Exam
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Data Manager</h1>
        <p className="text-muted-foreground">Add and manage your custom interests, courses, and exams</p>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === 'interests' ? 'default' : 'outline'}
          onClick={() => setActiveTab('interests')}
        >
          Interests
        </Button>
        <Button
          variant={activeTab === 'courses' ? 'default' : 'outline'}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </Button>
        <Button
          variant={activeTab === 'exams' ? 'default' : 'outline'}
          onClick={() => setActiveTab('exams')}
        >
          Exams
        </Button>
      </div>
      
      {activeTab === 'interests' && renderInterestForm()}
      {activeTab === 'courses' && renderCourseForm()}
      {activeTab === 'exams' && renderExamForm()}
    </div>
  )
}
