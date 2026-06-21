'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe, Smartphone, Bot, Megaphone, Search, Palette, PenTool, Video, Layout } from 'lucide-react'

const categories = [
  { name: 'Website Development', slug: 'website-development', icon: Globe },
  { name: 'Mobile App', slug: 'mobile-app-development', icon: Smartphone },
  { name: 'Chatbot & WhatsApp', slug: 'chatbot-whatsapp-bot', icon: Bot },
  { name: 'Digital Marketing', slug: 'digital-marketing', icon: Megaphone },
  { name: 'SEO', slug: 'seo', icon: Search },
  { name: 'Graphic Design', slug: 'graphic-design-branding', icon: Palette },
  { name: 'Content Writing', slug: 'content-writing', icon: PenTool },
  { name: 'Video Editing', slug: 'video-editing', icon: Video },
  { name: 'UI/UX Design', slug: 'ui-ux-design', icon: Layout },
]

export default function Categories() {
  const router = useRouter()

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Browse by service</h2>
          <p className="text-slate-500">Find experts across all digital service categories</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.button
                key={cat.slug}
                onClick={() => router.push(`/providers?category=${cat.slug}`)}
                className="p-6 border border-slate-200 rounded-xl text-center hover:border-blue-700 hover:bg-blue-50 transition-all group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-slate-400 group-hover:text-blue-700 transition-colors" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-800">{cat.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}