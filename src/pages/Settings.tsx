import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

import Layout from '../components/Layout'

const Settings = () => {
    const { user } = useAuth()

    // Form states
    const [profile, setProfile] = useState({
        username: user?.email?.split('@')[0] || '',
        email: user?.email || ''
    })

    const [security, setSecurity] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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



    const handleProfileSave = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccessMessage('Email updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setShowEmailModal(false)
        setIsLoading(false)
    }

    const handlePasswordSave = async () => {
        if (security.newPassword !== security.confirmPassword) {
            return
        }
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccessMessage('Password updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordModal(false)
        setIsLoading(false)
    }

    const handlePreferencesSave = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccessMessage('Preferences updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setIsLoading(false)
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                            Account Settings
                        </h1>
                        <p className="text-white/60 text-lg">
                            Manage your account preferences and security settings
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-8 p-4 bg-success-500/20 border-2 border-success-500/30 text-success-400 rounded-xl font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">✅</span>
                                {successMessage}
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Account Information */}
                        <div className="bg-white/[0.03] border border-white/[0.15] rounded-xl p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                        👤
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Account Information</h2>
                                        <p className="text-white/60">Manage your account details</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-white/[0.08]">
                                    <div>
                                        <div className="font-semibold text-white">Email Address</div>
                                        <div className="text-white/60">{user?.email}</div>
                                    </div>
                                    <button
                                        onClick={() => setShowEmailModal(true)}
                                        className="bg-white/[0.07] border border-white/[0.15] hover:bg-white/[0.1] hover:border-white/20 rounded-lg px-4 py-2 text-sm font-semibold text-white/90 transition-all duration-300"
                                    >
                                        Change Email
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-white/[0.08]">
                                    <div>
                                        <div className="font-semibold text-white">Username</div>
                                        <div className="text-white/60">{profile.username}</div>
                                    </div>
                                    <button className="bg-white/[0.07] border border-white/[0.15] hover:bg-white/[0.1] hover:border-white/20 rounded-lg px-4 py-2 text-sm font-semibold text-white/90 transition-all duration-300">
                                        Edit Username
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white/[0.03] border border-white/[0.15] rounded-xl p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                        🔒
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Security</h2>
                                        <p className="text-white/60">Manage your account security</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-white/[0.08]">
                                    <div>
                                        <div className="font-semibold text-white">Password</div>
                                        <div className="text-white/60">Last updated 3 months ago</div>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="bg-white/[0.07] border border-white/[0.15] hover:bg-white/[0.1] hover:border-white/20 rounded-lg px-4 py-2 text-sm font-semibold text-white/90 transition-all duration-300"
                                    >
                                        Change Password
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-white/[0.08]">
                                    <div>
                                        <div className="font-semibold text-white">Two-Factor Authentication</div>
                                        <div className="text-white/60">Not enabled</div>
                                    </div>
                                    <button className="bg-primary-500/90 hover:bg-primary-600 border border-primary-400/30 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Application Preferences */}
                        <div className="bg-white/[0.03] border border-white/[0.15] rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                    🎛️
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Application Preferences</h2>
                                    <p className="text-white/60">Customize your investment dashboard experience</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                                className="w-5 h-5 accent-primary-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-white">Email Notifications</div>
                                                <div className="text-sm text-white/60">Portfolio alerts and performance updates via email</div>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.phoneNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, phoneNotifications: e.target.checked })}
                                                className="w-5 h-5 accent-primary-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-white">SMS Notifications</div>
                                                <div className="text-sm text-white/60">Critical alerts and urgent updates via text message</div>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.marketingEmails}
                                                onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                                                className="w-5 h-5 accent-primary-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-white">Product Updates</div>
                                                <div className="text-sm text-white/60">New features and platform improvements</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                            Default Currency
                                        </label>
                                        <select
                                            value={preferences.currency}
                                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                            className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-all duration-300"
                                        >
                                            <option value="USD" className="bg-black text-white">USD - US Dollar</option>
                                            <option value="EUR" className="bg-black text-white">EUR - Euro</option>
                                            <option value="GBP" className="bg-black text-white">GBP - British Pound</option>
                                            <option value="JPY" className="bg-black text-white">JPY - Japanese Yen</option>
                                            <option value="CAD" className="bg-black text-white">CAD - Canadian Dollar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                            Timezone
                                        </label>
                                        <select
                                            value={preferences.timezone}
                                            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                            className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-all duration-300"
                                        >
                                            <option value="UTC" className="bg-black text-white">UTC</option>
                                            <option value="EST" className="bg-black text-white">Eastern Time</option>
                                            <option value="PST" className="bg-black text-white">Pacific Time</option>
                                            <option value="GMT" className="bg-black text-white">Greenwich Mean Time</option>
                                            <option value="CET" className="bg-black text-white">Central European Time</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handlePreferencesSave}
                                    disabled={isLoading}
                                    className="bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save Preferences'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/[0.03] border border-white/[0.15] rounded-xl p-8 w-full max-w-md backdrop-blur-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-white/40 hover:text-white/80 text-2xl transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={security.currentPassword}
                                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                    className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all duration-300"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={security.newPassword}
                                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                    className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all duration-300"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={security.confirmPassword}
                                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                    className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all duration-300"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="bg-white/[0.07] border border-white/[0.15] hover:bg-white/[0.1] hover:border-white/20 rounded-lg flex-1 py-3 font-semibold text-white/90 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordSave}
                                disabled={isLoading || !security.currentPassword || !security.newPassword || security.newPassword !== security.confirmPassword}
                                className="bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-black rounded-lg flex-1 py-3 font-semibold disabled:opacity-50 transition-all duration-300"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Change Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/[0.03] border border-white/[0.15] rounded-xl p-8 w-full max-w-md backdrop-blur-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Change Email</h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="text-white/40 hover:text-white/80 text-2xl transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Current Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                    New Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all duration-300"
                                    placeholder="Enter new email address"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="bg-white/[0.07] border border-white/[0.15] rounded-lg w-full px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all duration-300"
                                    placeholder="Enter your password to confirm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="bg-white/[0.07] border border-white/[0.15] hover:bg-white/[0.1] hover:border-white/20 rounded-lg flex-1 py-3 font-semibold text-white/90 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProfileSave}
                                disabled={isLoading}
                                className="bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-black rounded-lg flex-1 py-3 font-semibold transition-all duration-300"
                            >
                                {isLoading ? 'Updating...' : 'Update Email'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default Settings
