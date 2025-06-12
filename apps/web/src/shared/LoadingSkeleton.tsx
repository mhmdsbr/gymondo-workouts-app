export default function LoadingSkeleton() {
  return (
    <section className="p-6 max-w-4xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl mb-4"></div>
        ))}
      </div>
    </section>
  )
}