function MenuSearchBar({
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="sticky top-[72px] z-40 bg-black/95 backdrop-blur-xl border-y border-white/10 py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search pizza, burger, shawarma..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition"
          />

          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
            🔍
          </span>
        </div>
      </div>
    </div>
  )
}

export default MenuSearchBar
