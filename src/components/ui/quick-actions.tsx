'use client';

import { QUICK_ACTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface QuickActionsProps {
    onSelect: (query: string) => void;
    disabled?: boolean;
}

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {QUICK_ACTIONS.map((action, index) => (
                <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelect(action.query)}
                    disabled={disabled}
                    className={cn(
                        'px-5 py-2.5 rounded-full text-sm font-medium',
                        'bg-card text-card-foreground border-2 border-border',
                        'hover:border-primary hover:text-primary',
                        'transition-all duration-200 shadow-sm hover:shadow-md',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border'
                    )}
                >
                    {action.label}
                </motion.button>
            ))}
        </div>
    );
}
