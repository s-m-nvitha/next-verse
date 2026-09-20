import { useEffect, useMemo, useState } from 'react'
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
import { genderSchema, karnatakaDistrictSchema } from '@/lib/validators'
import { saveStudentDetails } from '@/services/profileService'

const schema = z.object({
  name: z.string().min(2),
  dob: z.string().optional(),
  age: z.coerce.number().min(5).max(100).optional(),
  gender: genderSchema,
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  district: karnatakaDistrictSchema,
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
})

type FormValues = z.infer<typeof schema>

const districtLabels: Record<z.infer<typeof karnatakaDistrictSchema>, string> = {
  bengaluru_urban: 'Bengaluru Urban',
  bengaluru_rural: 'Bengaluru Rural',
  ramanagara: 'Ramanagara',
  kolar: 'Kolar',
  chikkaballapur: 'Chikkaballapur',
  mysuru: 'Mysuru',
  dakshina_kannada: 'Mangaluru (Dakshina Kannada)',
  mandya: 'Mandya',
  hassan: 'Hassan',
  kodagu: 'Kodagu',
  chamarajanagar: 'Chamarajanagar',
  udupi: 'Udupi',
  uttara_kannada: 'Uttara Kannada',
  chikkamagaluru: 'Chikkamagaluru',
  belagavi: 'Belagavi',
  dharwad: 'Hubballi-Dharwad (Dharwad)',
  bagalkote: 'Bagalkote',
  vijayanagara: 'Vijayanagara',
  gadag: 'Gadag',
  haveri: 'Haveri',
  shivamogga: 'Shivamogga',
  tumakuru: 'Tumakuru',
  ballari: 'Ballari',
  vijayapura: 'Vijayapura',
  davanagere: 'Davanagere',
  chitradurga: 'Chitradurga',
  koppal: 'Koppal',
  kalaburagi: 'Kalaburagi',
  bidar: 'Bidar',
  raichur: 'Raichur',
  yadgir: 'Yadgir',
}

export default function StudentDetails() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()

  const [isSaving, setIsSaving] = useState(false)
  const [, setIsDistrictLocked] = useState(false)

  const defaultValues = useMemo<FormValues>(() => {
    const existing = profile?.studentDetails
    return {
      name: existing?.name ?? profile?.displayName ?? '',
      dob: existing?.dob ?? '',
      age: existing?.age,
      gender: (existing?.gender as FormValues['gender']) ?? 'prefer_not_to_say',
      phone: existing?.phone ?? profile?.phone ?? '',
      email: existing?.email ?? profile?.email ?? '',
      district: (existing?.district as FormValues['district']) ?? 'bengaluru_urban',
      city: existing?.city ?? '',
      pincode: (existing as { pincode?: string } | undefined)?.pincode ?? '',
    }
  }, [profile])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  const watchedPincode = form.watch('pincode')

  useEffect(() => {
    let active = true

    const run = async () => {
      const raw = form.getValues('pincode')
      const pincode = raw?.trim()

      if (!pincode || pincode.length !== 6) {
        if (active) setIsDistrictLocked(false)
        return
      }

      const list = (await import('@/seed/karnatakaPincodes.json')).default as Array<{
        pincode: string
        district: FormValues['district']
        city?: string
      }>

      const found = list.find((x) => x.pincode === pincode)

      // Karnataka PIN codes use the 56, 57, 58 and 59 postal series.
      // The local seed file is only a partial list, so a valid Karnataka
      // PIN should not be rejected just because it is missing from the seed.
      const isKarnatakaPincode =
        /^\d{6}$/.test(pincode) &&
        ['56', '57', '58', '59'].some((prefix) => pincode.startsWith(prefix))

      if (!isKarnatakaPincode) {
        if (active) setIsDistrictLocked(false)

        form.setError('pincode', {
          type: 'validate',
          message: 'Please enter a valid Karnataka pincode.',
        })

        return
      }

      // Valid Karnataka PIN.
      form.clearErrors('pincode')

      // Auto-fill district/city only when the PIN exists in our local seed data.
      if (found) {
        form.setValue('district', found.district, {
          shouldValidate: true,
        })

        if (typeof found.city === 'string' && found.city.trim()) {
          form.setValue('city', found.city, {
            shouldValidate: true,
          })
        }
      }

      if (active) setIsDistrictLocked(false)
    }

    run()

    return () => {
      active = false
    }
  }, [form, watchedPincode])

  const onSubmit = async (values: FormValues) => {
    if (!profile?.uid) return
    setIsSaving(true)
    try {
      const parsed = schema.parse(values)

      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        // to prevent the UI from being stuck indefinitely.
        await Promise.race([
          saveStudentDetails({ uid: profile.uid, studentDetails: parsed }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      setProfile({
        ...profile,
        studentDetails: parsed,
        updatedAt: new Date(),
      })

      navigate('/level')
    } catch (e) {
      const message = e instanceof z.ZodError ? e.errors.map((x) => x.message).join(', ') : e instanceof Error ? e.message : 'Failed to save student details'
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
            STUDENT PROFILE SETUP
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Student Identification
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Provide your basic profile details and Karnataka locality for accurate quota calculations.
          </p>
        </div>

        <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 sm:p-8">
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-ink/10 dark:border-white/10">
                <span className="w-2.5 h-2.5 bg-[#C8FF32] border border-ink" />
                <h3 className="text-base font-black font-display uppercase tracking-wider text-ink dark:text-cream">
                  Personal Details
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    Full Name
                  </Label>
                  <Input id="name" {...form.register('name')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gender" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    Gender
                  </Label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 border-2 border-ink dark:border-white bg-white dark:bg-[#11110F] text-ink dark:text-cream font-mono text-xs shadow-[2px_2px_0px_#11110F] focus:outline-none"
                    value={form.watch('gender')}
                    onChange={(e) => form.setValue('gender', genderSchema.parse(e.target.value), { shouldValidate: true })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dob" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    Date of Birth (optional)
                  </Label>
                  <Input id="dob" type="date" {...form.register('dob')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="age" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    Age (optional)
                  </Label>
                  <Input id="age" type="number" {...form.register('age')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    Phone Number
                  </Label>
                  <Input id="phone" placeholder="10-digit number" {...form.register('phone')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    Email Address
                  </Label>
                  <Input id="email" type="email" {...form.register('email')} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-ink/10 dark:border-white/10">
                <span className="w-2.5 h-2.5 bg-[#FFD84D] border border-ink" />
                <h3 className="text-base font-black font-display uppercase tracking-wider text-ink dark:text-cream">
                  Location Details (Karnataka)
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pincode" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    Pincode
                  </Label>
                  <Input id="pincode" placeholder="6-digit pincode" {...form.register('pincode')} />
                  {form.formState.errors.pincode?.message ? (
                    <p className="text-xs font-mono text-red-600 dark:text-red-400 font-bold">{String(form.formState.errors.pincode.message)}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="district" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    District
                  </Label>
                  <select
                    id="district"
                    className="w-full px-3 py-2 border-2 border-ink dark:border-white bg-white dark:bg-[#11110F] text-ink dark:text-cream font-mono text-xs shadow-[2px_2px_0px_#11110F] focus:outline-none"
                    value={form.watch('district')}
                    onChange={(e) => {
                      setIsDistrictLocked(false)
                      form.setValue('district', karnatakaDistrictSchema.parse(e.target.value), { shouldValidate: true })
                    }}
                    disabled={false}
                  >
                    {(karnatakaDistrictSchema.options as Array<FormValues['district']>).map((d) => (
                      <option key={d} value={d}>
                        {districtLabels[d] ?? d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="city" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">
                    City / Town / Taluk
                  </Label>
                  <Input id="city" {...form.register('city')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t-2 border-ink/10 dark:border-white/10">
              <Button
                type="submit"
                disabled={isSaving || !form.formState.isValid}
                className="border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
              >
                {isSaving ? 'Saving Profile...' : 'Continue to Education Info →'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </PageShell>
  )
}
