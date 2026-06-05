function TrustBadges() {
  const badges = [
    { icon: "🚚", title: "Fast Delivery", text: "Quick doorstep service" },
    { icon: "🍕", title: "Fresh Food", text: "Prepared after order" },
    { icon: "🔒", title: "Secure Checkout", text: "Safe order process" },
    { icon: "⚡", title: "Guest Order", text: "No signup needed" },
  ]

  return (
    <section className="bg-black px-4 md:px-6 py-5 border-y border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <h3 className="font-extrabold text-sm md:text-base">
                {badge.title}
              </h3>
              <p className="text-gray-500 text-xs">{badge.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBadges
