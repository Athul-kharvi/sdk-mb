'use client'

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/917259333254"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <div className="relative">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-warm-black text-white px-3 py-2 rounded text-xs font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Order on WhatsApp
        </div>

        {/* Button */}
        <button className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-green-600">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.412 2.122 7.708l-2.26 6.937 7.1-2.331c2.17 1.316 4.694 2.01 7.263 2.01 9.616 0 17.425-7.745 17.425-17.306 0-4.624-1.802-8.976-5.083-12.243-3.28-3.267-7.64-5.063-12.254-5.063z" />
          </svg>
        </button>
      </div>
    </a>
  )
}
