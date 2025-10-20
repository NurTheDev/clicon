import React from 'react';
import Container from "../../../../common/Container.tsx";
import assets from "../../../../helpers/assetsProvider.ts";
import PrimaryButton from "../../../../common/PrimaryButton.tsx";
import Icons from "../../../../helpers/IconProvider.tsx";
import {useLocation} from "react-router";
import {NavLink} from "react-router-dom";
import {heroBannerInfo} from "../../../../data";
import {getImgUrl} from "../../../../helpers";

const FeaturedProduct = () => {
    const featuredSortlinks = [
        {title: "All Products", link: "#product"}, {title: "New Arrivals", link: "#new"}, {
            title: "Best Sellers",
            link: "#best"
        }, {title: "Featured", link: "#feature"}, {title: "Special Offers", link: "#spe"}, {
            title: "Browse All",
            link: "#br"
        }
    ]
    const location = useLocation();
    return (
        <div className={"mt-5 lg:mt-10 font-public-sans text-center text-gray-900"}>
            <Container>
                <div className={"grid grid-cols-1 lg:grid-cols-12 gap-4"}>
                    <div className={"lg:col-span-3 bg-warning-300 flexColumnCenter h-full"}>
                        <div className={"space-y-4 p-6 flexColumnCenter w-full"}>
                            <p className={"label3 font-semibold text-danger-600"}>
                                COMPUTER & ACCESSORIES
                            </p>
                            <h3 className={"display6 text-gray-900"}>
                                32% Discount
                            </h3>
                            <p className={"body-medium-400 text-gray-700"}>
                                For all ellectronics products
                            </p>
                            <div className={"flexRowCenter gap-2 body-medium-500"}>
                                <span>Offers ends in:</span><span className={"bg-gray-00 text-gray-900 px-3" +
                                " body-small-600 py-1"}>ENDS OF CHRISTMAS</span>
                            </div>
                            <PrimaryButton
                                className={
                                    "body-medium-600 py-2 sm:py-3 text-gray-00 bg-primary-500 px-5 sm:px-4" +
                                    " rounded-xs lg:px-8" +
                                    " flex items-center gap-2 hover:scale-105 transition-all duration-200"
                                }
                                aria-label="Shop now"
                            >
                                <span>Shop Now</span>
                                <span>{Icons.rightArrow}</span>
                            </PrimaryButton>
                        </div>
                        <div className={"w-full"}>
                            <img src={assets.featureProductBg} alt="" className={"w-full object-contain"}/>
                        </div>
                    </div>
                    <div className={"lg:col-span-9 h-full"}>
                        <div className={"lg:flexRowBetween flexColStart gap-y-4 lg:gap-y-0"}>
                            <h3 className={"heading3 text-gray-900"}>Featured Products</h3>
                            <div className="overflow-x-auto scrollbar-hide">
                                <ul className="flex items-center gap-4 sm:gap-6 mt-4 min-w-max px-2 sm:px-0">
                                    {featuredSortlinks.map((item, index) => (
                                        <li key={index} className="flex-shrink-0">
                                            <NavLink
                                                to={item.link}
                                                className={`body-medium-500 whitespace-nowrap hover:text-primary-500 transition-colors ${
                                                    location.hash === item.link
                                                        ? 'text-primary-500 border-b-2 border-primary-500 pb-1'
                                                        : 'text-gray-600'
                                                }`}
                                            >
                                                {item.title === "Browse All" ? (
                                                    <span className="flex items-center gap-1">
              <span>{item.title}</span>
              <span>{Icons.rightArrow}</span>
            </span>
                                                ) : (
                                                    item.title
                                                )}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                        <div className={"flexColumnCenter gap-y-5"}>
                            {/* Product Grid Component */}
                            <div className={"w-full flex justify-around flex-wrap mt-6 gap-4 lg:gap-x-6 lg:gap-y-4"}>
                                {heroBannerInfo?.slice(0, 8).map((product) => (
                                    <div className={"flexColumnStart text-start gap-y-2 p-4 rounded-sm" +
                                        " border border-gray-100 cursor-pointer hover:shadow transition-all" +
                                        " duration-150 hover:scale-105"} key={product.id}>
                                        <div>
                                            <img
                                                src={getImgUrl(product.image)}
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
                                                       ({product.ratedBy})
                                                   </span>
                                               </span>
                                            </p>
                                            <h4 className={"body-small-400 text-gray-900"}>
                                                {product.name}
                                            </h4>
                                            <p className={"body-medium-600 text-secondary-500"}>
                                                {product.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <PrimaryButton
                                className={
                                    "body-medium-600 py-2 sm:py-3 text-gray-00 bg-primary-500 px-5 sm:px-4" +
                                    " rounded-xs lg:px-8" +
                                    " flex items-center gap-2 hover:scale-105 transition-all duration-200"
                                }
                                aria-label="Shop now"
                            >
                                <span>Shop Now</span>
                                <span>{Icons.rightArrow}</span>
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default React.memo(FeaturedProduct);