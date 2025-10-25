/**
 * Renders a skeleton loader component that mimics the layout of the ProductCard.
 * It uses the 'animate-pulse' utility to simulate a loading state.
 */
const ProductCardSkeleton = () => {
    // Mimics the outer wrapper styling from the original ProductCard
    return (
        <div className={"flex flex-col items-start text-start gap-y-2 p-4 rounded-lg" +
            " border border-gray-100 relative w-[234px]"}
        >
            <div className="animate-pulse w-full">
                {/* Image Placeholder */}
                <div
                    className={"!w-[202px] !h-[172px] bg-gray-200 rounded-md mx-auto"}
                    style={{ minHeight: '172px' }} // Ensure height stability
                >
                    {/* Placeholder for the image */}
                </div>

                <div className={"space-y-4 mt-4"}>
                    {/* Rating and Review Count Placeholder */}
                    <div className="flex items-center gap-2">
                        {/* Star placeholders (mimicking the 5-star structure) */}
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-4 w-4 bg-gray-200 rounded-full"></div>
                            ))}
                        </div>
                        {/* Review Count placeholder */}
                        <div className="h-4 w-8 bg-gray-200 rounded"></div>
                    </div>

                    {/* Title Placeholder (h4) */}
                    <div className={"h-5 w-full bg-gray-200 rounded"}></div>

                    {/* Price Placeholder */}
                    <div className={"flex items-center gap-2"}>
                        {/* Discounted Price Placeholder (line-through) */}
                        <div className={"h-4 w-12 bg-gray-300 rounded"}></div>
                        {/* Actual Price Placeholder (bolder, larger) */}
                        <div className={"h-5 w-16 bg-gray-300 rounded"}></div>
                    </div>
                </div>

                {/* Optional Discount Badge Placeholder (top-left absolute position) */}
                <div className={"absolute top-4 left-4 h-6 w-16 bg-gray-300 rounded-sm"}></div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;