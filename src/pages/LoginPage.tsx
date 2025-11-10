import { useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
    const [searchParams] = useSearchParams()
    const isSignupMode = searchParams.get('mode') === 'signup'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login, signup } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        // Get redirect parameter
        const redirectTo = searchParams.get('redirect') || '/dashboard'

        try {
            if (isSignupMode) {
                if (password !== confirmPassword) {
                    setError('Passwords do not match')
                    setIsLoading(false)
                    return
                }
                const success = await signup(email, password)
                if (success) {
                    navigate(redirectTo)
                } else {
                    setError('Signup failed. Please try again.')
                }
            } else {
                const success = await login(email, password)
                if (success) {
                    navigate(redirectTo)
                } else {
                    setError('Invalid email or password')
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
            {/* Subtle background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-40 left-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Home Link */}
                <div className="text-center mb-12 mt-8">
                    <Link to="/" className="text-3xl font-bold text-white hover:text-white/90 transition-colors inline-block tracking-tight">
                        Back<span className="bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">folio</span>
                    </Link>
                    <p className="text-white/60 mt-3 font-normal text-sm tracking-wide">
                        Professional Investment Management
                    </p>
                </div>

                {/* Login/Signup Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.15] rounded-3xl p-10 shadow-[0_0_50px_rgba(255,255,255,0.08)]">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                            {isSignupMode ? 'Join Backfolio' : 'Welcome Back'}
                        </h2>
                        <p className="text-white/70 text-base">
                            {isSignupMode
                                ? 'Create your professional investment account'
                                : 'Sign in to your investment dashboard'
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-5 py-4 rounded-2xl mb-6 font-medium">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-white/80 mb-3 text-sm font-medium tracking-wide">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-white/[0.07] border border-white/[0.15] rounded-xl text-white placeholder-white/40 font-normal focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-200"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-white/80 mb-3 text-sm font-medium tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-white/[0.07] border border-white/[0.15] rounded-xl text-white placeholder-white/40 font-normal focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-200"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {isSignupMode && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-white/80 mb-3 text-sm font-medium tracking-wide">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/[0.07] border border-white/[0.15] rounded-xl text-white placeholder-white/40 font-normal focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-200"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        )}

                        {!isSignupMode && (
                            <div className="flex justify-between items-center">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2 accent-white rounded" />
                                    <span className="text-sm text-white/60">Remember me</span>
                                </label>
                                <button type="button" className="text-sm text-white/80 hover:text-white font-medium transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black py-4 rounded-xl text-base font-semibold hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    Please wait...
                                </div>
                            ) : (
                                isSignupMode ? 'Create Account' : 'Sign In'
                            )}
                        </button>
                    </form>

                    {isSignupMode && (
                        <div className="mt-6 p-4 bg-white/[0.03] rounded-xl border border-white/[0.15]">
                            <p className="text-xs text-white/60 text-center leading-relaxed">
                                By creating an account, you agree to our{' '}
                                <span className="text-white/80 font-medium">Terms of Service</span> and{' '}
                                <span className="text-white/80 font-medium">Privacy Policy</span>
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-white/60">
                            {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <Link
                                to={isSignupMode ? '/login' : '/login?mode=signup'}
                                className="text-white hover:text-white/80 font-semibold transition-colors"
                            >
                                {isSignupMode ? 'Sign In' : 'Get Started'}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 mb-8 text-center">
                    <p className="text-sm text-white/60 mb-4">Trusted by investment professionals worldwide</p>
                    <div className="flex justify-center items-center gap-6 text-white/50">
                        <div className="text-xs font-medium">🔒 BANK-GRADE SECURITY</div>
                        <div className="text-xs font-medium">📊 SOC 2 COMPLIANT</div>
                        <div className="text-xs font-medium">🛡️ ISO 27001</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
