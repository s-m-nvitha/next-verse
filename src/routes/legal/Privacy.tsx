import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Eye, Lock, Database, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '@/components/PageShell'

export default function Privacy() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-ink bg-white dark:bg-neutral-800 text-ink dark:text-cream font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#11110F] hover:-translate-y-0.5 transition-transform"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Settings
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9DD9FF] border-2 border-ink text-ink font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F]">
              <Shield className="h-3.5 w-3.5" />
              DATA PROTECTION & PRIVACY PROTOCOL
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-2 text-ink dark:text-cream">
              PRIVACY POLICY
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground uppercase tracking-widest max-w-xl mx-auto">
              How NEXT VERSE collects, processes, and safeguards student telemetry and career records
            </p>
          </div>

          <div className="space-y-6">
            {/* Information We Collect */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#C8FF32] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <Shield className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 01</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">Information We Collect</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-ink/20 bg-muted/20">
                    <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-2 text-ink dark:text-cream">Provided by Students</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                      <li>• Name, email, and authentication credentials</li>
                      <li>• Current academic qualification (10th/12th/UG/PG)</li>
                      <li>• Aptitude questionnaire choices and weighted ratings</li>
                      <li>• Bookmarked colleges, target exams, and careers</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-ink/20 bg-muted/20">
                    <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-2 text-ink dark:text-cream">Device & Telemetry</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                      <li>• Browser type, operating system, and viewport</li>
                      <li>• Optional device geolocation (for college radius calculations)</li>
                      <li>• Local cache status and IndexedDB synchronization state</li>
                      <li>• Performance metrics during ML recommendation inference</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#9DD9FF] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <Eye className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 02</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">How We Use Your Information</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-ink/20 bg-muted/20">
                    <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-2 text-ink dark:text-cream">Core Counseling Engine</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                      <li>• Executing Random Forest inference for domain matching</li>
                      <li>• Ranking degree courses matching student profile</li>
                      <li>• Calculating geographic proximity to college campuses</li>
                      <li>• Delivering real-time timeline countdown alerts</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-ink/20 bg-muted/20">
                    <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-2 text-ink dark:text-cream">Service Quality</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                      <li>• Improving accuracy of ML aptitude weights</li>
                      <li>• Expanding catalog coverage across 4,800+ colleges</li>
                      <li>• Enabling resilient offline caching capabilities</li>
                      <li>• Preventing unauthorized system tampering or abuse</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#FFD84D] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <Lock className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 03</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">Data Security & Storage</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Student profiles and recommendation logs are protected using AWS DynamoDB with encryption-at-rest (AES-256)
                  and HTTPS transport security via Amazon CloudFront / API Gateway. We adhere to zero-commercialization principles:
                  student data is never sold, rented, or brokered to commercial coaching centers.
                </p>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#62E89B] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <Database className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 04</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">Your Rights & Controls</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  You maintain full sovereignty over your data. You may retake the aptitude assessment at any time,
                  clear local browser cache via the Settings tab, or request complete account erasure by contacting our compliance officer.
                </p>
              </CardContent>
            </Card>

            {/* Contact Notice */}
            <div className="border-2 border-ink shadow-[4px_4px_0px_#11110F] bg-[#C8FF32]/15 dark:bg-neutral-900 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-5 w-5 text-ink dark:text-cream" />
                <h3 className="font-display font-black text-lg text-ink dark:text-cream">
                  DATA GOVERNANCE DESK
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed mb-3">
                For questions regarding data processing or rights enforcement under DPDP Act regulations, email our privacy desk:
              </p>
              <p className="font-mono text-xs font-bold text-ink dark:text-cream">
                privacy@visionvault.education • Bangalore, Karnataka, India
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
