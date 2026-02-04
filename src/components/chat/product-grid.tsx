'use client';

import { Product } from '@/types';
import { ProductCard } from '@/components/product-card';

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <p className="text-sm italic text-muted-foreground px-1">
                No products found for this search.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
                Found {products.length} products
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {products.map((product) => (
                    <div key={product.objectID} className="snap-start">
                        <ProductCard hit={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
