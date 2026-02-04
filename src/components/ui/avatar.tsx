'use client';

import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface AvatarProps {
    role: 'user' | 'assistant';
    className?: string;
}

export function Avatar({ role, className }: AvatarProps) {
    const isUser = role === 'user';

    return (
        <div
            className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm',
                isUser
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground',
                className
            )}
        >
            {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
    );
}
