import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { Send, Plus, MessageSquare, TrendingUp, PieChart, DollarSign, BarChart3, History, Trash2 } from 'lucide-react'

interface Message {
    id: string
    type: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface Conversation {
    id: string
    title: string
    messages: Message[]
    lastUpdated: Date
}

const starterQuestions = [
    {
        icon: TrendingUp,
        title: "Analyze my portfolio performance",
        description: "Get insights on your investment returns and risk metrics",
        question: "Can you analyze my current portfolio performance and suggest areas for improvement?"
    },
    {
        icon: PieChart,
        title: "Optimize asset allocation",
        description: "Review and optimize your current asset allocation strategy",
        question: "What's the optimal asset allocation for my risk profile and investment goals?"
    },
    {
        icon: DollarSign,
        title: "Investment strategies",
        description: "Explore different investment strategies and approaches",
        question: "What are some proven investment strategies that would work well for my situation?"
    },
    {
        icon: BarChart3,
        title: "Market analysis",
        description: "Get current market insights and trends analysis",
        question: "What are the current market trends I should be aware of for my investments?"
    }
]

const AIChat = () => {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentConversation?.messages])

    const createNewConversation = () => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: 'New conversation',
            messages: [],
            lastUpdated: new Date()
        }
        setConversations(prev => [newConversation, ...prev])
        setCurrentConversation(newConversation)
        setShowHistory(false)
    }

    const selectConversation = (conversation: Conversation) => {
        setCurrentConversation(conversation)
        setShowHistory(false)
    }

    const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setConversations(prev => prev.filter(c => c.id !== conversationId))
        if (currentConversation?.id === conversationId) {
            setCurrentConversation(null)
        }
    }



    const generateTitle = (firstMessage: string) => {
        return firstMessage.length > 50
            ? firstMessage.substring(0, 47) + '...'
            : firstMessage
    }

    const sendMessage = async (messageText?: string) => {
        const textToSend = messageText || message.trim()
        if (!textToSend || isLoading) return

        let conversationToUse = currentConversation

        if (!conversationToUse) {
            // Create new conversation synchronously
            const newConversation: Conversation = {
                id: Date.now().toString(),
                title: 'New conversation',
                messages: [],
                lastUpdated: new Date()
            }
            setConversations(prev => [newConversation, ...prev])
            setCurrentConversation(newConversation)
            conversationToUse = newConversation
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: textToSend,
            timestamp: new Date()
        }

        // Update conversation with user message
        const updatedConversation = {
            ...conversationToUse,
            messages: [...conversationToUse.messages, userMessage],
            lastUpdated: new Date()
        }

        // Update title if it's the first message
        if (conversationToUse.messages.length === 0) {
            updatedConversation.title = generateTitle(textToSend)
        }

        setCurrentConversation(updatedConversation)
        setConversations(prev => prev.map(c =>
            c.id === conversationToUse.id ? updatedConversation : c
        ))
        setMessage('')
        setIsLoading(true)

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: getAIResponse(),
                timestamp: new Date()
            }

            const finalConversation = {
                ...updatedConversation,
                messages: [...updatedConversation.messages, aiMessage],
                lastUpdated: new Date()
            }

            setCurrentConversation(finalConversation)
            setConversations(prev => prev.map(c =>
                c.id === conversationToUse.id ? finalConversation : c
            ))
            setIsLoading(false)
        }, 1500)
    }

    const getAIResponse = (): string => {
        // Simple response logic - in real app, this would call your AI service
        const responses = [
            "I'd be happy to help you with your investment analysis. Based on your portfolio, I can see several opportunities for optimization. Let me break down some key insights for you.",
            "That's a great question about portfolio diversification. Here are some strategies that could work well for your investment goals and risk tolerance.",
            "Market conditions are always evolving. Let me provide you with some current insights and how they might impact your investment strategy.",
            "I can help you analyze your asset allocation. A well-balanced portfolio typically considers your age, risk tolerance, and investment timeline."
        ]
        return responses[Math.floor(Math.random() * responses.length)]
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }

    useEffect(() => {
        adjustTextareaHeight()
    }, [message])



    return (
        <Layout>
            <div className="flex h-full max-h-[calc(100vh-2rem)] relative">
                {/* Conversation History Sidebar */}
                <div className={`${showHistory ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-16 z-50 w-80 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-y-auto lg:left-0 lg:z-auto`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Conversations</h2>
                                <button
                                    onClick={createNewConversation}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-300"
                                    title="New conversation"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {conversations.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageSquare className="mx-auto mb-3 opacity-50" size={32} />
                                    <p className="text-sm">No conversations yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Start chatting to see your history</p>
                                </div>
                            ) : (
                                conversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        onClick={() => selectConversation(conversation)}
                                        className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${currentConversation?.id === conversation.id
                                            ? 'bg-gray-100 border border-gray-200'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <MessageSquare size={16} className="mt-0.5 text-gray-600 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {conversation.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {conversation.messages.length} messages
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => deleteConversation(conversation.id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger-500/20 text-danger-400 transition-all duration-200"
                                            title="Delete conversation"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-300"
                                >
                                    <History size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                                    <MessageSquare className="text-white" size={20} />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                                        {currentConversation?.title || 'Backfolio AI Assistant'}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Your intelligent investment advisor
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                        {!currentConversation || currentConversation.messages.length === 0 ? (
                            <div className="max-w-2xl mx-auto">
                                {/* Welcome Message */}
                                <div className="text-center mb-12">
                                    <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                                        <MessageSquare className="text-white" size={24} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                        What can I help with?
                                    </h2>
                                    <p className="text-lg text-gray-600">
                                        Ask me anything about your investments, portfolio analysis, or market insights
                                    </p>
                                </div>

                                {/* Starter Questions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {starterQuestions.map((item, index) => {
                                        const IconComponent = item.icon
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => sendMessage(item.question)}
                                                className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md hover:border-gray-300 transition-all duration-300 group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-all duration-300">
                                                        <IconComponent size={20} className="text-gray-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-2 tracking-tight">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* Messages */
                            currentConversation.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] ${msg.type === 'user'
                                            ? 'bg-blue-600 text-white rounded-2xl rounded-br-md'
                                            : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md'
                                            } p-4`}
                                    >
                                        <p className={`${msg.type === 'user' ? 'text-white' : 'text-gray-900'} leading-relaxed`}>
                                            {msg.content}
                                        </p>
                                        <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Loading Message */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span className="text-sm">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-gray-200 bg-white">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                <textarea
                                    ref={textareaRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about your investments..."
                                    className="bg-white border border-gray-300 rounded-lg w-full p-4 pr-12 resize-none min-h-[52px] max-h-[120px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!message.trim() || isLoading}
                                    className="absolute right-3 bottom-3 p-2 rounded-lg bg-gradient-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Press Enter to send, Shift + Enter for new line
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile history */}
                {showHistory && (
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setShowHistory(false)}
                    />
                )}
            </div>
        </Layout>
    )
}

export default AIChat
