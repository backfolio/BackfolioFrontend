import { useState, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingTransition from '../components/LoadingTransition'
import {
    LoginHeader,
    ErrorMessage,
    AuthForm,
    TermsNotice,
    AuthToggle,
    TrustIndicators,
    BackgroundEffects
} from '../components/auth'

const LoginPage = () => {
    const [searchParams] = useSearchParams()
    const isSignupMode = searchParams.get('mode') === 'signup'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showLoadingTransition, setShowLoadingTransition] = useState(false)

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
                    setShowLoadingTransition(true)
                    setTimeout(() => {
                        navigate(redirectTo)
                    }, 2000) // 2 second delay for satisfying transition
                } else {
                    setError('Signup failed. Please try again.')
                }
            } else {
                const success = await login(email, password)
                if (success) {
                    setShowLoadingTransition(true)
                    setTimeout(() => {
                        navigate(redirectTo)
                    }, 2000) // 2 second delay for satisfying transition
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

    // Show loading transition screen
    if (showLoadingTransition) {
        return <LoadingTransition message={isSignupMode ? 'Setting up your account...' : 'Preparing your dashboard...'} />
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
            <BackgroundEffects />

            <div className="w-full max-w-md relative z-10">
                <LoginHeader isSignupMode={isSignupMode} />

                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.15] rounded-3xl p-10 shadow-[0_0_50px_rgba(255,255,255,0.08)]">
                    <ErrorMessage message={error} />

                    <AuthForm
                        isSignupMode={isSignupMode}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        isLoading={isLoading}
                        onEmailChange={setEmail}
                        onPasswordChange={setPassword}
                        onConfirmPasswordChange={setConfirmPassword}
                        onSubmit={handleSubmit}
                    />

                    {isSignupMode && <TermsNotice />}

                    <AuthToggle isSignupMode={isSignupMode} />
                </div>

                <TrustIndicators />
            </div>
        </div>
    )
}

export default LoginPage
