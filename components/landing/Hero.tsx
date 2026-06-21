'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-blue-800" />
            Trusted by 200+ businesses across India
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Find the right digital expert{' '}
            <span className="text-blue-800">for your business</span>
          </h1>

          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Connect with verified web developers, designers, and digital marketers.
            Post your requirement and get proposals within hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-base px-8">
                Post a Request
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/providers">
              <Button size="lg" variant="outline" className="text-base px-8">
                Browse Experts
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}