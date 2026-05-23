function CardSkeleton() {
  return (
    <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden animate-pulse">
      <div className="h-56 bg-white/5"></div>

      <div className="p-6">
        <div className="h-6 bg-white/5 rounded w-2/3 mb-4"></div>

        <div className="h-4 bg-white/5 rounded mb-2"></div>
        <div className="h-4 bg-white/5 rounded w-5/6 mb-6"></div>

        <div className="flex justify-between items-center">
          <div className="h-6 bg-white/5 rounded w-20"></div>

          <div className="h-10 bg-white/5 rounded-full w-28"></div>
        </div>
      </div>
    </div>
  )
}

export default CardSkeleton
