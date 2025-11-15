import { useState } from 'react'
import { ChatMessage, ResultType } from '../types/chat'

export const useChatState = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your AI strategy assistant. I can help you build tactical allocation strategies, analyze backtest results, and optimize your portfolios. What would you like to work on?",
            timestamp: new Date(),
            resultType: 'none'
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeResult, setActiveResult] = useState<ResultType>('none')

    const sendMessage = async (content: string) => {
        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
            resultType: 'none'
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)
        setError(null)

        try {
            // TODO: Replace with actual API call
            // Simulating AI response
            await new Promise(resolve => setTimeout(resolve, 1500))

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I understand you want to work on that. Let me help you build a strategy based on your requirements.",
                timestamp: new Date(),
                resultType: 'none'
            }

            setMessages(prev => [...prev, aiMessage])
        } catch (err) {
            setError('Failed to get response. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const clearMessages = () => {
        setMessages([{
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your AI strategy assistant. I can help you build tactical allocation strategies, analyze backtest results, and optimize your portfolios. What would you like to work on?",
            timestamp: new Date(),
            resultType: 'none'
        }])
        setActiveResult('none')
        setError(null)
    }

    return {
        messages,
        isLoading,
        error,
        activeResult,
        sendMessage,
        clearMessages,
        setActiveResult
    }
}
