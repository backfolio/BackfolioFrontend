import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Layout from '../components/Layout'
import {
    PasswordChangeModal,
    EmailChangeModal,
    SuccessMessage,
    AccountInfoSection,
    SecuritySection,
    PreferencesSection
} from '../components/settings'

const Settings = () => {
    const { user } = useAuth()
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    // Form states
    const [profile, setProfile] = useState({
        username: user?.email?.split('@')[0] || '',
        email: user?.email || ''
    })

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        phoneNotifications: false,
        marketingEmails: false,
        currency: 'USD',
        timezone: 'UTC'
    })

    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showEmailModal, setShowEmailModal] = useState(false)



    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 3000)
    }

    const handleProfileSave = async (newEmail: string) => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProfile({ ...profile, email: newEmail })
        showSuccessMessage('Email updated successfully!')
        setShowEmailModal(false)
        setIsLoading(false)
    }

    const handlePasswordSave = async (_passwords: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        showSuccessMessage('Password updated successfully!')
        setShowPasswordModal(false)
        setIsLoading(false)
    }

    const handlePreferencesSave = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        showSuccessMessage('Preferences updated successfully!')
        setIsLoading(false)
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className={`text-4xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Account Settings
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your account preferences and security settings
                    </p>
                </div>

                <SuccessMessage message={successMessage} />

                <div className="space-y-8">
                    <AccountInfoSection
                        email={user?.email || ''}
                        username={profile.username}
                        onChangeEmail={() => setShowEmailModal(true)}
                        onEditUsername={() => { /* TODO: Implement */ }}
                    />

                    <SecuritySection
                        onChangePassword={() => setShowPasswordModal(true)}
                        onEnable2FA={() => { /* TODO: Implement */ }}
                    />

                    <PreferencesSection
                        preferences={preferences}
                        onPreferencesChange={setPreferences}
                        onSave={handlePreferencesSave}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <PasswordChangeModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSave={handlePasswordSave}
            />

            <EmailChangeModal
                isOpen={showEmailModal}
                currentEmail={user?.email || ''}
                onClose={() => setShowEmailModal(false)}
                onSave={handleProfileSave}
            />
        </Layout>
    )
}

export default Settings
