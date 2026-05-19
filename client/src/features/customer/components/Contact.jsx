function Contact() {
  return (
    <section id="contact" className="bg-zinc-950 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold mb-3">
            Contact Us
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold">
            We Are Ready To Serve You
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-black border border-white/10 rounded-[2rem] p-8 text-center">
            <div className="text-5xl mb-5">📍</div>
            <h3 className="text-xl font-bold mb-3">Location</h3>
            <p className="text-gray-400">
              Main Food Street, Peshawar, Pakistan
            </p>
          </div>

          <div className="bg-black border border-white/10 rounded-[2rem] p-8 text-center">
            <div className="text-5xl mb-5">📞</div>
            <h3 className="text-xl font-bold mb-3">Phone</h3>
            <p className="text-gray-400">
              +92 300 1234567
            </p>
          </div>

          <div className="bg-black border border-white/10 rounded-[2rem] p-8 text-center">
            <div className="text-5xl mb-5">⏰</div>
            <h3 className="text-xl font-bold mb-3">Opening Hours</h3>
            <p className="text-gray-400">
              Mon - Sun: 11:00 AM - 11:00 PM
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
