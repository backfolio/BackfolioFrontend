import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-light-subtle">
            {/* Navigation */}
            <nav className="absolute top-0 w-full z-10 py-6 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-premium-900">
                        Back<span className="text-primary-600">folio</span>
                    </div>
                    <div className="space-x-3">
                        <Link
                            to="/login"
                            className="text-premium-700 hover:text-primary-600 transition-colors px-4 py-2 font-medium"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/login?mode=signup"
                            className="bg-gradient-purple-light text-white px-6 py-2.5 rounded-lg transition-all shadow-premium hover:shadow-premium-purple font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
                <div className="max-w-4xl">
                    <h1 className="text-6xl md:text-7xl font-bold text-premium-900 mb-6 tracking-tight">
                        Welcome to
                        <span className="block bg-gradient-purple-light bg-clip-text text-transparent mt-2">
                            Backfolio
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-premium-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        Your elegant solution for managing portfolios with style and sophistication
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/login?mode=signup"
                            className="bg-gradient-purple-light text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-premium-purple hover-lift"
                        >
                            Get Started
                        </Link>
                        <button className="border-2 border-primary-500 text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover-lift">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-premium-solid p-8 rounded-2xl hover:shadow-premium-lg transition-all hover-lift">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold text-premium-900 mb-3">Fast & Modern</h3>
                        <p className="text-premium-600 leading-relaxed">Built with the latest technologies for optimal performance</p>
                    </div>
                    <div className="glass-premium-solid p-8 rounded-2xl hover:shadow-premium-lg transition-all hover-lift">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-premium-900 mb-3">Secure</h3>
                        <p className="text-premium-600 leading-relaxed">Enterprise-grade security powered by Azure</p>
                    </div>
                    <div className="glass-premium-solid p-8 rounded-2xl hover:shadow-premium-lg transition-all hover-lift">
                        <div className="text-4xl mb-4">✨</div>
                        <h3 className="text-xl font-bold text-premium-900 mb-3">Elegant Design</h3>
                        <p className="text-premium-600 leading-relaxed">Beautiful UI that's a pleasure to use</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
