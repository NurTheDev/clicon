import React from 'react';
import Container from "../../../../common/Container.tsx";
import {getImgUrl} from "../../../../helpers";
import PrimaryButton from "../../../../common/PrimaryButton.tsx";
import Icons from "../../../../helpers/IconProvider.tsx";

const HeroBanner = () => {
    return (
        <div>
            <Container>
                <div className={"grid grid-cols-1 gap-4 md:grid-cols-2 items-center lg:grid-cols-3"}>
                    <div className={"lg:col-span-2 rounded-md bg-gray-50 lg:p-12 xl:p-14 p-6 md:p-10 flexRowBetween"}>
                        <div className={"flexColumnStart gap-4 lg:w-1/2"}>
                            <p className={"text-secondary-600 body-medium-600 font-public-sans"}>
                                THE BEST PLACE TO PLAY
                            </p>
                            <h1 className={"text-gray-900 font-public-sans display3"}>Xbox Consoles</h1>
                            <p className={"text-gray-700 font-public-sans label3"}>
                                Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.
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
                        <div>
                            <img src={getImgUrl("ps5.png")} alt={"product image"}/>
                        </div>
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