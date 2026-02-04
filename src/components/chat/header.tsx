'use client';

import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MessageSquarePlus, Github } from 'lucide-react';

interface HeaderProps {
    onNewChat?: () => void;
    showNewChat?: boolean;
}

export function Header({ onNewChat, showNewChat = false }: HeaderProps) {
    return (
        <header className="flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 md:px-6 sticky top-0 z-50">
            <Logo />

            <div className="flex items-center gap-2">
                {showNewChat && onNewChat && (
                    <button
                        onClick={onNewChat}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                        <MessageSquarePlus size={18} />
                        <span className="hidden sm:inline">New Chat</span>
                    </button>
                )}

                <a
                    href="https://github.com/shopmate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                    aria-label="GitHub"
                >
                    <Github size={18} />
                </a>

                <ThemeToggle />
            </div>
        </header>
    );
}
