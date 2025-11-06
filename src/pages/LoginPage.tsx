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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Home Link */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold text-white hover:text-purple-300 transition-colors">
                        Backfolio
                    </Link>
                </div>

                {/* Login/Signup Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        {isSignupMode ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-white mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {isSignupMode && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-white mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            {isLoading ? 'Please wait...' : (isSignupMode ? 'Sign Up' : 'Log In')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-300">
                            {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <Link
                                to={isSignupMode ? '/login' : '/login?mode=signup'}
                                className="text-purple-300 hover:text-purple-200 font-semibold"
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
