'use client';

import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart, Star, ExternalLink, Truck } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
    hit: Product;
}

export function ProductCard({ hit }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const renderStars = (rating: number = 0) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={12}
                className={cn(
                    i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
                )}
            />
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
            transition={{ duration: 0.2 }}
            className={cn(
                'flex-shrink-0 w-64 bg-card',
                'rounded-2xl border border-border',
                'overflow-hidden cursor-pointer',
                'shadow-sm hover:shadow-xl transition-all duration-300'
            )}
        >
            {/* Image Container */}
            <div className="relative h-44 w-full bg-muted overflow-hidden">
                <div className="relative w-full h-full p-2">
                    <Image
                        src={hit.image}
                        alt={hit.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Favorite Button */}
                <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className={cn(
                        'absolute top-3 right-3 p-2 rounded-full',
                        'bg-background/95 shadow-md',
                        'hover:scale-110 transition-transform'
                    )}
                >
                    <Heart
                        size={16}
                        className={cn(
                            'transition-colors',
                            isFavorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                        )}
                    />
                </button>

                {/* Free Shipping Badge */}
                {hit.free_shipping && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        <Truck size={12} />
                        Free Shipping
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Brand */}
                {hit.brand && (
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                        {hit.brand}
                    </p>
                )}

                {/* Name */}
                <h3 className="text-sm font-semibold text-card-foreground line-clamp-2 leading-snug min-h-[2.5em]">
                    {hit.name}
                </h3>

                {/* Rating */}
                {hit.rating !== undefined && (
                    <div className="flex items-center gap-1">
                        {renderStars(hit.rating)}
                        <span className="ml-1 text-xs text-muted-foreground">({hit.rating})</span>
                    </div>
                )}

                {/* Price and Link */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-foreground">
                        {formatPrice(hit.price)}
                    </span>

                    {hit.url && (
                        <a
                            href={hit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                            View <ExternalLink size={12} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
