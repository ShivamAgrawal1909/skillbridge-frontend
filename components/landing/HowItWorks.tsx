import { ClipboardList, Users, Handshake } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: 'Post your requirement',
    desc: 'Describe what you need — website, app, marketing campaign. Set your budget and deadline.',
  },
  {
    icon: Users,
    title: 'Get matched with experts',
    desc: 'Our algorithm finds the best providers for your project. They send you proposals within hours.',
  },
  {
    icon: Handshake,
    title: 'Hire and get it done',
    desc: 'Review proposals, chat with providers, accept the best fit, and track your project to completion.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
          <p className="text-slate-500">Three simple steps to get your project done</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-8 border border-slate-200 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-blue-800" />
                  </div>
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-2">
                    Step {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}