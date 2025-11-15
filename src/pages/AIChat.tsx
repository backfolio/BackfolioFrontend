import React from 'react'
import { useTheme } from '../context/ThemeContext'
import Layout from '../components/Layout'
import ChatPanel from '../components/chat/ChatPanel'
import ResultsPanel from '../components/chat/ResultsPanel'
import { useChatState } from '../hooks/useChatState'

const AIChat: React.FC = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const {
        messages,
        isLoading,
        error,
        activeResult,
        sendMessage,
        clearMessages
    } = useChatState()

    return (
        <Layout>
            <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
                {/* Header */}
                <div className={`border-b ${isDark ? 'border-white/10 bg-black' : 'border-slate-200 bg-white'} sticky top-0 z-10`}>
                    <div className="px-8 py-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Strategy Assistant
                                </h1>
                                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                                    Build and analyze strategies
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
                                <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                                    Ready
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="px-8 py-4 bg-red-50 border-b border-red-200">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Split layout - Results on left, Chat on right */}
                <div className="flex h-[calc(100vh-100px)]">
                    {/* Left: Results Panel */}
                    <div className={`flex-1 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
                        <ResultsPanel
                            resultType={activeResult}
                            resultData={null}
                            isDark={isDark}
                        />
                    </div>

                    {/* Right: Chat Panel */}
                    <div className="w-[420px] flex-shrink-0">
                        <ChatPanel
                            messages={messages}
                            isLoading={isLoading}
                            onSendMessage={sendMessage}
                            onClearMessages={clearMessages}
                            isDark={isDark}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AIChat
