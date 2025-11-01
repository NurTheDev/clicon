import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import Container from "../../../../common/Container.tsx";
import PrimaryButton from "../../../../common/PrimaryButton.tsx";
import ProductCard from "../../../../common/ProductCard.tsx";
import assets from "../../../../helpers/assetsProvider.ts";
import Icons from "../../../../helpers/IconProvider.tsx";
import ProductCardSkeleton from "../../../../skeletons/ProductCardSkeleton.tsx";
import type { ProductDataType } from "../../../../types/productData";

const FeaturedProduct = () => {
  const location = useLocation();
  const [featuredCategory, setFeaturedCategory] = React.useState<string>(
    location.hash ? location.hash.replace("#", "") : ""
  );
  useEffect(() => {
    setFeaturedCategory(location.hash ? location.hash.replace("#", "") : "");
  }, [location]);
  const { data, isLoading } = useQuery({
    queryKey: ["featured-products", featuredCategory],
    queryFn: async () => {
      const response = await fetch(
        `https://dummyjson.com/products${
          featuredCategory ? `/category/${featuredCategory}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
  const { products } = data || {};

  /**
   * Get category Data
   */
  const { data: featuredSortlinks } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("https://dummyjson.com/products/categories");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  return (
    <div className={"mt-5 lg:mt-10 font-public-sans text-center text-gray-900"}>
      <Container>
        <div className={"grid grid-cols-1 lg:grid-cols-12 gap-4"}>
          <div
            className={
              "lg:col-span-3 bg-warning-300 flexColumnCenter h-full   "
            }>
            <div className={"space-y-4 p-6 flexColumnCenter w-full"}>
              <p className={"label3 font-semibold text-danger-600"}>
                COMPUTER & ACCESSORIES
              </p>
              <h3 className={"display6 text-gray-900"}>32% Discount</h3>
              <p className={"body-medium-400 text-gray-700"}>
                For all ellectronics products
              </p>
              <div className={"flexRowCenter gap-2 body-medium-500"}>
                <span>Offers ends in:</span>
                <span
                  className={
                    "bg-gray-00 text-gray-900 px-3" + " body-small-600 py-1"
                  }>
                  ENDS OF CHRISTMAS
                </span>
              </div>
              <div className="inline-block transition-transform duration-200 hover:scale-105">
                <PrimaryButton
                  className={
                    "body-medium-600 py-2 sm:py-3 text-gray-00 bg-primary-500 px-5 sm:px-4" +
                    " rounded-xs lg:px-8" +
                    " flex items-center gap-2"
                  }
                  aria-label="Shop now">
                  <span>Shop Now</span>
                  <span>{Icons.rightArrow}</span>
                </PrimaryButton>
              </div>
            </div>
            <img
              src={assets.featureProductBg}
              alt=""
              className={"w-full object-cover"}
            />
          </div>
          <div className={"lg:col-span-9 h-full"}>
            <div
              className={
                "flex flex-col items-center lg:flex-row lg:justify-between gap-y-4 lg:gap-y-0"
              }>
              <h3 className={"heading3 text-gray-900"}>Featured Products</h3>
              <div className="overflow-x-auto scrollbar-hide">
                <ul className="flex flex-wrap lg:flex-nowrap lg:min-w-max justify-center md:justify-end items-center gap-4 sm:gap-6 mt-4 px-2 sm:px-0">
                  {featuredSortlinks?.slice(0, 6).map(
                    (
                      item: {
                        url: string;
                        slug: string;
                        name: string;
                      },
                      index: number
                    ) => (
                      <li key={index} className="flex-shrink-0">
                        <NavLink
                          to={`#${item.slug}`}
                          className={`body-medium-500 whitespace-nowrap hover:text-primary-500 transition-colors ${
                            location.hash === item.slug
                              ? "text-primary-500 border-b-2 border-primary-500 pb-1"
                              : "text-gray-600"
                          }`}>
                          {index === 5 ? (
                            <div className="flex items-center gap-1 justify-center">
                              <span>Browse All</span>
                              <span>{Icons.rightArrow}</span>
                            </div>
                          ) : (
                            item.name
                          )}
                        </NavLink>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div className={"flexColumnCenter gap-y-5"}>
              {/* Product Grid Component */}
              <div
                className={
                  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-6 gap-4 lg:gap-x-6 lg:gap-y-4"
                }>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))
                  : products
                      ?.slice(0, 8)
                      .map((product: ProductDataType, index: number) => (
                        <ProductCard
                          key={product.id ?? index}
                          product={product}
                        />
                      ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default React.memo(FeaturedProduct);
