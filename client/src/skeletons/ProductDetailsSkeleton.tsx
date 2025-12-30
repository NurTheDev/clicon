const ProductDetailsSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-4 md:py-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left - Image Gallery Skeleton */}
                <div className="w-full">
                    {/* Main Image */}
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] bg-gray-200 rounded" />
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="flex gap-2 overflow-x-auto flex-1">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="w-14 h-14 md:w-20 md:h-20 bg-gray-200 rounded flex-shrink-0"
                                />
                            ))}
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0" />
                    </div>
                </div>

                {/* Right - Product Info Skeleton */}
                <div className="w-full">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                            ))}
                        </div>
                        <div className="w-8 h-4 bg-gray-200 rounded" />
                        <div className="w-24 h-4 bg-gray-200 rounded" />
                    </div>

                    {/* Title */}
                    <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4 mb-4" />

                    {/* SKU & Availability */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-36" />
                    </div>

                    {/* Brand & Category */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-1">
                        <div className="h-4 bg-gray-200 rounded w-28" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 bg-gray-200 rounded w-24" />
                        <div className="h-5 bg-gray-200 rounded w-20" />
                        <div className="h-6 bg-gray-200 rounded w-16" />
                    </div>

                    <hr className="mb-6" />

                    {/* Color & Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-12 mb-2" />
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 bg-gray-200 rounded-full" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-10 mb-2" />
                            <div className="h-10 bg-gray-200 rounded w-full" />
                        </div>
                    </div>

                    {/* Memory & Storage */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
                            <div className="h-10 bg-gray-200 rounded w-full" />
                        </div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-14 mb-2" />
                            <div className="h-10 bg-gray-200 rounded w-full" />
                        </div>
                    </div>

                    {/* Quantity & Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                        <div className="h-12 bg-gray-200 rounded w-32" />
                        <div className="flex flex-1 gap-3">
                            <div className="flex-1 h-12 bg-gray-200 rounded" />
                            <div className="h-12 bg-gray-200 rounded w-28" />
                        </div>
                    </div>

                    {/* Wishlist & Compare */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="flex gap-4">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-4 bg-gray-200 rounded w-32" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-12" />
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Safe Checkout */}
                    <div className="border border-gray-200 rounded p-4">
                        <div className="h-5 bg-gray-200 rounded w-56 mb-3" />
                        <div className="flex items-center gap-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-10 h-6 bg-gray-200 rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSkeleton;
