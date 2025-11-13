import Icons from "../../../helpers/IconProvider.tsx";
import Container from "../../Container.tsx";
import React from "react";

const TopNav = () => {
    const socialIcons = [
        Icons.facebook,
        Icons.twitter,
        Icons.instagram,
        Icons.pinterest,
        Icons.reddit,
        Icons.youtube,
    ];
    return (
        <div
            className={
                "bg-secondary-700 text-gray-00 py-2 sm:py-3 border-b border-gray-00/10 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.16)]"
            }>
            <Container>
                <div className="flex items-center justify-between gap-4">
                    <p className="body-medium-400 hidden sm:block">
                        Welcome to Clicon online eCommerce store.
                    </p>

                    {/* On small screens we hide the full social row and show a smaller footprint */}
                    <div className="flex items-center gap-3 justify-end border-r border-gray-00/20 pr-0 sm:pr-6">
                        <span className="hidden sm:inline">Follow us:</span>
                        <div className="flex items-center gap-2">
                            {socialIcons?.map((icon, index) => (
                                <span
                                    key={index}
                                    className="transition-transform hover:scale-110 cursor-pointer text-sm"
                                    aria-hidden>
                  {icon}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};
export default React.memo(TopNav);