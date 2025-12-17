import React from 'react';
import BannerCardImage from "../../../../assets/bannerCard.png"
import brand from "../../../../assets/brandImg.png"
import PrimaryButton from "../../../../common/PrimaryButton.tsx";
import Icons from "../../../../helpers/IconProvider.tsx";

const BannerCard = () => {
    return (
        <div className={"p-8 border-4 border-primary-100 flex flex-col justify-center items-center h-full gap-6"}>
            <img src={BannerCardImage} alt="Banner Card" className={"w-full h-auto object-cover"}/>
            <div className={"flex flex-col justify-center items-center text-center gap-y-2"}>
                <img src={brand} alt=""/>
                <h2 className={"heading3 mt-4"}>Heavy on Features.
                    Light on Price.</h2>
                <p className={"mb-6"}>Get 20% off on your first purchase. Use code FIRST20 at checkout.</p>
                <PrimaryButton
                    className={
                        "body-medium-600 py-2 sm:py-3 text-gray-00 bg-primary-500 px-5 sm:px-4 hover:bg-gray-00" +
                        " rounded-xs lg:px-8" +
                        " flex items-center gap-2 w-full justify-center border border-primary-500 hover:text-primary-500"
                    }
                    aria-label="Shop now">
                    <span>{Icons.cart}</span>
                    <span>Add to cart</span>
                </PrimaryButton> <PrimaryButton
                className={
                    "body-medium-600 py-2 sm:py-3 text-gray-00 bg-primary-500 px-5 sm:px-4 hover:bg-gray-00" +
                    " rounded-xs lg:px-8" +
                    " flex items-center gap-2 w-full justify-center border border-primary-500 hover:text-primary-500"
                }
                aria-label="Shop now">
                <span>View Details</span>
                <span>{Icons.rightArrow}</span>

            </PrimaryButton>
            </div>
        </div>
    );
};

export default React.memo(BannerCard);