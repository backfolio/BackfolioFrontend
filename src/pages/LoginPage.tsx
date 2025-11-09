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
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo/Home Link */}
                <div className="text-center mb-10">
                    <Link to="/" className="text-3xl font-bold text-premium-900 hover:text-primary-600 transition-colors inline-block">
                        Back<span className="text-primary-600">folio</span>
                    </Link>
                    <p className="text-premium-600 mt-2 font-medium">
                        Professional Investment Management
                    </p>
                </div>

                {/* Login/Signup Card */}
                <div className="card-investment p-10 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-premium-900 mb-3 tracking-tight">
                            {isSignupMode ? 'Join Backfolio' : 'Welcome Back'}
                        </h2>
                        <p className="text-premium-600">
                            {isSignupMode
                                ? 'Create your professional investment account'
                                : 'Sign in to your investment dashboard'
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="bg-danger-50 border-2 border-danger-200 text-danger-700 px-4 py-3 rounded-xl mb-6 font-medium">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-premium-800 mb-3 text-sm font-bold uppercase tracking-wide">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-investment w-full px-5 py-4 text-premium-900 placeholder-premium-400 font-medium"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-premium-800 mb-3 text-sm font-bold uppercase tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-investment w-full px-5 py-4 text-premium-900 placeholder-premium-400 font-medium"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {isSignupMode && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-premium-800 mb-3 text-sm font-bold uppercase tracking-wide">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-investment w-full px-5 py-4 text-premium-900 placeholder-premium-400 font-medium"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        )}

                        {!isSignupMode && (
                            <div className="flex justify-between items-center">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2 accent-primary-600" />
                                    <span className="text-sm text-premium-600">Remember me</span>
                                </label>
                                <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-investment w-full text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Please wait...
                                </div>
                            ) : (
                                isSignupMode ? 'Create Account' : 'Sign In'
                            )}
                        </button>
                    </form>

                    {isSignupMode && (
                        <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                            <p className="text-xs text-premium-600 text-center leading-relaxed">
                                By creating an account, you agree to our{' '}
                                <span className="text-primary-600 font-semibold">Terms of Service</span> and{' '}
                                <span className="text-primary-600 font-semibold">Privacy Policy</span>
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-premium-600">
                            {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <Link
                                to={isSignupMode ? '/login' : '/login?mode=signup'}
                                className="text-primary-600 hover:text-primary-700 font-bold transition-colors"
                            >
                                {isSignupMode ? 'Sign In' : 'Get Started'}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-premium-500 mb-4">Trusted by investment professionals worldwide</p>
                    <div className="flex justify-center items-center gap-6 opacity-40">
                        <div className="text-xs font-bold">🔒 BANK-GRADE SECURITY</div>
                        <div className="text-xs font-bold">📊 SOC 2 COMPLIANT</div>
                        <div className="text-xs font-bold">🛡️ ISO 27001</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
