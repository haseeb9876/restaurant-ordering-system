import { useEffect, useState } from "react"

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  )
}

function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (isStandaloneMode()) {
      return
    }

    const dismissedAt = localStorage.getItem("installPromptDismissedAt")
    const oneDay = 24 * 60 * 60 * 1000

    if (dismissedAt && Date.now() - Number(dismissedAt) < oneDay) {
      return
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem("installPromptDismissedAt", String(Date.now()))
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:max-w-sm">
      <div className="rounded-3xl border border-orange-500/30 bg-zinc-950 text-white shadow-2xl shadow-black/40 p-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl">
            🍕
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-extrabold">
              Install Royal Pizza App
            </h3>
            <p className="mt-1 text-sm text-gray-300">
              Add our restaurant app to your mobile home screen for faster ordering.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 rounded-full bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
          >
            Install App
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-gray-300 hover:border-white/30"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallAppPrompt
