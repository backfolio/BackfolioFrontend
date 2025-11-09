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
                        <h1 className="text-4xl font-bold text-premium-900 mb-3 tracking-tight">
                            Account Settings
                        </h1>
                        <p className="text-premium-600 text-lg">
                            Manage your account preferences and security settings
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-8 p-4 bg-success-50 border-2 border-success-200 text-success-700 rounded-xl font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">✅</span>
                                {successMessage}
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Account Information */}
                        <div className="card-investment p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                        👤
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-premium-900">Account Information</h2>
                                        <p className="text-premium-600">Manage your account details</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                                    <div>
                                        <div className="font-semibold text-premium-900">Email Address</div>
                                        <div className="text-premium-600">{user?.email}</div>
                                    </div>
                                    <button
                                        onClick={() => setShowEmailModal(true)}
                                        className="btn-secondary px-4 py-2 text-sm font-semibold"
                                    >
                                        Change Email
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                                    <div>
                                        <div className="font-semibold text-premium-900">Username</div>
                                        <div className="text-premium-600">{profile.username}</div>
                                    </div>
                                    <button className="btn-secondary px-4 py-2 text-sm font-semibold">
                                        Edit Username
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="card-investment p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                        🔒
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-premium-900">Security</h2>
                                        <p className="text-premium-600">Manage your account security</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                                    <div>
                                        <div className="font-semibold text-premium-900">Password</div>
                                        <div className="text-premium-600">Last updated 3 months ago</div>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="btn-secondary px-4 py-2 text-sm font-semibold"
                                    >
                                        Change Password
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                                    <div>
                                        <div className="font-semibold text-premium-900">Two-Factor Authentication</div>
                                        <div className="text-premium-600">Not enabled</div>
                                    </div>
                                    <button className="btn-investment px-4 py-2 text-sm font-semibold text-white">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Application Preferences */}
                        <div className="card-investment p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                                    🎛️
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-premium-900">Application Preferences</h2>
                                    <p className="text-premium-600">Customize your investment dashboard experience</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-premium-900 mb-4">Notifications</h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                                className="w-5 h-5 accent-primary-600"
                                            />
                                            <div>
                                                <div className="font-semibold text-premium-900">Email Notifications</div>
                                                <div className="text-sm text-premium-600">Portfolio alerts and performance updates via email</div>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.phoneNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, phoneNotifications: e.target.checked })}
                                                className="w-5 h-5 accent-primary-600"
                                            />
                                            <div>
                                                <div className="font-semibold text-premium-900">SMS Notifications</div>
                                                <div className="text-sm text-premium-600">Critical alerts and urgent updates via text message</div>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.marketingEmails}
                                                onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                                                className="w-5 h-5 accent-primary-600"
                                            />
                                            <div>
                                                <div className="font-semibold text-premium-900">Product Updates</div>
                                                <div className="text-sm text-premium-600">New features and platform improvements</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                            Default Currency
                                        </label>
                                        <select
                                            value={preferences.currency}
                                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                            className="form-investment w-full px-4 py-3"
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="JPY">JPY - Japanese Yen</option>
                                            <option value="CAD">CAD - Canadian Dollar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                            Timezone
                                        </label>
                                        <select
                                            value={preferences.timezone}
                                            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                            className="form-investment w-full px-4 py-3"
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="EST">Eastern Time</option>
                                            <option value="PST">Pacific Time</option>
                                            <option value="GMT">Greenwich Mean Time</option>
                                            <option value="CET">Central European Time</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handlePreferencesSave}
                                    disabled={isLoading}
                                    className="btn-investment px-8 py-3 text-white font-semibold"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="card-investment p-8 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-premium-900">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-premium-400 hover:text-premium-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={security.currentPassword}
                                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                    className="form-investment w-full px-4 py-3"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={security.newPassword}
                                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                    className="form-investment w-full px-4 py-3"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={security.confirmPassword}
                                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                    className="form-investment w-full px-4 py-3"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="btn-ghost flex-1 py-3 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordSave}
                                disabled={isLoading || !security.currentPassword || !security.newPassword || security.newPassword !== security.confirmPassword}
                                className="btn-investment flex-1 py-3 text-white font-semibold disabled:opacity-50"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Change Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="card-investment p-8 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-premium-900">Change Email</h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="text-premium-400 hover:text-premium-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Current Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="form-investment w-full px-4 py-3 opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                    New Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="form-investment w-full px-4 py-3"
                                    placeholder="Enter new email address"
                                />
                            </div>
                            <div>
                                <label className="block text-premium-800 mb-2 text-sm font-bold uppercase tracking-wide">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="form-investment w-full px-4 py-3"
                                    placeholder="Enter your password to confirm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="btn-ghost flex-1 py-3 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProfileSave}
                                disabled={isLoading}
                                className="btn-investment flex-1 py-3 text-white font-semibold"
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
