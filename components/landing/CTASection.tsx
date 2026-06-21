import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-slate-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to grow your business?
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          Join hundreds of businesses that found their perfect digital expert on SkillBridge.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/providers">
            <Button size="lg" variant="outline" className="text-base px-8 text-white border-slate-600 hover:bg-slate-800">
              Browse Experts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}