import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/auth'
import { EmailAuth, GoogleAuth, UserProfileService } from '@/services/auth'
import { careerDomainIdSchema, userQuestionnaireSchema } from '@/lib/validators'
import { Mail } from 'lucide-react'
import { PageShell } from '@/components/PageShell'

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

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signUpSchema = z
  .object({
    displayName: z.string().min(1).max(50).optional(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const phoneSchema = z.object({
  phone: z.string().min(10),
})

type EmailForm = z.infer<typeof emailSchema>
type SignUpForm = z.infer<typeof signUpSchema>
type PhoneForm = z.infer<typeof phoneSchema>

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  })

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
  })

  const handleEmailSubmit = async (data: EmailForm) => {
    setIsLoading(true)
    setLoginError(null)
    try {
      const result = await EmailAuth.signIn(data.email, data.password)

      if (!result.success || !result.user) {
        throw new Error(result.error?.message || 'Login failed')
      }

      const firebaseUser = result.user
      setUser(firebaseUser)

      // Firestore profile lookup — give it 5 s max, never block navigation
      const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T | null> =>
        Promise.race([p, new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))])

      const profileRes = await withTimeout(UserProfileService.getUserProfile(firebaseUser.uid), 5000)
      if (profileRes != null && !profileRes.data) {
        // best-effort profile creation — don't await, don't block
        UserProfileService.createUserProfile(firebaseUser, { displayName: firebaseUser.displayName || undefined }).catch(() => {})
      }
      const refreshed = await withTimeout(UserProfileService.getUserProfile(firebaseUser.uid), 5000)
      if (refreshed?.data) {
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

      navigate('/student-details')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      console.error('Login error:', error)
      setLoginError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (data: SignUpForm) => {
    setIsLoading(true)
    try {
      const result = await EmailAuth.signUp(data.email, data.password, data.displayName)
      if (!result.success || !result.user) {
        throw new Error(result.error?.message || 'Sign up failed')
      }

      const firebaseUser = result.user
      setUser(firebaseUser)

      const profileRes = await UserProfileService.getUserProfile(firebaseUser.uid)
      if (!profileRes.data) {
        await UserProfileService.createUserProfile(firebaseUser, { displayName: firebaseUser.displayName || data.displayName || undefined })
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

      navigate('/student-details')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed'
      console.error('Sign up error:', error)
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const email = emailForm.getValues('email')
    if (!email) {
      alert('Please enter your email first.')
      return
    }
    setIsLoading(true)
    try {
      const res = await EmailAuth.resetPassword(email)
      if (!res.success) {
        throw new Error(res.error?.message || 'Failed to send reset email')
      }
      alert('Password reset email sent. Please check your inbox.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email'
      console.error('Reset password error:', error)
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await GoogleAuth.signIn()
      if (!result.success || !result.user) {
        throw new Error(result.error?.message || 'Google sign-in failed')
      }

      const firebaseUser = result.user
      setUser(firebaseUser)

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

      navigate('/student-details')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed'
      console.error('Google sign-in error:', error)
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneSubmit = async (_data: PhoneForm) => {
    setIsLoading(true)
    try {
      // Mock OTP sending
      setOtpSent(true)
    } catch (error) {
      console.error('Phone auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
          <div className="mb-8 text-center">
            <div className="inline-block bg-yellow-accent border-2 border-ink px-3 py-0.5 text-xs font-mono font-bold uppercase mb-3 text-ink shadow-[2px_2px_0px_#11110F]">
              STUDENT ACCESS
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-ink dark:text-[#F7F5EE]">
              SIGN IN TO NEXT VERSE
            </h1>
            <p className="text-xs md:text-sm font-medium text-ink/75 dark:text-[#F7F5EE]/75 mt-2 max-w-sm mx-auto">
              Access your personalized learning roadmap, saved colleges, and exam reminders.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('auth.signIn')}</CardTitle>
              <CardDescription>
                Choose your preferred sign-in method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="google">Google</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <Tabs defaultValue="sign-in" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="sign-in">{t('auth.signIn')}</TabsTrigger>
                      <TabsTrigger value="sign-up">{t('auth.signUp')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sign-in" className="space-y-4">
                      <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('auth.email')}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="student@example.com"
                            {...emailForm.register('email')}
                          />
                          {emailForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">{t('auth.password')}</Label>
                          <Input id="password" type="password" {...emailForm.register('password')} />
                          {emailForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{emailForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <button type="button" onClick={handleForgotPassword} className="text-sm text-primary hover:underline">
                            {t('auth.forgotPassword')}
                          </button>
                        </div>
                        {loginError && (
                          <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                            {loginError}
                          </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? t('common.loading') : t('auth.signIn')}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="sign-up" className="space-y-4">
                      <form onSubmit={signUpForm.handleSubmit(handleEmailSignUp)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">{t('auth.name')}</Label>
                          <Input id="displayName" type="text" placeholder="Your name" {...signUpForm.register('displayName')} />
                          {signUpForm.formState.errors.displayName && (
                            <p className="text-sm text-destructive">{signUpForm.formState.errors.displayName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signupEmail">{t('auth.email')}</Label>
                          <Input id="signupEmail" type="email" placeholder="student@example.com" {...signUpForm.register('email')} />
                          {signUpForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signupPassword">{t('auth.password')}</Label>
                          <Input id="signupPassword" type="password" {...signUpForm.register('password')} />
                          {signUpForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                          <Input id="confirmPassword" type="password" {...signUpForm.register('confirmPassword')} />
                          {signUpForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? t('common.loading') : t('auth.signUp')}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="google" className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Sign in with your Google account
                    </p>
                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {t('auth.google')}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="phone" className="space-y-4">
                  <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('auth.phone')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        {...phoneForm.register('phone')}
                      />
                      {phoneForm.formState.errors.phone && (
                        <p className="text-sm text-destructive">
                          {phoneForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                    {otpSent ? (
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                        />
                        <Button type="submit" className="w-full">
                          {t('auth.verifyOTP')}
                        </Button>
                      </div>
                    ) : (
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('common.loading') : t('auth.sendOTP')}
                      </Button>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
      </motion.div>
    </PageShell>
  )
}


