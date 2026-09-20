import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Lock,
  Target,
  Compass,
  Briefcase,
  TrendingUp,
  Code,
  BarChart3,
  CheckCircle2,
  ListOrdered,
  Info,
} from 'lucide-react'

export default function Landing() {
  useTranslation()

  // Interactive Live Hero Qualification Simulator state
  const [heroPreview, setHeroPreview] = useState({
    qual: '12th Grade / PUC',
    focus: 'KCET, JEE Main, NEET',
    domain: 'Engineering & Medicine',
  })

  // Category Tab Selector state
  const [activeTab, setActiveTab] = useState<'domains' | 'exams' | 'colleges'>('domains')

  return (
    <div className="w-full flex flex-col flex-grow">
      {/* ── 1. Hero Section ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Hero Left: Copy & Main CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start">
            {/* Top Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 bg-yellow-accent nb-border px-3 py-1 mb-6 text-xs font-mono font-bold uppercase tracking-wider nb-shadow-sm text-ink"
            >
              <Sparkles className="w-4 h-4 text-ink" />
              <span>YOUR FUTURE. PERSONALIZED.</span>
            </motion.div>

            {/* Main Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-ink dark:text-[#F7F5EE] leading-[0.95] tracking-tight mb-6"
            >
              ONE-STOP <br />
              <span className="bg-lime-accent text-ink px-2 border-2 border-ink inline-block transform -rotate-1 my-1">
                CAREER &
              </span> <br />
              EDUCATION ADVISER.
            </motion.h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg font-medium text-ink/90 dark:text-[#F7F5EE]/90 max-w-xl mb-8 leading-relaxed">
              Personalized guidance for courses, competitive exams, colleges, scholarships, and jobs — tailored to your exact goals, skills, and aspirations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <Link
                to="/login"
                className="nb-btn bg-lime-accent hover:bg-lime-300 text-ink text-base md:text-lg px-8 py-4 flex items-center justify-center gap-3 w-full sm:w-auto shadow-brutal hover:shadow-brutal-hover active:shadow-brutal-active"
              >
                <span>GET STARTED NOW</span>
                <ArrowUpRight className="w-6 h-6" />
              </Link>
              
              <Link
                to="/domains"
                className="nb-btn bg-white dark:bg-[#1A1A17] hover:bg-cream dark:hover:bg-[#2A2A25] text-ink dark:text-[#F7F5EE] text-base md:text-lg px-6 py-4 text-center w-full sm:w-auto shadow-brutal hover:shadow-brutal-hover active:shadow-brutal-active"
              >
                EXPLORE DOMAINS
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t-2 border-ink/20 dark:border-white/20 w-full flex flex-wrap items-center gap-4 text-xs font-mono font-bold uppercase">
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#1A1A17] border border-ink dark:border-[#F7F5EE] px-2.5 py-1 text-ink dark:text-[#F7F5EE]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>TRUSTED GUIDANCE</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#1A1A17] border border-ink dark:border-[#F7F5EE] px-2.5 py-1 text-ink dark:text-[#F7F5EE]">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>AI POWERED ENGINE</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#1A1A17] border border-ink dark:border-[#F7F5EE] px-2.5 py-1 text-ink dark:text-[#F7F5EE]">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>SECURE & PRIVATE</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive Dashboard Bento Card Preview */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="nb-card p-5 bg-white dark:bg-[#1A1A17] relative flex-grow flex flex-col justify-between">
              {/* Top Bar Decorator */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-ink dark:border-[#F7F5EE]/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full border border-ink" />
                  <span className="w-3 h-3 bg-yellow-400 rounded-full border border-ink" />
                  <span className="w-3 h-3 bg-green-500 rounded-full border border-ink" />
                </div>
                <span className="font-mono text-xs font-bold bg-blue-accent border border-ink text-ink px-2 py-0.5">
                  LIVE ADVISER DEMO
                </span>
              </div>

              {/* Live Interactive Card Content */}
              <div className="space-y-4">
                <div className="bg-cream dark:bg-[#22221E] border-2 border-ink dark:border-[#F7F5EE] p-3">
                  <div className="text-[10px] font-mono font-bold text-ink/70 dark:text-[#F7F5EE]/70 uppercase">
                    TARGET DOMAIN MATCH
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-heading font-extrabold text-lg text-ink dark:text-[#F7F5EE]">
                      AI & Computer Science
                    </span>
                    <span className="bg-lime-accent border border-ink text-ink text-xs font-mono font-bold px-2 py-0.5">
                      98% FIT
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-[#22221E] border-2 border-ink dark:border-[#F7F5EE] p-3">
                    <div className="text-[10px] font-mono font-bold text-ink/70 dark:text-[#F7F5EE]/70">TOP COLLEGE</div>
                    <div className="font-heading font-bold text-sm mt-0.5 text-ink dark:text-[#F7F5EE]">RV College of Engg.</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1">✓ Bangalore, KA</div>
                  </div>
                  <div className="bg-white dark:bg-[#22221E] border-2 border-ink dark:border-[#F7F5EE] p-3">
                    <div className="text-[10px] font-mono font-bold text-ink/70 dark:text-[#F7F5EE]/70">NEXT EXAM</div>
                    <div className="font-heading font-bold text-sm mt-0.5 text-ink dark:text-[#F7F5EE]">KCET / COMEDK</div>
                    <div className="text-xs text-rose-600 font-semibold mt-1">⏰ 18 Days Left</div>
                  </div>
                </div>

                {/* Interactive Simulator Widget */}
                <div className="border-2 border-ink dark:border-[#F7F5EE] p-3 bg-yellow-accent/20 dark:bg-yellow-accent/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading font-bold text-xs text-ink dark:text-[#F7F5EE]">
                      TRY YOUR HIGHEST QUALIFICATION:
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setHeroPreview({
                          qual: '12th Grade / PUC',
                          focus: 'KCET, JEE Main, NEET',
                          domain: 'Engineering & Medicine',
                        })
                      }
                      className={`nb-btn text-[11px] py-1 transition-all ${
                        heroPreview.qual.includes('12th') ? 'bg-yellow-accent text-ink' : 'bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE]'
                      }`}
                    >
                      PUC / 12th
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroPreview({
                          qual: 'Undergraduate',
                          focus: 'GATE, CAT, PGCET',
                          domain: 'M.Tech, MBA, Data AI',
                        })
                      }
                      className={`nb-btn text-[11px] py-1 transition-all ${
                        heroPreview.qual.includes('Undergraduate') ? 'bg-blue-accent text-ink' : 'bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE]'
                      }`}
                    >
                      UG Grad
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroPreview({
                          qual: 'Diploma Holder',
                          focus: 'DCET, Lateral Entry',
                          domain: 'Polytechnic Engg',
                        })
                      }
                      className={`nb-btn text-[11px] py-1 transition-all ${
                        heroPreview.qual.includes('Diploma') ? 'bg-mint-accent text-ink' : 'bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE]'
                      }`}
                    >
                      Diploma
                    </button>
                  </div>
                  <div className="mt-3 text-xs font-mono bg-white dark:bg-[#11110F] p-2 border border-ink dark:border-[#F7F5EE] text-ink dark:text-[#F7F5EE]">
                    🎓 Status: <strong className="font-bold text-ink dark:text-lime-accent">{heroPreview.qual}</strong> Selected.<br />
                    🎯 Suggested Focus: <strong className="font-bold text-ink dark:text-lime-accent">{heroPreview.focus}</strong>
                  </div>
                </div>
              </div>

              {/* Footer Pill Badge */}
              <div className="mt-4 pt-3 border-t-2 border-ink dark:border-[#F7F5EE]/20 flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1 text-ink dark:text-[#F7F5EE]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Match Active
                </span>
                <span className="text-ink/60 dark:text-[#F7F5EE]/60">UPDATED TODAY</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. Four Pillars Feature Grid Section ─────────────────────────── */}
      <section id="pillars" className="border-y-2 border-ink dark:border-[#F7F5EE] bg-white dark:bg-[#151512] py-16 px-4 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b-2 border-ink dark:border-[#F7F5EE] gap-4">
            <div>
              <div className="inline-block bg-lime-accent border border-ink px-3 py-0.5 font-mono text-xs font-bold mb-2 text-ink">
                CORE CAPABILITIES
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-ink dark:text-[#F7F5EE]">
                FOUR PILLARS OF YOUR SUCCESS
              </h2>
            </div>
            <p className="font-medium text-ink/80 dark:text-[#F7F5EE]/80 max-w-md text-sm md:text-base">
              Comprehensive guidance tailored to every milestone of your academic and career progression.
            </p>
          </div>

          {/* Bento Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Personalized */}
            <div className="nb-card nb-card-hover p-6 bg-cream dark:bg-[#1E1E1B] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-lime-accent nb-border flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform text-ink">
                  <Target className="w-6 h-6 text-ink" />
                </div>
                <span className="font-mono text-xs font-bold text-ink/60 dark:text-[#F7F5EE]/60 uppercase">
                  01 / TAILORED
                </span>
                <h3 className="text-2xl font-black text-ink dark:text-[#F7F5EE] mt-1 mb-3">
                  Personalized
                </h3>
                <p className="text-sm text-ink/80 dark:text-[#F7F5EE]/80 leading-relaxed font-medium">
                  Get recommendations tailored specifically to your individual goals, current skill sets, budget, and long-term interests.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-ink dark:border-[#F7F5EE] flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-lime-accent border border-ink text-ink px-2 py-0.5">
                  SMART ENGINE
                </span>
                <ArrowRight className="w-5 h-5 text-ink dark:text-[#F7F5EE]" />
              </div>
            </div>

            {/* Card 2: Explore */}
            <div className="nb-card nb-card-hover p-6 bg-cream dark:bg-[#1E1E1B] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-blue-accent nb-border flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform text-ink">
                  <Compass className="w-6 h-6 text-ink" />
                </div>
                <span className="font-mono text-xs font-bold text-ink/60 dark:text-[#F7F5EE]/60 uppercase">
                  02 / DISCOVER
                </span>
                <h3 className="text-2xl font-black text-ink dark:text-[#F7F5EE] mt-1 mb-3">
                  Explore
                </h3>
                <p className="text-sm text-ink/80 dark:text-[#F7F5EE]/80 leading-relaxed font-medium">
                  Discover top-tier courses, accredited colleges across Karnataka & India, entrance exams, and verified scholarships.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-ink dark:border-[#F7F5EE] flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-blue-accent border border-ink text-ink px-2 py-0.5">
                  CURATED HUB
                </span>
                <ArrowRight className="w-5 h-5 text-ink dark:text-[#F7F5EE]" />
              </div>
            </div>

            {/* Card 3: Career Ready */}
            <div className="nb-card nb-card-hover p-6 bg-cream dark:bg-[#1E1E1B] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-yellow-accent nb-border flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform text-ink">
                  <Briefcase className="w-6 h-6 text-ink" />
                </div>
                <span className="font-mono text-xs font-bold text-ink/60 dark:text-[#F7F5EE]/60 uppercase">
                  03 / ACTIONABLE
                </span>
                <h3 className="text-2xl font-black text-ink dark:text-[#F7F5EE] mt-1 mb-3">
                  Career Ready
                </h3>
                <p className="text-sm text-ink/80 dark:text-[#F7F5EE]/80 leading-relaxed font-medium">
                  Find the right high-growth career path, industry skill roadmaps, and internship opportunities that fit your future.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-ink dark:border-[#F7F5EE] flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-yellow-accent border border-ink text-ink px-2 py-0.5">
                  ROADMAPS
                </span>
                <ArrowRight className="w-5 h-5 text-ink dark:text-[#F7F5EE]" />
              </div>
            </div>

            {/* Card 4: Stay Ahead */}
            <div className="nb-card nb-card-hover p-6 bg-cream dark:bg-[#1E1E1B] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-mint-accent nb-border flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform text-ink">
                  <TrendingUp className="w-6 h-6 text-ink" />
                </div>
                <span className="font-mono text-xs font-bold text-ink/60 dark:text-[#F7F5EE]/60 uppercase">
                  04 / INSIGHTS
                </span>
                <h3 className="text-2xl font-black text-ink dark:text-[#F7F5EE] mt-1 mb-3">
                  Stay Ahead
                </h3>
                <p className="text-sm text-ink/80 dark:text-[#F7F5EE]/80 leading-relaxed font-medium">
                  Real-time admission trends, exam deadlines, syllabus updates, and expert mentorship to ensure you never miss a deadline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-ink dark:border-[#F7F5EE] flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-mint-accent border border-ink text-ink px-2 py-0.5">
                  REAL-TIME
                </span>
                <ArrowRight className="w-5 h-5 text-ink dark:text-[#F7F5EE]" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Category Filter Explorer Section ──────────────────────────── */}
      <section id="explorer" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="nb-card bg-white dark:bg-[#1A1A17] p-6 lg:p-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b-2 border-ink dark:border-[#F7F5EE] gap-4">
            <div>
              <div className="inline-block bg-yellow-accent border border-ink px-3 py-0.5 font-mono text-xs font-bold mb-2 text-ink">
                INTERACTIVE CATALOG
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-ink dark:text-[#F7F5EE]">
                EXPLORE BY CATEGORY
              </h2>
            </div>

            {/* Category Tab Selector Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('domains')}
                className={`nb-btn px-4 py-2 text-sm font-heading font-extrabold uppercase transition-all ${
                  activeTab === 'domains'
                    ? 'bg-lime-accent text-ink'
                    : 'bg-cream dark:bg-[#22221E] text-ink dark:text-[#F7F5EE]'
                }`}
              >
                DOMAINS (PERSONALIZED)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('exams')}
                className={`nb-btn px-4 py-2 text-sm font-heading font-extrabold uppercase transition-all ${
                  activeTab === 'exams'
                    ? 'bg-yellow-accent text-ink'
                    : 'bg-cream dark:bg-[#22221E] text-ink dark:text-[#F7F5EE]'
                }`}
              >
                EXAMS (TRACK & REMIND)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('colleges')}
                className={`nb-btn px-4 py-2 text-sm font-heading font-extrabold uppercase transition-all ${
                  activeTab === 'colleges'
                    ? 'bg-mint-accent text-ink'
                    : 'bg-cream dark:bg-[#22221E] text-ink dark:text-[#F7F5EE]'
                }`}
              >
                COLLEGES (KARNATAKA)
              </button>
            </div>
          </div>

          {/* Tab 1: Domains */}
          {activeTab === 'domains' && (
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-yellow-accent border border-ink text-xs font-mono font-bold px-2 py-0.5 text-ink">
                    HIGH DEMAND
                  </span>
                  <Code className="w-5 h-5 text-ink dark:text-[#F7F5EE]" />
                </div>
                <h4 className="font-heading font-black text-xl mb-2 text-ink dark:text-[#F7F5EE]">Computer Science & AI</h4>
                <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 mb-4 font-medium">Software Engineering, Machine Learning, Data Science & Cybersecurity streams.</p>
                <div className="flex items-center justify-between text-xs font-mono border-t border-ink/20 dark:border-white/20 pt-3">
                  <span className="text-ink/70 dark:text-[#F7F5EE]/70">45+ Courses</span>
                  <Link to="/courses" className="underline font-bold text-ink dark:text-lime-accent">
                    Explore Path →
                  </Link>
                </div>
              </div>

              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-accent border border-ink text-xs font-mono font-bold px-2 py-0.5 text-ink">
                    CORE STEM
                  </span>
                  <Cpu className="w-5 h-5 text-ink dark:text-[#F7F5EE]" />
                </div>
                <h4 className="font-heading font-black text-xl mb-2 text-ink dark:text-[#F7F5EE]">Electronics & Robotics</h4>
                <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 mb-4 font-medium">VLSI Design, Embedded Systems, IoT, Automation & Mechatronics.</p>
                <div className="flex items-center justify-between text-xs font-mono border-t border-ink/20 dark:border-white/20 pt-3">
                  <span className="text-ink/70 dark:text-[#F7F5EE]/70">32+ Courses</span>
                  <Link to="/courses" className="underline font-bold text-ink dark:text-lime-accent">
                    Explore Path →
                  </Link>
                </div>
              </div>

              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-mint-accent border border-ink text-xs font-mono font-bold px-2 py-0.5 text-ink">
                    BUSINESS
                  </span>
                  <BarChart3 className="w-5 h-5 text-ink dark:text-[#F7F5EE]" />
                </div>
                <h4 className="font-heading font-black text-xl mb-2 text-ink dark:text-[#F7F5EE]">Management & FinTech</h4>
                <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 mb-4 font-medium">Corporate Finance, Business Analytics, Product Management, Digital Marketing.</p>
                <div className="flex items-center justify-between text-xs font-mono border-t border-ink/20 dark:border-white/20 pt-3">
                  <span className="text-ink/70 dark:text-[#F7F5EE]/70">28+ Courses</span>
                  <Link to="/courses" className="underline font-bold text-ink dark:text-lime-accent">
                    Explore Path →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Exams */}
          {activeTab === 'exams' && (
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-rose-300 border border-ink text-xs font-mono font-bold px-2 py-0.5 text-ink">
                    STATE LEVEL
                  </span>
                  <span className="text-xs font-mono font-bold text-ink dark:text-[#F7F5EE]">KA-CET</span>
                </div>
                <h4 className="font-heading font-black text-xl mb-2 text-ink dark:text-[#F7F5EE]">KCET 2026</h4>
                <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 mb-4 font-medium">Karnataka Common Entrance Test for Engg, Agriculture & Pharma seats.</p>
                <Link to="/exams" className="w-full nb-btn bg-lime-accent text-ink py-2 text-xs text-center block">
                  VIEW EXAM DETAILS 🔔
                </Link>
              </div>

              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-amber-300 border border-ink text-xs font-mono font-bold px-2 py-0.5 text-ink">
                    CONSORTIUM
                  </span>
                  <span className="text-xs font-mono font-bold text-ink dark:text-[#F7F5EE]">COMEDK</span>
                </div>
                <h4 className="font-heading font-black text-xl mb-2 text-ink dark:text-[#F7F5EE]">COMEDK UGET</h4>
                <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 mb-4 font-medium">All-India entrance exam for private engineering colleges in Karnataka.</p>
                <Link to="/exams" className="w-full nb-btn bg-yellow-accent text-ink py-2 text-xs text-center block">
                  VIEW EXAM DETAILS 🔔
                </Link>
              </div>

              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-blue-300 border border-ink text-xs font-mono font-bold px-2 py-0.5 text-ink">
                    NATIONAL
                  </span>
                  <span className="text-xs font-mono font-bold text-ink dark:text-[#F7F5EE]">NTA</span>
                </div>
                <h4 className="font-heading font-black text-xl mb-2 text-ink dark:text-[#F7F5EE]">JEE Main / NEET</h4>
                <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 mb-4 font-medium">National entrance examination for NITs, IIITs, and premier medical institutes.</p>
                <Link to="/exams" className="w-full nb-btn bg-blue-accent text-ink py-2 text-xs text-center block">
                  VIEW EXAM DETAILS 🔔
                </Link>
              </div>
            </div>
          )}

          {/* Tab 3: Colleges */}
          {activeTab === 'colleges' && (
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  RANK #1 IN KARNATAKA
                </div>
                <h4 className="font-heading font-black text-xl mb-1 text-ink dark:text-[#F7F5EE]">RV College of Engineering</h4>
                <p className="text-xs text-ink/70 dark:text-[#F7F5EE]/70 mb-3">Mysore Road, Bengaluru • Autonomous</p>
                <div className="bg-white dark:bg-[#11110F] p-2 border border-ink dark:border-[#F7F5EE] text-xs font-mono mb-3 text-ink dark:text-[#F7F5EE]">
                  Avg Package: <strong>₹11.2 LPA</strong> | Cutoff: <strong>Top 1200 KCET</strong>
                </div>
                <Link to="/colleges" className="w-full nb-btn bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE] py-2 text-xs text-center block">
                  VIEW ADMISSION GUIDE
                </Link>
              </div>

              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  TOP RECRUITER CHOICE
                </div>
                <h4 className="font-heading font-black text-xl mb-1 text-ink dark:text-[#F7F5EE]">BMS College of Engg.</h4>
                <p className="text-xs text-ink/70 dark:text-[#F7F5EE]/70 mb-3">Basavanagudi, Bengaluru • Autonomous</p>
                <div className="bg-white dark:bg-[#11110F] p-2 border border-ink dark:border-[#F7F5EE] text-xs font-mono mb-3 text-ink dark:text-[#F7F5EE]">
                  Avg Package: <strong>₹9.8 LPA</strong> | Cutoff: <strong>Top 2400 KCET</strong>
                </div>
                <Link to="/colleges" className="w-full nb-btn bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE] py-2 text-xs text-center block">
                  VIEW ADMISSION GUIDE
                </Link>
              </div>

              <div className="nb-card p-5 bg-cream dark:bg-[#22221E]">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  INNOVATION HUB
                </div>
                <h4 className="font-heading font-black text-xl mb-1 text-ink dark:text-[#F7F5EE]">PES University</h4>
                <p className="text-xs text-ink/70 dark:text-[#F7F5EE]/70 mb-3">Ring Road Campus, Bengaluru • Deemed</p>
                <div className="bg-white dark:bg-[#11110F] p-2 border border-ink dark:border-[#F7F5EE] text-xs font-mono mb-3 text-ink dark:text-[#F7F5EE]">
                  Entrance: <strong>PESSAT / KCET</strong> | Placements: <strong>95%+</strong>
                </div>
                <Link to="/colleges" className="w-full nb-btn bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE] py-2 text-xs text-center block">
                  VIEW ADMISSION GUIDE
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── 4. About & How It Works Dual Section ─────────────────────────── */}
      <section id="about" className="py-16 px-4 lg:px-8 border-t-2 border-ink dark:border-[#F7F5EE] bg-white dark:bg-[#151512] w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: About NEXT VERSE */}
          <div className="lg:col-span-5 nb-card p-6 lg:p-8 bg-cream dark:bg-[#1E1E1B] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-lime-accent border border-ink px-3 py-1 mb-6 text-xs font-mono font-bold uppercase text-ink">
                <Info className="w-4 h-4" />
                <span>ABOUT NEXT VERSE</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-ink dark:text-[#F7F5EE] mb-4 leading-tight">
                CLEAR DECISIONS IN A CONFUSING WORLD.
              </h2>

              <p className="text-sm md:text-base text-ink/80 dark:text-[#F7F5EE]/80 leading-relaxed mb-6 font-medium">
                NEXT VERSE helps you make confident education and career decisions using personalized recommendations and curated resources.
              </p>

              <p className="text-sm text-ink/80 dark:text-[#F7F5EE]/80 leading-relaxed mb-8">
                Answer a few simple questions, then explore domains, verified degree courses, competitive entrance exams, colleges in Karnataka, study materials, and job opportunities — all consolidated in one place.
              </p>
            </div>

            {/* Live Metric Counter Badges */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t-2 border-ink dark:border-[#F7F5EE] text-center">
              <div className="bg-white dark:bg-[#11110F] border border-ink dark:border-[#F7F5EE] p-2">
                <div className="font-heading font-black text-xl text-ink dark:text-lime-accent">500+</div>
                <div className="text-[10px] font-mono font-bold text-ink/70 dark:text-[#F7F5EE]/70 uppercase">Colleges</div>
              </div>
              <div className="bg-white dark:bg-[#11110F] border border-ink dark:border-[#F7F5EE] p-2">
                <div className="font-heading font-black text-xl text-ink dark:text-yellow-accent">120+</div>
                <div className="text-[10px] font-mono font-bold text-ink/70 dark:text-[#F7F5EE]/70 uppercase">Exams</div>
              </div>
              <div className="bg-white dark:bg-[#11110F] border border-ink dark:border-[#F7F5EE] p-2">
                <div className="font-heading font-black text-xl text-ink dark:text-mint-accent">10k+</div>
                <div className="text-[10px] font-mono font-bold text-ink/70 dark:text-[#F7F5EE]/70 uppercase">Students</div>
              </div>
            </div>
          </div>

          {/* Right: How It Works 3-Step Flow */}
          <div id="how-it-works" className="lg:col-span-7 nb-card p-6 lg:p-8 bg-white dark:bg-[#1A1A17] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-accent border border-ink px-3 py-1 mb-6 text-xs font-mono font-bold uppercase text-ink">
                <ListOrdered className="w-4 h-4" />
                <span>3-STEP WORKFLOW</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-ink dark:text-[#F7F5EE] mb-8">
                HOW IT WORKS
              </h2>

              {/* 3 Step Stack */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="nb-card p-4 bg-cream dark:bg-[#22221E] flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 bg-yellow-accent border-2 border-ink flex items-center justify-center font-heading font-black text-xl text-ink shadow-[2px_2px_0px_#11110F]">
                    1
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-lg mb-1 text-ink dark:text-[#F7F5EE]">
                      Tell Us About You
                    </h4>
                    <p className="text-xs md:text-sm text-ink/80 dark:text-[#F7F5EE]/80 font-medium">
                      Select your current education level (10th, 12th/PUC, Diploma, or UG) and complete a 2-minute interest questionnaire.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="nb-card p-4 bg-cream dark:bg-[#22221E] flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 bg-lime-accent border-2 border-ink flex items-center justify-center font-heading font-black text-xl text-ink shadow-[2px_2px_0px_#11110F]">
                    2
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-lg mb-1 text-ink dark:text-[#F7F5EE]">
                      Get Smart Recommendations
                    </h4>
                    <p className="text-xs md:text-sm text-ink/80 dark:text-[#F7F5EE]/80 font-medium">
                      Pick an optimal domain, then choose target degree courses and relevant competitive entrance exams matching your goals.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="nb-card p-4 bg-cream dark:bg-[#22221E] flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 bg-mint-accent border-2 border-ink flex items-center justify-center font-heading font-black text-xl text-ink shadow-[2px_2px_0px_#11110F]">
                    3
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-lg mb-1 text-ink dark:text-[#F7F5EE]">
                      Take Action & Track Progress
                    </h4>
                    <p className="text-xs md:text-sm text-ink/80 dark:text-[#F7F5EE]/80 font-medium">
                      Track entrance exam deadlines, set custom SMS/Email reminders, filter colleges, and download verified study materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA Trigger */}
            <div className="mt-8 pt-6 border-t-2 border-ink dark:border-[#F7F5EE]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-xs font-bold text-ink/70 dark:text-[#F7F5EE]/70">
                READY TO BUILD YOUR CAREER ROADMAP?
              </span>
              <Link
                to="/level"
                className="nb-btn bg-lime-accent text-ink px-6 py-2.5 text-xs md:text-sm uppercase font-black hover:bg-lime-300 shadow-brutal"
              >
                START ADVISER ENGINE NOW →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. Big Banner CTA Section ────────────────────────────────────── */}
      <section className="bg-yellow-accent border-t-2 border-ink py-16 px-4 lg:px-8 text-center relative overflow-hidden w-full">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="bg-white border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase mb-4 inline-block text-ink shadow-[2px_2px_0px_#11110F]">
            ⚡ TAKE THE NEXT STEP
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-ink mb-6 tracking-tight leading-none">
            STOP GUESSING YOUR FUTURE. <br /> START BUILDING IT TODAY.
          </h2>
          <p className="text-base md:text-lg font-medium text-ink/90 max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of high school, diploma, and college students navigating admissions with 100% confidence.
          </p>
          <Link
            to="/login"
            className="nb-btn bg-ink text-white hover:bg-neutral-800 text-base md:text-lg px-10 py-4 inline-flex items-center gap-2 shadow-brutal-lg"
          >
            <span>GET STARTED FREE FOR STUDENTS</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
