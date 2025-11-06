import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation */}
            <nav className="absolute top-0 w-full z-10 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-white">
                        Backfolio
                    </div>
                    <div className="space-x-4">
                        <Link
                            to="/login"
                            className="text-white hover:text-purple-300 transition-colors px-4 py-2"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/login?mode=signup"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                    Welcome to
                    <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Backfolio
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl">
                    Your elegant solution for managing portfolios with style and sophistication
                </p>
                <div className="space-x-4">
                    <Link
                        to="/login?mode=signup"
                        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                    >
                        Get Started
                    </Link>
                    <button className="inline-block border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold text-white mb-2">Fast & Modern</h3>
                        <p className="text-gray-300">Built with the latest technologies for optimal performance</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
                        <p className="text-gray-300">Enterprise-grade security powered by Azure</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
                        <div className="text-4xl mb-4">✨</div>
                        <h3 className="text-xl font-bold text-white mb-2">Elegant Design</h3>
                        <p className="text-gray-300">Beautiful UI that's a pleasure to use</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
