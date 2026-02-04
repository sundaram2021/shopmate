'use client';

import { Avatar } from '@/components/ui/avatar';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    children?: React.ReactNode;
}

export function MessageBubble({ role, content, children }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
        >
            <div className={cn('flex gap-3 max-w-[88%] md:max-w-[78%]', isUser && 'flex-row-reverse')}>
                <Avatar role={role} />
                <div className="space-y-3 min-w-0">
                    {content && (
                        <div
                            className={cn(
                                'rounded-2xl px-4 py-3 shadow-sm',
                                isUser
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card text-card-foreground border border-border'
                            )}
                        >
                            <div className={cn(
                                'prose prose-sm max-w-none prose-chat',
                                isUser
                                    ? 'prose-p:text-primary-foreground prose-strong:text-primary-foreground'
                                    : 'dark:prose-invert'
                            )}>
                                <Markdown>{content}</Markdown>
                            </div>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </motion.div>
    );
}

export function LoadingBubble() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-3"
        >
            <Avatar role="assistant" />
            <div className="rounded-2xl bg-card border border-border shadow-sm">
                <TypingIndicator />
            </div>
        </motion.div>
    );
}
