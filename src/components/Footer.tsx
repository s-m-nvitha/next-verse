import { Link } from 'react-router-dom'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => setSubscribed(false), 4000)
    setEmail('')
  }

  return (
    <footer className="bg-cream dark:bg-[#11110F] border-t-2 border-ink dark:border-[#F7F5EE] py-12 px-4 lg:px-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b-2 border-ink dark:border-[#F7F5EE]">
        
        {/* Col 1: Brand Info */}
        <div className="md:col-span-5">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className="w-8 h-8 bg-lime-accent nb-border flex items-center justify-center font-black text-lg text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#F7F5EE]">
              N
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter text-ink dark:text-[#F7F5EE]">
              NEXT VERSE
            </span>
          </Link>
          <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 max-w-sm mb-6 leading-relaxed font-medium">
            One-Stop Personalized Career & Education Adviser. Simplifying entrance exams, colleges, scholarships, and degree pathways for ambitious minds across Karnataka & India.
          </p>
          <div className="font-mono text-xs text-ink/60 dark:text-[#F7F5EE]/60">
            © 2026 NEXT VERSE Platform. Built for Bharat Builds & Ship It Hackathon.
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="md:col-span-3">
          <h4 className="font-heading font-black text-sm uppercase mb-4 bg-yellow-accent border border-ink px-2 py-0.5 text-ink inline-block">
            Catalog Links
          </h4>
          <ul className="space-y-2 text-xs font-mono font-bold">
            <li>
              <Link to="/level" className="text-ink dark:text-[#F7F5EE] hover:underline">
                HOW IT WORKS →
              </Link>
            </li>
            <li>
              <Link to="/domains" className="text-ink dark:text-[#F7F5EE] hover:underline">
                CAREER DOMAINS →
              </Link>
            </li>
            <li>
              <Link to="/exams" className="text-ink dark:text-[#F7F5EE] hover:underline">
                EXAM DEADLINES 2026 →
              </Link>
            </li>
            <li>
              <Link to="/colleges" className="text-ink dark:text-[#F7F5EE] hover:underline">
                KARNATAKA COLLEGES →
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-ink dark:text-[#F7F5EE] hover:underline">
                STUDENT DASHBOARD →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Stay Informed Newsletter */}
        <div className="md:col-span-4">
          <h4 className="font-heading font-black text-sm uppercase mb-4 bg-blue-accent border border-ink px-2 py-0.5 text-ink inline-block">
            Stay Informed
          </h4>
          <p className="text-xs text-ink/80 dark:text-[#F7F5EE]/80 mb-3 font-medium">
            Get deadline alerts for KCET, COMEDK, and JEE directly in your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter student email..."
              className="border-2 border-ink dark:border-[#F7F5EE] px-3 py-2 text-xs font-mono flex-grow focus:outline-none bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE]"
              required
            />
            <button
              type="submit"
              className="nb-btn bg-lime-accent text-ink px-4 py-2 text-xs font-heading font-black uppercase hover:bg-lime-300"
            >
              JOIN
            </button>
          </form>
          {subscribed && (
            <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              ✓ Subscribed for admission alerts!
            </p>
          )}
        </div>

      </div>

      {/* Footer Bottom Line */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-ink/70 dark:text-[#F7F5EE]/70 gap-4">
        <div className="flex gap-3">
          <Link to="/legal/privacy" className="hover:underline">Privacy Policy</Link>
          <span>•</span>
          <Link to="/legal/terms" className="hover:underline">Terms of Guidance</Link>
          <span>•</span>
          <span>Catalog Verification</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="bg-white dark:bg-[#1A1A17] border border-ink dark:border-[#F7F5EE] px-2.5 py-0.5 text-ink dark:text-[#F7F5EE] font-bold text-[11px]">
            SYSTEM STATUS: ALL OK (AWS REGION AP-SOUTH-1)
          </span>
        </div>
      </div>
    </footer>
  )
}
