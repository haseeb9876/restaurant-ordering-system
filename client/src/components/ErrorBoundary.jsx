import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application crash:", error)
    console.error(errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
          <div className="max-w-lg text-center">
            <div className="text-7xl mb-6">
              🍕
            </div>

            <h1 className="text-4xl font-black mb-4">
              Something went wrong
            </h1>

            <p className="text-gray-400 mb-8">
              Royal Pizza encountered an unexpected issue.
              Please refresh the app and try again.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-full font-black"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
