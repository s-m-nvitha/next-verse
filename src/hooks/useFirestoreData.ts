import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UserAPI,
  EducationDataAPI,
  InterestsAPI,
  CoursesAPI,
  ExamsAPI,
  CollegesAPI,
  RecommendationsAPI,
  TimelineAPI,
  SavedItemsAPI,
  ScholarshipsAPI,
  JobsAPI,
  StudyMaterialsAPI,
} from '@/services/api'
import { useAuthStore } from '@/store/auth'
import type { FirestoreEducationData, FirestoreRecommendation, FirestoreSavedItem, FirestoreUserProfile } from '@/lib/firestore-schemas'

// User hooks
export const useUserProfile = (uid: string) => {
  return useQuery({
    queryKey: ['userProfile', uid],
    queryFn: () => UserAPI.getUserProfile(uid),
    enabled: !!uid,
  })
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: Partial<FirestoreUserProfile> }) => 
      UserAPI.updateUserProfile(uid, data),
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', uid] })
    },
  })
}

// Education data hooks
export const useEducationData = (uid: string) => {
  return useQuery({
    queryKey: ['educationData', uid],
    queryFn: () => EducationDataAPI.getEducationData(uid),
    enabled: !!uid,
  })
}

export const useSaveEducationData = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Omit<FirestoreEducationData, 'createdAt' | 'updatedAt'>) => EducationDataAPI.saveEducationData(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['educationData', data.uid] })
    },
  })
}

// Interests hooks
export const useInterestsByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['interests', level],
    queryFn: () => InterestsAPI.getInterestsByLevel(level),
    enabled: !!level,
  })
}

// Courses hooks
export const useCoursesByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['courses', level],
    queryFn: () => CoursesAPI.getCoursesByLevel(level),
    enabled: !!level,
  })
}

export const useCoursesByInterests = (interests: string[]) => {
  return useQuery({
    queryKey: ['courses', 'interests', interests],
    queryFn: () => CoursesAPI.getCoursesByInterests(interests),
    enabled: interests.length > 0,
  })
}

// Exams hooks
export const useExamsByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['exams', level],
    queryFn: () => ExamsAPI.getExamsByLevel(level),
    enabled: !!level,
  })
}

export const useUpcomingExams = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['exams', 'upcoming', level],
    queryFn: () => ExamsAPI.getUpcomingExams(level),
    enabled: !!level,
  })
}

// Colleges hooks
export const useCollegesByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['colleges', level],
    queryFn: () => CollegesAPI.getCollegesByLevel(level),
    enabled: !!level,
  })
}

export const useCollegesByLocation = (lat: number, lng: number, radius?: number) => {
  return useQuery({
    queryKey: ['colleges', 'location', lat, lng, radius],
    queryFn: () => CollegesAPI.getCollegesByLocation(lat, lng, radius),
    enabled: !!lat && !!lng,
  })
}

// Recommendations hooks
export const useRecommendations = (uid: string) => {
  return useQuery({
    queryKey: ['recommendations', uid],
    queryFn: () => RecommendationsAPI.getRecommendations(uid),
    enabled: !!uid,
  })
}

export const useSaveRecommendation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Omit<FirestoreRecommendation, 'id' | 'createdAt' | 'updatedAt'>) => RecommendationsAPI.saveRecommendation(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['recommendations', data.uid] })
    },
  })
}

// Timeline hooks
export const useTimelineByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['timeline', level],
    queryFn: () => TimelineAPI.getTimelineByLevel(level),
    enabled: !!level,
  })
}

export const useUpcomingTimeline = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['timeline', 'upcoming', level],
    queryFn: () => TimelineAPI.getUpcomingTimeline(level),
    enabled: !!level,
  })
}

// Saved items hooks
export const useSavedItems = (uid: string, type?: string) => {
  return useQuery({
    queryKey: ['savedItems', uid, type],
    queryFn: () => SavedItemsAPI.getSavedItems(uid, type),
    enabled: !!uid,
  })
}

export const useSaveItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Omit<FirestoreSavedItem, 'id' | 'createdAt' | 'updatedAt'>) => SavedItemsAPI.saveItem(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['savedItems', data.uid] })
    },
  })
}

export const useRemoveSavedItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (itemId: string) => SavedItemsAPI.removeSavedItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedItems'] })
    },
  })
}

// Scholarships hooks
export const useScholarshipsByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['scholarships', level],
    queryFn: () => ScholarshipsAPI.getScholarshipsByLevel(level),
    enabled: !!level,
  })
}

// Jobs hooks
export const useJobsByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['jobs', level],
    queryFn: () => JobsAPI.getJobsByLevel(level),
    enabled: !!level,
  })
}

// Study materials hooks
export const useStudyMaterialsByLevel = (level: '10th' | '12th' | 'UG' | 'PG') => {
  return useQuery({
    queryKey: ['studyMaterials', level],
    queryFn: () => StudyMaterialsAPI.getStudyMaterialsByLevel(level),
    enabled: !!level,
  })
}

// Custom hook for education level specific data
export const useEducationLevelData = (level: '10th' | '12th' | 'UG' | 'PG') => {
  const interests = useInterestsByLevel(level)
  const courses = useCoursesByLevel(level)
  const exams = useExamsByLevel(level)
  const colleges = useCollegesByLevel(level)
  const timeline = useTimelineByLevel(level)
  const scholarships = useScholarshipsByLevel(level)
  const jobs = useJobsByLevel(level)
  const studyMaterials = useStudyMaterialsByLevel(level)

  return {
    interests,
    courses,
    exams,
    colleges,
    timeline,
    scholarships,
    jobs,
    studyMaterials,
    isLoading: interests.isLoading || courses.isLoading || exams.isLoading || 
               colleges.isLoading || timeline.isLoading || scholarships.isLoading || 
               jobs.isLoading || studyMaterials.isLoading,
    error: interests.error || courses.error || exams.error || 
           colleges.error || timeline.error || scholarships.error || 
           jobs.error || studyMaterials.error,
  }
}

// Custom hook for user dashboard data
export const useUserDashboard = (uid: string) => {
  const { profile } = useAuthStore()
  const educationData = useEducationData(uid)
  const recommendations = useRecommendations(uid)
  const savedItems = useSavedItems(uid)

  const effectiveLevel = (profile?.educationLevel ?? '10th') as '10th' | '12th' | 'UG' | 'PG'
  const levelData = useEducationLevelData(effectiveLevel)

  return {
    educationData,
    recommendations,
    savedItems,
    levelData,
    isLoading: educationData.isLoading || recommendations.isLoading || savedItems.isLoading || 
              levelData.isLoading,
    error: educationData.error || recommendations.error || savedItems.error || 
           levelData.error,
  }
}
