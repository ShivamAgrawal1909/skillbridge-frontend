export default function StatsBar() {
  const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '200+', label: 'Verified Experts' },
    { value: '50+', label: 'Cities Covered' },
    { value: '4.8★', label: 'Average Rating' },
  ]

  return (
    <section className="py-14 px-4 bg-blue-800">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-blue-200 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}