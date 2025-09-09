import React from 'react';
import Container from "../../../../common/Container.tsx";
import {getImgUrl} from "../../../../helpers";
import PrimaryButton from "../../../../common/PrimaryButton.tsx";
import Icons from "../../../../helpers/IconProvider.tsx";
import {heroBannerInfo} from "../../../../data";
import Slider from "../../../../helpers/Slider.tsx";

const HeroBanner = () => {
    return (
        <div>
            <Container>
                <div className={"grid grid-cols-1 gap-4 md:grid-cols-2 items-center lg:grid-cols-3 "}>
                    <div className={"lg:col-span-2 rounded-md bg-gray-50 " +
                        " lg:p-12 xl:p-14 p-6 md:p-10 h-full"}>
                        <Slider>
                            {heroBannerInfo.map((item, index) => (
                                <div key={index}
                                     className={"flexRowBetween flex flex-col-reverse lg:flex-row justify-between" +
                                         " lg:gap-0 gap-8 relative "}>
                                    <div className={"flexColumnStart gap-4"}>
                                        <p className={"text-secondary-600 body-medium-600 font-public-sans"}>
                                            {item.title}
                                        </p>
                                        <h1 className={"text-gray-900 font-public-sans display3"}>{item.heading}</h1>
                                        <p className={"text-gray-700 font-public-sans label3"}>
                                            {item.description}
                                        </p>
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
                                    <div className={"max-h-[200px] lg:max-h-[300px] "}>
                                        <img src={getImgUrl(item.image)} alt={"product image"}
                                             className={"object-contain max-h-[200px] lg:max-h-[300px]"}/>
                                    </div>
                                    <p className={"lg:w-24 lg:h-24 w-14 h-14 rounded-full bg-secondary-500" +
                                        " text-gray-00 font-public-sans text-[22px] font-semibold flexRowCenter " +
                                        "absolute top-0 right-0 z-10"}>{item.price}</p>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className={"grid grid-row-2 gap-4 "}>
                        <div className={"relative bg-gray-900 rounded-md h-full p-4"}>
                            <img src={getImgUrl("pixel5.png")} alt={"gaming chair"}
                                 className={"object-contain w-1/2 float-end"}/>
                            <div className={"absolute top-0 left-0 p-10 flexColumnStart space-y-4"}>
                                <p className={"text-warning-500 font-public-sans body-medium-500"}>Summer Sales</p>
                                <h4 className={"font-public-sans text-gray-00 heading3"}>New Google Pixel 6 Pro</h4>
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
                        <div className={"relative bg-gray-50 rounded-md h-full p-4"}>
                            <img src={getImgUrl("earbards.png")} alt={"gaming chair"}
                                 className={"object-contain w-1/2"}/>
                            <div className={"absolute top-0 right-0 p-10 flexColumnCenter space-y-4"}>
                                <h4 className={"font-public-sans text-gray-900 heading3"}>Xiaomi FlipBuds Pro</h4>
                                <p className={"label1 text-secondary-500"}>$299 USD</p>
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
                </div>
            </Container>
        </div>
    );
};

export default React.memo(HeroBanner);