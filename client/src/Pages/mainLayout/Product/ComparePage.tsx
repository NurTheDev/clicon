// client/src/Pages/mainLayout/Product/ComparePage.tsx
import React, { useState, useEffect } from 'react';
import Breadcrumbs from "../../../common/Breadcrumbs.tsx";
import ProductCompare from "./component/ProductCompare.tsx";

const ComparePage: React.FC = () => {
    const [compareProducts, setCompareProducts] = useState<any[]>([]);

    useEffect(() => {
        // Load from localStorage
        const stored = localStorage.getItem('compareProducts');
        if (stored) {
            setCompareProducts(JSON.parse(stored));
        }
    }, []);

    const handleRemoveProduct = (productId: number) => {
        const updated = compareProducts.filter(p => p.id !== productId);
        setCompareProducts(updated);
        localStorage.setItem('compareProducts', JSON.stringify(updated));
    };

    const handleAddToCart = (product: any) => {
        console.log('Add to cart:', product);
        // Implement cart logic
    };

    return (
        <div className="min-h-screen">
            <Breadcrumbs />
            <ProductCompare
                products={compareProducts}
                onRemoveProduct={handleRemoveProduct}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default React.memo(ComparePage);
