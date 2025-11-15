import React, { useRef, useEffect } from 'react'
import { ChatMessage } from '../../types/chat'

interface ChatPanelProps {
    messages: ChatMessage[]
    isLoading: boolean
    onSendMessage: (message: string) => void
    onClearMessages: () => void
    isDark?: boolean
}

const STARTER_PROMPTS = [
    {
        text: 'Build a momentum strategy',
        category: 'Create'
    },
    {
        text: 'Analyze my last backtest',
        category: 'Analyze'
    },
    {
        text: 'Add a defensive rule',
        category: 'Optimize'
    },
    {
        text: 'Compare recent backtests',
        category: 'Compare'
    }
]

const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    isLoading,
    onSendMessage,
    onClearMessages,
    isDark = false
}) => {
    const [input, setInput] = React.useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim())
            setInput('')
        }
    }

    const handlePromptClick = (text: string) => {
        if (!isLoading) {
            onSendMessage(text)
        }
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-black border-white/10' : 'bg-white border-slate-200'} border-l`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 ${isDark ? 'border-white/10' : 'border-slate-200'} border-b`}>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Conversation</h2>
                <button
                    onClick={onClearMessages}
                    className={`p-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'} rounded-lg transition-colors`}
                    title="Clear chat"
                >
                    <svg className={`w-4 h-4 ${isDark ? 'text-white/40 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                            ? 'bg-slate-700'
                            : 'bg-purple-600'
                            }`}>
                            {message.role === 'user' ? (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            )}
                        </div>
                        <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                            <div className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                                ? isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'
                                : isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'} mt-1 px-1`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>
                        <div className={`${isDark ? 'bg-white/10' : 'bg-slate-100'} rounded-2xl px-4 py-3`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 ${isDark ? 'bg-white/40' : 'bg-slate-400'} rounded-full animate-bounce`}></div>
                                <div className={`w-2 h-2 ${isDark ? 'bg-white/40' : 'bg-slate-400'} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                                <div className={`w-2 h-2 ${isDark ? 'bg-white/40' : 'bg-slate-400'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Starter Prompts (show when no messages) */}
            {messages.length <= 1 && (
                <div className="px-6 pb-4">
                    <p className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-slate-500'} mb-3`}>Quick actions</p>
                    <div className="grid grid-cols-2 gap-2">
                        {STARTER_PROMPTS.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePromptClick(prompt.text)}
                                disabled={isLoading}
                                className={`flex items-start gap-2 p-3 text-left text-sm ${isDark
                                        ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                                    } border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-slate-500'} mb-1`}>{prompt.category}</p>
                                    <p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{prompt.text}</p>
                                </div>
                                <svg className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className={`px-6 py-4 ${isDark ? 'border-white/10 bg-black' : 'border-slate-200 bg-white'} border-t`}>
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 ${isDark
                                ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-white/20'
                                : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-slate-400'
                            } border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className={`px-4 py-2.5 ${isDark
                                ? 'bg-white text-black hover:bg-white/90'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            } rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-sm`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatPanel
