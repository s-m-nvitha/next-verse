import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { onAuthStateChanged, UserProfileService, signOutUser } from '@/services/auth'
import { careerDomainIdSchema, userQuestionnaireSchema } from '@/lib/validators'

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value
  if (value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>)) {
    const maybeFn = (value as { toDate?: unknown }).toDate
    if (typeof maybeFn === 'function') return (maybeFn as () => Date)()
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date()
}

const normalizeState = (value: unknown): unknown => {
  if (typeof value !== 'string') return value
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      try {
        setUser(firebaseUser)

        if (!firebaseUser) {
          setProfile(null)
          return
        }

        const profileRes = await UserProfileService.getUserProfile(firebaseUser.uid)
        if (!profileRes.data) {
          await UserProfileService.createUserProfile(firebaseUser, { displayName: firebaseUser.displayName || undefined })
        }

        const refreshed = await UserProfileService.getUserProfile(firebaseUser.uid)
        if (refreshed.data) {
          const createdAt = toDate(refreshed.data.createdAt)
          const updatedAt = toDate(refreshed.data.updatedAt)

          const rawQuestionnaire = (refreshed.data as unknown as { questionnaire?: unknown }).questionnaire
          const normalizedQuestionnaire =
            rawQuestionnaire && typeof rawQuestionnaire === 'object'
              ? {
                  ...(rawQuestionnaire as Record<string, unknown>),
                  location:
                    (rawQuestionnaire as Record<string, unknown>).location &&
                    typeof (rawQuestionnaire as Record<string, unknown>).location === 'object'
                      ? {
                          ...(((rawQuestionnaire as Record<string, unknown>).location as Record<string, unknown>) ?? {}),
                          state: normalizeState(
                            (((rawQuestionnaire as Record<string, unknown>).location as Record<string, unknown>) ?? {}).state
                          ),
                        }
                      : (rawQuestionnaire as Record<string, unknown>).location,
                  preferredStudyLocation:
                    (rawQuestionnaire as Record<string, unknown>).preferredStudyLocation &&
                    typeof (rawQuestionnaire as Record<string, unknown>).preferredStudyLocation === 'object'
                      ? {
                          ...(((rawQuestionnaire as Record<string, unknown>).preferredStudyLocation as Record<string, unknown>) ?? {}),
                          state: normalizeState(
                            (((rawQuestionnaire as Record<string, unknown>).preferredStudyLocation as Record<string, unknown>) ?? {})
                              .state
                          ),
                        }
                      : (rawQuestionnaire as Record<string, unknown>).preferredStudyLocation,
                }
              : rawQuestionnaire

          const questionnaireParsed = userQuestionnaireSchema.safeParse(normalizedQuestionnaire)
          const selectedCareerDomainParsed = careerDomainIdSchema.safeParse(refreshed.data.selectedCareerDomain)

          setProfile({
            uid: refreshed.data.uid,
            role: refreshed.data.role,
            language: refreshed.data.language,
            email: refreshed.data.email,
            displayName: refreshed.data.displayName,
            createdAt,
            updatedAt,
            educationLevel: refreshed.data.educationLevel,
            selectedCareerDomain: selectedCareerDomainParsed.success ? selectedCareerDomainParsed.data : undefined,
            questionnaire: questionnaireParsed.success ? questionnaireParsed.data : undefined,
          })
        }
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [setLoading, setProfile, setUser])

  return <>{children}</>
}

export async function logoutEverywhere() {
  await signOutUser()
  useAuthStore.getState().logout()
}
