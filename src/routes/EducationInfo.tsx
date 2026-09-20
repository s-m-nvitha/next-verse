import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageShell } from '@/components/PageShell'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { saveEducationInfo } from '@/services/profileService'

const levelSchema = z.enum(['10th', '12th', 'UG', 'PG'])

const schema = z.object({
  level: levelSchema,
  tenth: z
    .object({
      school: z.string().min(2),
      board: z.string().min(2),
      percentage: z.coerce.number().min(0).max(100),
    })
    .optional(),
  twelfth: z
    .object({
      stream: z.enum(['PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'Vocational']),
      percentage: z.coerce.number().min(0).max(100),
    })
    .optional(),
  ug: z
    .object({
      degree: z.string().min(2),
      branch: z.string().min(2),
      cgpa: z.coerce.number().min(0).max(10),
    })
    .optional(),
  pg: z
    .object({
      degree: z.string().min(2),
      specialization: z.string().min(2),
    })
    .optional(),
})

type FormValues = z.infer<typeof schema>

type Level = z.infer<typeof levelSchema>

export default function EducationInfo() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const [isSaving, setIsSaving] = useState(false)

  const defaultValues = useMemo<FormValues>(() => {
    const existing = profile?.educationInfo
    const level = (existing?.level as Level) ?? (profile?.educationLevel as Level) ?? '12th'

    return {
      level,
      tenth: existing?.tenth,
      twelfth: existing?.twelfth,
      ug: existing?.ug,
      pg: existing?.pg,
    }
  }, [profile])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  const level = form.watch('level')

  const onSubmit = async (values: FormValues) => {
    if (!profile?.uid) return
    setIsSaving(true)
    try {
      const parsed = schema.parse(values)

      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      const educationLevel = parsed.level

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        await Promise.race([
          saveEducationInfo({ uid: profile.uid, educationInfo: parsed, educationLevel }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      setProfile({
        ...profile,
        educationLevel,
        educationInfo: parsed,
        updatedAt: new Date(),
      })

      navigate('/questionnaire')
    } catch (e) {
      const message = e instanceof z.ZodError ? e.errors.map((x) => x.message).join(', ') : e instanceof Error ? e.message : 'Failed to save education info'
      console.error(message)
      alert(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto py-6"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#C8FF32] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
            ACADEMIC PROFILE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Education Information
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Input your current academic standard and marks to establish recommendation thresholds.
          </p>
        </div>

        <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 sm:p-8">
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="level" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                Current Education Level
              </Label>
              <select
                id="level"
                className="w-full px-3 py-2 border-2 border-ink dark:border-white bg-white dark:bg-[#11110F] text-ink dark:text-cream font-mono text-xs shadow-[2px_2px_0px_#11110F] focus:outline-none"
                value={level}
                onChange={(e) => form.setValue('level', levelSchema.parse(e.target.value), { shouldValidate: true })}
              >
                <option value="10th">Class 10th (Secondary)</option>
                <option value="12th">Class 12th / PUC (Higher Secondary)</option>
                <option value="UG">Undergraduate (B.Tech / B.Sc / etc.)</option>
                <option value="PG">Postgraduate (M.Tech / MBA / etc.)</option>
              </select>
            </div>

            {level === '10th' ? (
              <div className="space-y-4 pt-4 border-t-2 border-ink/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#C8FF32] border border-ink" />
                  <h3 className="text-base font-black font-display uppercase tracking-wider text-ink dark:text-cream">
                    10th Standard Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="t_school" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Current School</Label>
                    <Input id="t_school" value={form.watch('tenth.school') ?? ''} onChange={(e) => form.setValue('tenth', { ...(form.getValues('tenth') ?? { school: '', board: '', percentage: 0 }), school: e.target.value }, { shouldValidate: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="t_board" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Board</Label>
                    <Input id="t_board" value={form.watch('tenth.board') ?? ''} onChange={(e) => form.setValue('tenth', { ...(form.getValues('tenth') ?? { school: '', board: '', percentage: 0 }), board: e.target.value }, { shouldValidate: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="t_pct" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Percentage (%)</Label>
                    <Input id="t_pct" type="number" value={form.watch('tenth.percentage') ?? ''} onChange={(e) => form.setValue('tenth', { ...(form.getValues('tenth') ?? { school: '', board: '', percentage: 0 }), percentage: Number(e.target.value) }, { shouldValidate: true })} />
                  </div>
                </div>
              </div>
            ) : null}

            {level === '12th' ? (
              <div className="space-y-4 pt-4 border-t-2 border-ink/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FFD84D] border border-ink" />
                  <h3 className="text-base font-black font-display uppercase tracking-wider text-ink dark:text-cream">
                    12th / PUC Stream Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="tw_stream" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Stream</Label>
                    <select
                      id="tw_stream"
                      className="w-full px-3 py-2 border-2 border-ink dark:border-white bg-white dark:bg-[#11110F] text-ink dark:text-cream font-mono text-xs shadow-[2px_2px_0px_#11110F] focus:outline-none"
                      value={form.watch('twelfth.stream') ?? 'PCM'}
                      onChange={(e) => form.setValue('twelfth', { ...(form.getValues('twelfth') ?? { stream: 'PCM', percentage: 0 }), stream: e.target.value as never }, { shouldValidate: true })}
                    >
                      <option value="PCM">PCM (Physics, Chem, Math)</option>
                      <option value="PCB">PCB (Physics, Chem, Bio)</option>
                      <option value="PCMB">PCMB (Both Math & Bio)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts / Humanities</option>
                      <option value="Vocational">Vocational / Polytechnic</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tw_pct" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Percentage (%)</Label>
                    <Input id="tw_pct" type="number" value={form.watch('twelfth.percentage') ?? ''} onChange={(e) => form.setValue('twelfth', { ...(form.getValues('twelfth') ?? { stream: 'PCM', percentage: 0 }), percentage: Number(e.target.value) }, { shouldValidate: true })} />
                  </div>
                </div>
              </div>
            ) : null}

            {level === 'UG' ? (
              <div className="space-y-4 pt-4 border-t-2 border-ink/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#9DD9FF] border border-ink" />
                  <h3 className="text-base font-black font-display uppercase tracking-wider text-ink dark:text-cream">
                    Undergraduate Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ug_degree" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Degree</Label>
                    <Input id="ug_degree" value={form.watch('ug.degree') ?? ''} onChange={(e) => form.setValue('ug', { ...(form.getValues('ug') ?? { degree: '', branch: '', cgpa: 0 }), degree: e.target.value }, { shouldValidate: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ug_branch" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Branch / Major</Label>
                    <Input id="ug_branch" value={form.watch('ug.branch') ?? ''} onChange={(e) => form.setValue('ug', { ...(form.getValues('ug') ?? { degree: '', branch: '', cgpa: 0 }), branch: e.target.value }, { shouldValidate: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ug_cgpa" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">CGPA / 10</Label>
                    <Input id="ug_cgpa" type="number" step="0.1" value={form.watch('ug.cgpa') ?? ''} onChange={(e) => form.setValue('ug', { ...(form.getValues('ug') ?? { degree: '', branch: '', cgpa: 0 }), cgpa: Number(e.target.value) }, { shouldValidate: true })} />
                  </div>
                </div>
              </div>
            ) : null}

            {level === 'PG' ? (
              <div className="space-y-4 pt-4 border-t-2 border-ink/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#62E89B] border border-ink" />
                  <h3 className="text-base font-black font-display uppercase tracking-wider text-ink dark:text-cream">
                    Postgraduate Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pg_degree" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">PG Degree</Label>
                    <Input id="pg_degree" value={form.watch('pg.degree') ?? ''} onChange={(e) => form.setValue('pg', { ...(form.getValues('pg') ?? { degree: '', specialization: '' }), degree: e.target.value }, { shouldValidate: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pg_spec" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Specialization</Label>
                    <Input id="pg_spec" value={form.watch('pg.specialization') ?? ''} onChange={(e) => form.setValue('pg', { ...(form.getValues('pg') ?? { degree: '', specialization: '' }), specialization: e.target.value }, { shouldValidate: true })} />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between items-center pt-4 border-t-2 border-ink/10 dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/student-details')}
                className="border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
              >
                Back to Profile
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !form.formState.isValid}
                className="border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
              >
                {isSaving ? 'Saving...' : 'Save & Continue →'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </PageShell>
  )
}

