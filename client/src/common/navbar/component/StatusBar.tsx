import Container from "../../Container.tsx";
import assets from "../../../helpers/assetsProvider.ts";
import PrimaryButton from "../../PrimaryButton.tsx";
import Icons from "../../../helpers/IconProvider.tsx";
import React from "react";

const StatusBar = () => {
    return (
        <div className="bg-gray-900 py-3 sm:py-4">
            <Container>
                <div
                    className={
                        "grid grid-cols-2 lg:grid-cols-3 gap-4 justify-between items-center font-public-sans text-center"
                    }>
                    <div className="flex items-center gap-3">
                        <img
                            src={assets.blackLogo}
                            alt="Clicon logo"
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        />
                        <p className="text-gray-00 heading3">Friday</p>
                    </div>

                    {/* Promo text: hide on small screens to save space */}
                    <div className="items-center gap-3 justify-center hidden lg:flex">
                        <span className="label-3 text-gray-00">up to</span>{" "}
                        <span className="display4 text-warning-500">50% </span>
                        <span className="text-gray-00 heading4">off</span>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                        <PrimaryButton
                            className={
                                "body-medium-600 py-2 sm:py-3 text-gray-900 bg-warning-500 px-3 sm:px-4 rounded-xs flex items-center gap-2 hover:rotate-4 transition-all"
                            }
                            aria-label="Shop now">
                            <span>Shop Now</span>
                            <span>{Icons.rightArrow}</span>
                        </PrimaryButton>
                    </div>
                </div>
            </Container>
        </div>
    );
};
export default React.memo(StatusBar);