import Icons from "../helpers/IconProvider.tsx";

type ProductCardProps = {
    product: {
        id: number;
        title: string;
        price: number;
        images: string[];
        rating?: number;
        reviews: string[];
        discountPercentage?: number;
        name?: string;
    };
};
const ProductCard = ({product}: ProductCardProps) => {
    return (
        <div>
            <div className={"flexColumnStart text-start gap-y-2 p-4 rounded-sm" +
                " border border-gray-100 cursor-pointer hover:shadow transition-all relative" +
                " duration-150 hover:scale-105"} key={product.id}>
                <div>
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : product.images[1]}
                        alt={product.name}
                        className={"!w-[202px] !h-[172px] object-contain"}
                    />
                </div>
                <div className={"space-y-4"}>
                    <p>
                                               <span>
                                                   {Array.from({length: 5}, (_, i) => i < Math.floor(product.rating || 0) ? Icons.starFilled : Icons.starEmpty).map((star, index) => (
                                                       <span key={index} className={"text-primary-500"}>{star}</span>
                                                   ))}
                                                   <span className={"text-gray-600 body-small-500 ml-2"}>
                                                       ({product.reviews.length})
                                                   </span>
                                               </span>
                    </p>
                    <h4 className={"body-medium-600 text-gray-900"}>
                        {product.title}
                    </h4>
                    <div className={"flex items-center gap-2"}>
                        <p className={"body-small-500 line-through text-gray-500"}>
                            {product.discountPercentage
                                ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
                                : product.price}
                        </p>
                        <p className={"body-medium-600 text-secondary-500"}>
                            {product.price}
                        </p>
                    </div>
                </div>
                {product.discountPercentage && (
                    <div className={"bg-danger-100 text-danger-600 px-2 py-1 body-small-600" +
                        " rounded-xs mt-2 absolute top-1 left-1"}>
                        {product.discountPercentage}% OFF
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProductCard;