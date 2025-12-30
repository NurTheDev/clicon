import React from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import { BsCart2 } from 'react-icons/bs';

interface Product {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    discountPercentage: number;
    rating: number;
    brand?: string;
    category: string;
    stock: number;
    availabilityStatus: string;
    sku: string;
    warrantyInformation?: string;
    shippingInformation?: string;
    returnPolicy?: string;
}

interface ProductCompareProps {
    products: Product[];
    onRemoveProduct: (productId: number) => void;
    onAddToCart: (product: Product) => void;
    maxProducts?: number;
}

const ProductCompare: React.FC<ProductCompareProps> = ({
                                                           products,
                                                           onRemoveProduct,
                                                           onAddToCart,
                                                           maxProducts = 4
                                                       }) => {
    const emptySlots = maxProducts - products.length;

    const comparisonFields = [
        { key: 'price', label: 'Price', render: (p: Product) => `$${p.price.toFixed(2)}` },
        { key: 'discount', label: 'Discount', render: (p: Product) => `${p.discountPercentage}%` },
        { key: 'rating', label: 'Rating', render: (p: Product) => (
                <div className="flex items-center gap-1">
                    <FaStar className="text-primary-500 w-4 h-4" />
                    <span>{p.rating}</span>
                </div>
            )},
        { key: 'brand', label: 'Brand', render: (p: Product) => p.brand || 'N/A' },
        { key: 'category', label: 'Category', render: (p: Product) => p.category },
        { key: 'stock', label: 'Stock', render: (p: Product) => p.stock },
        { key: 'availability', label: 'Availability', render: (p: Product) => (
                <span className={p.availabilityStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'}>
                {p.availabilityStatus}
            </span>
            )},
        { key: 'sku', label: 'SKU', render: (p: Product) => p.sku },
        { key: 'warranty', label: 'Warranty', render: (p: Product) => p.warrantyInformation || 'N/A' },
        { key: 'shipping', label: 'Shipping', render: (p: Product) => p.shippingInformation || 'N/A' },
        { key: 'return', label: 'Return Policy', render: (p: Product) => p.returnPolicy || 'N/A' },
    ];

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 text-lg mb-2">No products to compare</p>
                    <p className="text-gray-400 text-sm">Add products to compare their features</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Compare Products</h2>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                    {/* Product Images & Basic Info */}
                    <thead>
                    <tr>
                        <th className="w-32 md:w-40 p-3 bg-gray-50 border border-gray-200 text-left text-sm font-medium text-gray-600">
                            Product
                        </th>
                        {products.map((product) => (
                            <th key={product.id} className="p-3 border border-gray-200 bg-white min-w-[200px]">
                                <div className="relative">
                                    <button
                                        onClick={() => onRemoveProduct(product.id)}
                                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-24 h-24 md:w-32 md:h-32 object-contain mb-3"
                                        />
                                        <h3 className="text-sm md:text-base font-medium text-center line-clamp-2 mb-2">
                                            {product.title}
                                        </h3>
                                        <button
                                            onClick={() => onAddToCart(product)}
                                            className="bg-primary-500 text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-primary-600 transition-colors"
                                        >
                                            <BsCart2 /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </th>
                        ))}
                        {[...Array(emptySlots)].map((_, index) => (
                            <th key={`empty-${index}`} className="p-3 border border-gray-200 bg-gray-50 min-w-[200px]">
                                <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-400 text-sm">Add Product</p>
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>

                    {/* Comparison Fields */}
                    <tbody>
                    {comparisonFields.map((field) => (
                        <tr key={field.key}>
                            <td className="p-3 bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600">
                                {field.label}
                            </td>
                            {products.map((product) => (
                                <td key={product.id} className="p-3 border border-gray-200 text-sm text-center">
                                    {field.render(product)}
                                </td>
                            ))}
                            {[...Array(emptySlots)].map((_, index) => (
                                <td key={`empty-${index}`} className="p-3 border border-gray-200 bg-gray-50 text-center text-gray-300">
                                    —
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(ProductCompare);
