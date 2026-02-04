'use client';

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    products?: Product[];
}

interface ChatState {
    messages: Message[];
    input: string;
    isLoading: boolean;
}

interface ChatActions {
    updateInput: (value: string) => void;
    submit: (e?: React.FormEvent) => void;
    send: (message: string) => void;
    clearMessages: () => void;
}

interface ChatMeta {
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

interface ChatContextValue {
    state: ChatState;
    actions: ChatActions;
    meta: ChatMeta;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const updateInput = (value: string) => {
        setInput(value);
    };

    const sendChatMessage = async (userMessage: string) => {
        if (!userMessage.trim() || isLoading) return;

        // Add user message
        const userMsg: Message = {
            id: generateId(),
            role: 'user',
            content: userMessage,
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare messages for API
            const apiMessages = [...messages, userMsg].map(m => ({
                role: m.role,
                parts: [{ type: 'text', text: m.content }],
            }));

            // Note: In a real app we might want to abstract the API call too, 
            // but for this refactor we'll keep it in the provider.
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Extract products from tool results
            let products: Product[] = [];
            if (data.toolResults && Array.isArray(data.toolResults)) {
                for (const tr of data.toolResults) {
                    if (tr.name === 'searchProducts' && Array.isArray(tr.result)) {
                        products = tr.result;
                    }
                }
            }

            // Add assistant message
            const assistantMsg: Message = {
                id: generateId(),
                role: 'assistant',
                content: data.text || 'I apologize, I encountered an issue. Please try again.',
                products: products.length > 0 ? products : undefined,
            };

            setMessages(prev => [...prev, assistantMsg]);

        } catch (error) {
            console.error('[ShopMate] Error:', error);

            const errorMsg: Message = {
                id: generateId(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        sendChatMessage(input);
    };

    const handleClearMessages = () => {
        setMessages([]);
    };

    const value: ChatContextValue = {
        state: {
            messages,
            input,
            isLoading,
        },
        actions: {
            updateInput,
            submit: handleSubmit,
            send: sendChatMessage,
            clearMessages: handleClearMessages,
        },
        meta: {
            scrollRef,
        },
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}
