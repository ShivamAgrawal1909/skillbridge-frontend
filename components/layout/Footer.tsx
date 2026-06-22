import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-white font-bold text-lg mb-3">SkillBridge</div>
            <p className="text-sm leading-relaxed">
              Connecting businesses with verified digital experts across India.
            </p>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Services</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/providers?category=website-development" className="hover:text-white transition-colors">Website Development</Link></li>
              <li><Link href="/providers?category=digital-marketing" className="hover:text-white transition-colors">Digital Marketing</Link></li>
              <li><Link href="/providers?category=seo" className="hover:text-white transition-colors">SEO</Link></li>
              <li><Link href="/providers?category=ui-ux-design" className="hover:text-white transition-colors">UI/UX Design</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Platform</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/providers" className="hover:text-white transition-colors">Browse Experts</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Post a Request</Link></li>
              <li><Link href="/register?role=provider" className="hover:text-white transition-colors">Become a Provider</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-sm text-center">
          © {new Date().getFullYear()} SkillBridge. Built with FastAPI + Next.js.
        </div>
      </div>
    </footer>
  )
}