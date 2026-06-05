function MenuSearchBar({
  searchTerm,
  setSearchTerm,
  setSelectedCategory,
}) {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)

    if (setSelectedCategory) {
      setSelectedCategory("All")
    }
  }

  return (
    <div className="sticky top-[72px] z-40 bg-black/95 backdrop-blur-xl border-y border-white/10 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search burger, pizza, fries..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-3 pl-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition"
          />

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </span>
        </div>
      </div>
    </div>
  )
}

export default MenuSearchBar
