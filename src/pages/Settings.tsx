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
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                            Account Settings
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Manage your account preferences and security settings
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-8 p-4 bg-success-500/20 border-2 border-success-500/30 text-success-700 rounded-xl font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">✅</span>
                                {successMessage}
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Account Information */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                        👤
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Account Information</h2>
                                        <p className="text-gray-600">Manage your account details</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <div className="font-semibold text-gray-900">Email Address</div>
                                        <div className="text-gray-600">{user?.email}</div>
                                    </div>
                                    <button
                                        onClick={() => setShowEmailModal(true)}
                                        className="bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300"
                                    >
                                        Change Email
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <div className="font-semibold text-gray-900">Username</div>
                                        <div className="text-gray-600">{profile.username}</div>
                                    </div>
                                    <button className="bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300">
                                        Edit Username
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                        🔒
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Security</h2>
                                        <p className="text-gray-600">Manage your account security</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <div className="font-semibold text-gray-900">Password</div>
                                        <div className="text-gray-600">Last updated 3 months ago</div>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300"
                                    >
                                        Change Password
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <div className="font-semibold text-gray-900">Two-Factor Authentication</div>
                                        <div className="text-gray-600">Not enabled</div>
                                    </div>
                                    <button className="bg-primary-500/90 hover:bg-primary-600 border border-primary-400/30 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Application Preferences */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                    🎛️
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Application Preferences</h2>
                                    <p className="text-gray-600">Customize your investment dashboard experience</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                                className="w-5 h-5 accent-primary-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">Email Notifications</div>
                                                <div className="text-sm text-gray-600">Portfolio alerts and performance updates via email</div>
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
                                                <div className="font-semibold text-gray-900">SMS Notifications</div>
                                                <div className="text-sm text-gray-600">Critical alerts and urgent updates via text message</div>
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
                                                <div className="font-semibold text-gray-900">Product Updates</div>
                                                <div className="text-sm text-gray-600">New features and platform improvements</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                            Default Currency
                                        </label>
                                        <select
                                            value={preferences.currency}
                                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                            className="bg-white border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                        >
                                            <option value="USD" className="bg-white text-gray-900">USD - US Dollar</option>
                                            <option value="EUR" className="bg-white text-gray-900">EUR - Euro</option>
                                            <option value="GBP" className="bg-white text-gray-900">GBP - British Pound</option>
                                            <option value="JPY" className="bg-white text-gray-900">JPY - Japanese Yen</option>
                                            <option value="CAD" className="bg-white text-gray-900">CAD - Canadian Dollar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                            Timezone
                                        </label>
                                        <select
                                            value={preferences.timezone}
                                            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                            className="bg-white border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                        >
                                            <option value="UTC" className="bg-white text-gray-900">UTC</option>
                                            <option value="EST" className="bg-white text-gray-900">Eastern Time</option>
                                            <option value="PST" className="bg-white text-gray-900">Pacific Time</option>
                                            <option value="GMT" className="bg-white text-gray-900">Greenwich Mean Time</option>
                                            <option value="CET" className="bg-white text-gray-900">Central European Time</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handlePreferencesSave}
                                    disabled={isLoading}
                                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md"
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={security.currentPassword}
                                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                    className="bg-white border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={security.newPassword}
                                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                    className="bg-white border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={security.confirmPassword}
                                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                    className="bg-white border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-lg flex-1 py-3 font-semibold text-gray-700 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordSave}
                                disabled={isLoading || !security.currentPassword || !security.newPassword || security.newPassword !== security.confirmPassword}
                                className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex-1 py-3 font-semibold disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Change Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Change Email</h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Current Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-gray-100 border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-500 opacity-70"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                    New Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="bg-white border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                    placeholder="Enter new email address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="bg-white border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                    placeholder="Enter your password to confirm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-lg flex-1 py-3 font-semibold text-gray-700 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProfileSave}
                                disabled={isLoading}
                                className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex-1 py-3 font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
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
