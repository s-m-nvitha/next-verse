import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { PageShell } from '@/components/PageShell'
import { User, Bell, Shield, Save, Edit } from 'lucide-react'

export default function Settings() {
  const { profile, setProfile } = useAuthStore()
  const { theme, setTheme, language, setLanguage, isOfflineMode, setOfflineMode } = useUIStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })

  const handleSave = () => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        displayName: formData.displayName,
        email: formData.email,
        phone: formData.phone,
        updatedAt: new Date(),
      }
      setProfile(updatedProfile)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: profile?.displayName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    })
    setIsEditing(false)
  }

  const navigate = useNavigate()

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto py-6"
      >
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#C8FF32] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
            PREFERENCES & ACCOUNT
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            System Settings
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400">
            Manage your personal profile, notification frequencies, language localization, and security credentials.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff] p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-ink/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 border-2 border-ink bg-[#9DD9FF] shadow-[2px_2px_0px_#11110F]">
                  <User className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <h2 className="text-xl font-black font-display text-ink dark:text-cream">Profile Information</h2>
                  <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400">Update your student contact record</p>
                </div>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[2px_2px_0px_#11110F] text-xs"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-bold hover:bg-[#b8f020] shadow-[2px_2px_0px_#11110F] text-xs"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-2 border-ink dark:border-white text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="educationLevel" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Education Level</Label>
                <Input
                  id="educationLevel"
                  value={profile?.educationLevel || 'Not set'}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff] p-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-ink/10 dark:border-white/10">
              <div className="p-2 border-2 border-ink bg-[#FFD84D] shadow-[2px_2px_0px_#11110F]">
                <Bell className="h-5 w-5 text-ink" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-ink dark:text-cream">System Preferences</h2>
                <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400">Configure theme, language, and network cache</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Theme</Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Toggle light / dark brutalist palette</p>
                </div>
                <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                  <SelectTrigger className="w-36 border-2 border-ink dark:border-white font-mono text-xs shadow-[2px_2px_0px_#11110F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-ink bg-white dark:bg-[#11110F]">
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="language" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Language</Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Select interface language</p>
                </div>
                <Select value={language} onValueChange={(value: 'en' | 'hi' | 'kn') => setLanguage(value)}>
                  <SelectTrigger className="w-36 border-2 border-ink dark:border-white font-mono text-xs shadow-[2px_2px_0px_#11110F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-ink bg-white dark:bg-[#11110F]">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="offlineMode" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Offline Mode</Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Enable local IndexedDB caching</p>
                </div>
                <Switch
                  id="offlineMode"
                  checked={isOfflineMode}
                  onCheckedChange={setOfflineMode}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff] p-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-ink/10 dark:border-white/10">
              <div className="p-2 border-2 border-ink bg-[#62E89B] shadow-[2px_2px_0px_#11110F]">
                <Bell className="h-5 w-5 text-ink" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-ink dark:text-cream">Notification Reminders</h2>
                <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400">Stay ahead of admission cutoffs and scholarship windows</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="examReminders" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Exam Countdown Alerts</Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Get reminders 7 days and 24 hours before test dates</p>
                </div>
                <Switch id="examReminders" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="scholarshipUpdates" className="font-mono text-xs uppercase font-bold text-ink dark:text-cream">Scholarship Updates</Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Weekly digest of eligible Karnataka & Central grants</p>
                </div>
                <Switch id="scholarshipUpdates" defaultChecked />
              </div>
            </div>
          </div>

          {/* Privacy & Legal */}
          <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff] p-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-ink/10 dark:border-white/10">
              <div className="p-2 border-2 border-ink bg-[#C8FF32] shadow-[2px_2px_0px_#11110F]">
                <Shield className="h-5 w-5 text-ink" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-ink dark:text-cream">Legal & Security</h2>
                <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400">Terms of service, privacy guidelines, and compliance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[2px_2px_0px_#11110F] text-xs"
                onClick={() => navigate('/legal/privacy')}
              >
                Read Privacy Policy →
              </Button>
              <Button
                variant="outline"
                className="border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[2px_2px_0px_#11110F] text-xs"
                onClick={() => navigate('/legal/terms')}
              >
                Read Terms of Service →
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </PageShell>
  )
}
