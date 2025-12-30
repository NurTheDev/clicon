import Icons from "../helpers/IconProvider.tsx";
import type { ProductDataType } from "../types/productData.ts";
type ProductCardProps = {
  product: ProductDataType;
};
import {useNavigate} from "react-router-dom";
const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
  return (
      <div
          className={
              "flexColumnStart text-start gap-y-2 p-4 rounded-sm" +
              " border border-gray-100 cursor-pointer hover:shadow transition-all relative" +
              " duration-150 hover:scale-105"
          } onClick={() => navigate(`/product/${product.id}`)}
          key={product.id}>
        <div className="relative group overflow-hidden">
          <img
              src={
                product.images && product.images.length > 0
                    ? product.images[0]
                    : product.images[1]
              }
              alt={product.title}
              className="w-full h-[172px] object-contain"
          />
          <div
              className={
                  "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 " +
                  "flex justify-center items-center gap-3 transition-all duration-300"
              }>
            <button
                className={
                    "w-10 h-10 rounded-full bg-white hover:bg-primary-500 " +
                    "transform hover:scale-110 transition-all duration-200 " +
                    "flex justify-center items-center text-gray-600 hover:text-white " +
                    "shadow-md translate-y-2 group-hover:translate-y-0"
                }
                aria-label="Add to cart"
                style={{ transitionDelay: "0ms" }}>
              <span>{Icons.cart}</span>
            </button>
            <button
                className={
                    "w-10 h-10 rounded-full bg-white hover:bg-primary-500 " +
                    "transform hover:scale-110 transition-all duration-200 " +
                    "flex justify-center items-center text-gray-600 hover:text-white " +
                    "shadow-md translate-y-2 group-hover:translate-y-0"
                }
                aria-label="Add to wishlist"
                style={{ transitionDelay: "50ms" }}>
              <span>{Icons.heart}</span>
            </button>
            <button
                className={
                    "w-10 h-10 rounded-full bg-white hover:bg-primary-500 " +
                    "transform hover:scale-110 transition-all duration-200 " +
                    "flex justify-center items-center text-gray-600 hover:text-white " +
                    "shadow-md translate-y-2 group-hover:translate-y-0"
                }
                aria-label="Quick view"
                style={{ transitionDelay: "100ms" }}>
              <span>{Icons.openEye}</span>
            </button>
          </div>
        </div>
        <div className={"space-y-3"}>
          <p>
            <span>
              {Array.from({ length: 5 }, (_, i) =>
                  i < Math.floor(product.rating || 0)
                      ? Icons.starFilled
                      : Icons.starEmpty
              ).map((star, index) => (
                  <span key={index} className={"text-primary-500"}>
                  {star}
                </span>
              ))}
              <span className={"text-gray-600 body-small-500 ml-2"}>
                ({product.reviews.length})
              </span>
            </span>
          </p>
          <h4 className={"body-medium-600 text-gray-900"}>{product.title}</h4>
          <p
              className={
                "body-small-500 text-gray-600 overflow-hidden text-wrap"
              }>
            {product.description.substring(0, 70) + "..."}
          </p>
          <div className={"flex items-center gap-2"}>
            <p className={"body-small-500 line-through text-gray-500"}>
              {product.discountPercentage
                  ? (
                      product.price /
                      (1 - product.discountPercentage / 100)
                  ).toFixed(2)
                  : product.price}
            </p>
            <p className={"body-medium-600 text-secondary-500"}>
              {product.price}
            </p>
          </div>
        </div>
        {product.discountPercentage && (
            <div
                className={
                    "bg-danger-100 text-danger-600 px-2 py-1 body-small-600" +
                    " rounded-xs mt-2 absolute top-1 left-1"
                }>
              {product.discountPercentage}% OFF
            </div>
        )}
      </div>
  );
};

export default ProductCard;
