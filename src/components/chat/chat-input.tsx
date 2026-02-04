'use client';

import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormEvent, ChangeEvent } from 'react';

interface ChatInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ value, onChange, onSubmit, disabled, placeholder = 'Ask me anything...' }: ChatInputProps) {
    return (
        <form onSubmit={onSubmit} className="relative flex items-center">
            <input
                type="text"
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                    'w-full rounded-2xl border-2 border-input',
                    'bg-background',
                    'px-5 py-4 pr-14 text-[15px] text-foreground',
                    'placeholder:text-muted-foreground',
                    'focus:outline-none focus:border-ring',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    'transition-colors shadow-sm'
                )}
            />
            <button
                type="submit"
                disabled={disabled || !value.trim()}
                className={cn(
                    'absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90 active:scale-95',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary',
                    'transition-all shadow-md'
                )}
            >
                {disabled ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Send size={18} />
                )}
            </button>
        </form>
    );
}
