import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/auth'
import { ArrowLeft, Users } from 'lucide-react'
import { PageShell } from '@/components/PageShell'

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type EmailForm = z.infer<typeof emailSchema>

export default function ParentLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  })

  const handleEmailSubmit = async (data: EmailForm) => {
    setIsLoading(true)
    try {
      // Mock authentication for parent
      const mockUser = {
        uid: 'parent-mock-uid',
        email: data.email,
        displayName: 'Parent User',
        photoURL: null,
      } as any

      setUser(mockUser)
      setProfile({
        uid: mockUser.uid,
        role: 'parent',
        displayName: mockUser.displayName,
        email: mockUser.email,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Mock Google authentication for parent
      const mockUser = {
        uid: 'parent-google-mock-uid',
        email: 'parent@gmail.com',
        displayName: 'Google Parent',
        photoURL: 'https://via.placeholder.com/40',
      } as any

      setUser(mockUser)
      setProfile({
        uid: mockUser.uid,
        role: 'parent',
        displayName: mockUser.displayName,
        email: mockUser.email,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Google sign-in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageShell>
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <div className="mb-6">
            <Button
              variant="outline"
              asChild
              className="mb-4 border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]"
            >
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('common.back')}
              </Link>
            </Button>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F]">
                PARENT ACCESS
              </div>
              <h1 className="text-3xl font-black font-display tracking-tight text-ink dark:text-cream">
                Parent Portal
              </h1>
              <p className="text-sm font-sans text-neutral-600 dark:text-neutral-400 mt-1">
                {t('landing.parentDescription')}
              </p>
            </div>
          </div>

          <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 sm:p-8">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 border-2 border-ink dark:border-white bg-neutral-100 dark:bg-neutral-900 p-1">
                <TabsTrigger value="email" className="font-mono text-xs font-bold uppercase data-[state=active]:bg-[#C8FF32] data-[state=active]:text-ink">
                  Email
                </TabsTrigger>
                <TabsTrigger value="google" className="font-mono text-xs font-bold uppercase data-[state=active]:bg-[#C8FF32] data-[state=active]:text-ink">
                  Google
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="parent@example.com"
                      {...emailForm.register('email')}
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-xs font-mono text-red-600 dark:text-red-400 font-bold">
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                      {t('auth.password')}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...emailForm.register('password')}
                    />
                    {emailForm.formState.errors.password && (
                      <p className="text-xs font-mono text-red-600 dark:text-red-400 font-bold">
                        {emailForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff] active:translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? t('common.loading') : t('auth.signIn')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase">
                    Authenticate using official parent account
                  </p>
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full border-2 border-ink dark:border-white bg-white dark:bg-[#11110F] text-ink dark:text-cream font-bold hover:bg-neutral-100 shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
                    disabled={isLoading}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {t('auth.google')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
