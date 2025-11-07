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

        try {
            if (isSignupMode) {
                if (password !== confirmPassword) {
                    setError('Passwords do not match')
                    setIsLoading(false)
                    return
                }
                const success = await signup(email, password)
                if (success) {
                    navigate('/dashboard')
                } else {
                    setError('Signup failed. Please try again.')
                }
            } else {
                const success = await login(email, password)
                if (success) {
                    navigate('/dashboard')
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
        <div className="min-h-screen bg-gradient-light-subtle flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Home Link */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold text-premium-900 hover:text-primary-600 transition-colors">
                        Back<span className="text-primary-600">folio</span>
                    </Link>
                </div>

                {/* Login/Signup Card */}
                <div className="glass-premium-solid rounded-3xl p-8 shadow-premium-xl">
                    <h2 className="text-3xl font-bold text-premium-900 mb-6 text-center tracking-tight">
                        {isSignupMode ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-premium-700 mb-2 text-sm font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-premium-300 text-premium-900 placeholder-premium-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-premium-700 mb-2 text-sm font-semibold">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-premium-300 text-premium-900 placeholder-premium-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {isSignupMode && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-premium-700 mb-2 text-sm font-semibold">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-premium-300 text-premium-900 placeholder-premium-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-purple-light hover:shadow-premium-purple disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all shadow-premium"
                        >
                            {isLoading ? 'Please wait...' : (isSignupMode ? 'Sign Up' : 'Log In')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-premium-600">
                            {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <Link
                                to={isSignupMode ? '/login' : '/login?mode=signup'}
                                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                            >
                                {isSignupMode ? 'Log In' : 'Sign Up'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
