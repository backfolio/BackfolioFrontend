import { Link } from 'react-router-dom'

interface LoginHeaderProps {
    isSignupMode: boolean
}

export const LoginHeader = ({ isSignupMode }: LoginHeaderProps) => {
    return (
        <>
            <div className="text-center mb-12 mt-8">
                <Link to="/" className="text-3xl font-bold text-white hover:text-white/90 transition-colors inline-block tracking-tight">
                    Back<span className="bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">folio</span>
                </Link>
                <p className="text-white/60 mt-3 font-normal text-sm tracking-wide">
                    Professional Investment Management
                </p>
            </div>

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
        </>
    )
}
