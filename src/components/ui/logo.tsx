'use client';

import { ShoppingBag } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Logo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <ShoppingBag size={18} />
            </div>
            <h1 className="text-xl font-bold text-foreground">
                {APP_NAME}
            </h1>
        </div>
    );
}
