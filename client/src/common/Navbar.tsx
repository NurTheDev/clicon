import Container from "./Container.tsx";
import assets from "../helpers/assetsProvider.ts";
import Icons from "../helpers/IconProvider.tsx";
import PrimaryButton from "./PrimaryButton.tsx";
import SearchBar from "./SearchBar.tsx";
import React from "react";

const StatusBar = () => {

    return (
        <div className={"bg-gray-900 py-4"}>
            <Container>
                <div
                    className={"grid grid-cols-2 lg:grid-cols-3 gap-4 justify-between items-center font-public-sans text-center"}>
                    <div className={"flex items-center gap-3"}>
                        <img src={assets.blackLogo} alt=""/>
                        <p className={"text-gray-00 heading3"}>Friday</p>
                    </div>
                    <div className={"items-center gap-3 justify-center hidden lg:flex"}>
                        <span className={"label-3 text-gray-00"}>up to</span> <span className={
                        "display4 text-warning-500"}>50% </span><span className={"text-gray-00 heading4"}>off</span>
                    </div>
                    <div className={"flex items-center gap-3 justify-end"}>
                        <PrimaryButton
                            className={"body-medium-600 py-3 text-gray-900 bg-warning-500 px-4 rounded-xs flex" +
                                " items-center gap-2 hover:rotate-4 transition-all"}><span>Shop Now</span>
                            <span>{Icons.rightArrow}</span></PrimaryButton>
                    </div>
                </div>
            </Container>
        </div>
    )
}
const TopNav = () => {
    const socialIcons = [Icons.facebook, Icons.twitter, Icons.instagram, Icons.pinterest, Icons.reddit, Icons.youtube]
    return (
        <div className={"bg-secondary-700 text-gray-00 py-3 border-b border-gray-00/10" +
            " shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.16)]"}>
            <Container>
                <div className={"grid grid-cols-2 gap-4 justify-between items-center"}>
                    <p className={"body-medium-400"}>Welcome to Clicon online eCommerce store. </p>
                    <div className={"flex items-center gap-3 justify-end border-r border-gray-00/20 pr-6"}>
                        <span>Follow us:</span>
                        {socialIcons?.map((icon, index) => (
                            <span key={index}
                                  className="transition-transform hover:scale-110 cursor-pointer">{icon}</span>
                        ))}
                    </div>
                </div>

            </Container>
        </div>
    )
}
const MiddleNav = () => {
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
    }
    return (
        <div className={"bg-secondary-700 text-gray-00 py-5 "}>
            <Container>
                <div className={"grid grid-cols-4 gap-4 justify-between items-center font-public-sans"}>
                    <div className={"flex items-center gap-3"}>
                        <img src={assets.cliconCircle} alt=""/>
                        <h3 className={"display6"}>CLICON</h3>
                    </div>
                    <div className={"col-span-2"}>
                        <SearchBar className={"relative"}>
                            <input
                                onChange={handleSearch}
                                name="search"
                                type="search"
                                placeholder="Search for anything......"
                                className="bg-gray-00 text-gray-900 w-full py-3 px-4 pr-12 rounded-xs placeholder:text-gray-400 focus:outline-none"
                            />
                            <span
                                className={"absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 text-gray-900"}>
        {Icons.search}
    </span>
                        </SearchBar>

                    </div>
                    <div>
                        <span className={"text-2xl cursor-pointer relative"}>{Icons.cart}
                        <span className={"absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600" +
                            " rounded-full" +
                            " w-5 h-5" +
                            " flexColumnCenter"}>
                            3
                        </span>
                        </span>
                    </div>
                </div>
            </Container>
        </div>
    )
}
const Navbar = () => {
    return (
        <div>
            <StatusBar/>
            <TopNav/>
            <MiddleNav/>
        </div>
    );
};

export default Navbar;