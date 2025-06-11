export default function ErrorMessage({ 
  error,
  onRetry 
}: { 
  error: string 
  onRetry: () => void 
}) {
  return (
    <section className="p-6 max-w-4xl mx-auto">
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </section>
  )
}