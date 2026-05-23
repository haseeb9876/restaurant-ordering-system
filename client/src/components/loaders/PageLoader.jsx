function PageLoader({
  title = "Loading...",
  subtitle = "Please wait",
}) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>

        <h2 className="text-2xl font-black text-white">
          {title}
        </h2>

        <p className="text-gray-400 mt-2">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default PageLoader
