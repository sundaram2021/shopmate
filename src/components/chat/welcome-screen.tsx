'use client';

import { Sparkles, ShoppingBag, Zap, Search } from 'lucide-react';
import { QuickActions } from '@/components/ui/quick-actions';
import { APP_DESCRIPTION, APP_TAGLINE } from '@/lib/constants';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
    onSelectAction: (query: string) => void;
    disabled?: boolean;
}

export function WelcomeScreen({ onSelectAction, disabled }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 max-w-2xl"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-lg"
                >
                    <Sparkles size={40} />
                </motion.div>

                {/* Title */}
                <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        {APP_DESCRIPTION}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        {APP_TAGLINE}
                    </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <FeaturePill icon={<Search size={14} />} text="Smart Search" />
                    <FeaturePill icon={<Zap size={14} />} text="Instant Results" />
                    <FeaturePill icon={<ShoppingBag size={14} />} text="Best Products" />
                </div>

                {/* Quick Actions */}
                <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Try asking:
                    </p>
                    <QuickActions onSelect={onSelectAction} disabled={disabled} />
                </div>
            </motion.div>
        </div>
    );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
            {icon}
            <span>{text}</span>
        </div>
    );
}
