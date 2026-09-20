import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '@/components/PageShell'

export default function Terms() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD84D] border-2 border-ink text-ink font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F]">
              <FileText className="h-3.5 w-3.5" />
              TERMS OF SERVICE PROTOCOL
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-2 text-ink dark:text-cream">
              TERMS OF SERVICE
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground uppercase tracking-widest max-w-xl mx-auto">
              Terms and conditions governing your access and usage of the NEXT VERSE platform
            </p>
          </div>

          <div className="space-y-6">
            {/* Acceptance */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#C8FF32] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <FileText className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 01</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">Acceptance of Terms</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  By accessing and utilizing the NEXT VERSE portal, you agree to comply with these terms, our privacy policy,
                  and all applicable statutory education guidelines in India. If you do not agree to these terms,
                  please discontinue access immediately.
                </p>
                <div className="border border-ink/20 bg-muted/20 p-3 font-mono text-xs">
                  <strong>Latest Revision:</strong> September 2026 • Version 2.4.0
                </div>
              </CardContent>
            </Card>

            {/* License & Scope */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#9DD9FF] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <Scale className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 02</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">Permitted Use & License</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-ink/20 bg-muted/20">
                    <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-2 text-ink dark:text-cream">Authorized Usage</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                      <li>• Personal academic exploration & aptitude evaluation</li>
                      <li>• Saving & exporting college roadmaps for counseling</li>
                      <li>• Caching course catalogs for offline study use</li>
                      <li>• Sharing recommendation summaries with mentors</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-ink/20 bg-muted/20">
                    <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-2 text-ink dark:text-cream">Prohibited Activities</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                      <li>• Scraping college or exam catalogs for commercial resale</li>
                      <li>• Attempting unauthorized API payload manipulation</li>
                      <li>• Submitting automated artificial traffic against ML models</li>
                      <li>• Impersonating other students or educational bodies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Disclaimer */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#FFD84D] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <AlertTriangle className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 03</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">Educational Guidance Disclaimer</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  NEXT VERSE recommendations are generated using machine learning models trained on historical career patterns,
                  Aptitude heuristics, and Karnataka AISHE college datasets. These recommendations are intended strictly for guidance
                  and self-discovery. We do not guarantee admission to any college or examination cutoff qualifications.
                </p>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-[#62E89B] flex items-center justify-center shadow-[2px_2px_0px_#11110F]">
                    <CheckCircle className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Section 04</span>
                    <CardTitle className="font-display font-black text-xl tracking-tight">Student Responsibilities</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Students are responsible for verifying official college admission deadlines and eligibility rules directly with
                  relevant governing authorities (KEA, COMEDK, NTA, etc.) prior to formal seat counseling.
                </p>
              </CardContent>
            </Card>

            {/* Legal Notice Box */}
            <div className="border-2 border-ink shadow-[4px_4px_0px_#11110F] bg-[#FFD84D]/15 dark:bg-neutral-900 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-5 w-5 text-ink dark:text-cream" />
                <h3 className="font-display font-black text-lg text-ink dark:text-cream">
                  LEGAL & OMBUDSMAN CONTACT
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed mb-3">
                For notices of terms infringement, licensing queries, or institutional partnerships:
              </p>
              <p className="font-mono text-xs font-bold text-ink dark:text-cream">
                legal@visionvault.education • Bharat Builds Tour / First Commit Hackathon
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
