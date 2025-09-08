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
                    <div className={"lg:col-span-2 rounded-md bg-gray-50 lg:p-12 xl:p-14 p-6 md:p-10 lg:min-h-[50vh]" +
                        "flexColumnCenter " +
                        " "}>
                        <Slider>
                            {heroBannerInfo.map((item, index) => (
                                <div key={index}
                                     className={"flexRowBetween flex flex-col-reverse lg:flex-row justify-between" +
                                         " lg:gap-0 gap-8 relative"}>
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
                                    {/*<p className={"lg:w-24 lg:h-24 w-14 h-14 rounded-full bg-secondary-500" +*/}
                                    {/*    " text-gray-00 font-public-sans text-[22px] font-semibold flexRowCenter " +*/}
                                    {/*    "absolute bottom-0 right-1/4 z-10"}>{item.price}</p>*/}
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className={"grid grid-row-2 gap-4"}>
                        <div className={"bg-blue-400 h-10"}></div>
                        <div className={"bg-green-400 h-10"}></div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default React.memo(HeroBanner);