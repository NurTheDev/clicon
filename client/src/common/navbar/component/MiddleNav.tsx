import React, {useState} from "react";
import Container from "../../Container.tsx";
import assets from "../../../helpers/assetsProvider.ts";
import SearchBar from "../../SearchBar.tsx";
import Icons from "../../../helpers/IconProvider.tsx";
import PrimaryButton from "../../PrimaryButton.tsx";
import cartImage from "../../../assets/phone.png";
const MiddleNav = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    };
    return (
        <div className="bg-secondary-700 text-gray-00 py-4 sm:py-5 border-b border-gray-00/10 shadow-sm">
            <Container>
                {/* Desktop / Tablet layout */}
                <div className="hidden md:grid grid-cols-4 gap-4 justify-between items-center font-public-sans">
                    <div className="flex items-center gap-3">
                        <img
                            src={assets.cliconCircle}
                            alt="Clicon"
                            className="w-10 h-10 object-contain"
                        />
                        <h3 className="display6">CLICON</h3>
                    </div>

                    <div className="col-span-2">
                        <SearchBar className="relative">
                            <input
                                onChange={handleSearch}
                                name="search"
                                type="search"
                                placeholder="Search for anything..."
                                className="bg-gray-00 text-gray-900 w-full py-3 px-4 pr-12 rounded-xs placeholder:text-gray-400 focus:outline-none"
                                aria-label="Search products"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 text-gray-900"
                                aria-label="Search">
                                {Icons.search}
                            </button>
                        </SearchBar>
                    </div>

                    <div className="flex items-center justify-end gap-6">
                       <div className="relative">
                           <button
                               className="relative text-2xl"
                               aria-label="Open cart"
                               onMouseEnter={()=> setShowCartModal(true)}
                               type="button">
                               {Icons.cart}
                               <span
                                   className="absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"
                                   aria-hidden>
            3
        </span>
                           </button>
                           {showCartModal && (
                               <div
                                   className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80 z-50"
                                   onMouseEnter={() => setShowCartModal(true)}
                                   onMouseLeave={() => setShowCartModal(false)}>
                                   <div className="p-4 border-b border-gray-200">
                                       <h3 className="text-sm font-semibold text-gray-900">
                                           Shopping Cart (02)
                                       </h3>
                                   </div>

                                   <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                                       {/* Cart Item 1 */}
                                       <div className="flex items-start gap-3">
                                           <img
                                               src={cartImage}
                                               alt="Canon EOS 1500D DSLR Camera"
                                               className="w-16 h-16 object-cover rounded-md"
                                           />
                                           <div className="flex-1">
                                               <h4 className="text-sm text-gray-900">
                                                   Canon EOS 1500D DSLR Camera Body+ 18-55 mm
                                               </h4>
                                               <p className="text-sm text-gray-600 mt-1">
                                                   1 x <span className="text-blue-500 font-medium">$1,500</span>
                                               </p>
                                           </div>
                                           <button
                                               type="button"
                                               className="text-gray-400 hover:text-gray-600"
                                               aria-label="Remove item">
                                               {Icons.close}
                                           </button>
                                       </div>

                                       {/* Cart Item 2 */}
                                       <div className="flex items-start gap-3">
                                           <img
                                               src={cartImage}
                                               alt="Simple Mobile Phone"
                                               className="w-16 h-16 object-cover rounded-md"
                                           />
                                           <div className="flex-1">
                                               <h4 className="text-sm text-gray-900">
                                                   Simple Mobile 5G LTE Galexy 12 Mini 512GB Gaming Phone
                                               </h4>
                                               <p className="text-sm text-gray-600 mt-1">
                                                   2 x <span className="text-blue-500 font-medium">$269</span>
                                               </p>
                                           </div>
                                           <button
                                               type="button"
                                               className="text-gray-400 hover:text-gray-600"
                                               aria-label="Remove item">
                                               {Icons.close}
                                           </button>
                                       </div>
                                   </div>

                                   <div className="p-4 border-t border-gray-200">
                                       <div className="flex items-center justify-between mb-4">
                                           <span className="text-sm text-gray-600">Sub-Total:</span>
                                           <span className="text-sm font-semibold text-gray-900">$2038.00 USD</span>
                                       </div>

                                       <div className="inline-block w-full transition-transform duration-200 hover:scale-105">
                                           <PrimaryButton
                                               className={
                                                   "body-medium-600 py-2 sm:py-3 w-full text-gray-00 bg-primary-500 px-5" +
                                                   " sm:px-4" +
                                                   " rounded-xs lg:px-8" +
                                                   " flex items-center gap-2 justify-center"
                                               }
                                               aria-label="Shop now">
                                               <span>CHECKOUT NOW</span>
                                               <span>{Icons.rightArrow}</span>
                                           </PrimaryButton>
                                       </div>

                                       <button
                                           type="button"
                                           className="w-full text-warning-500 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                                           VIEW CART
                                       </button>
                                   </div>
                               </div>
                           )}
                       </div>

                        <button
                            className="relative text-2xl"
                            aria-label="Open wishlist"
                            type="button">
                            {Icons.heart}
                        </button>
                        <div className="relative">
                            <button
                                className="relative text-2xl"
                                aria-label="Open account"
                                onMouseEnter={() => !isLoggedIn && setShowLoginModal(true)}
                                type="button">
                                {Icons.user}
                            </button>
                            {showLoginModal && !isLoggedIn && (
                                <div
                                    className="absolute top-full right-0 mt-2 bg-white border border-gray-200 p-6 rounded-lg shadow-lg w-80 z-50"
                                    onMouseEnter={() => setShowLoginModal(true)}
                                    onMouseLeave={() => setShowLoginModal(false)}>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Sign in to your account
                                    </h2>
                                    <form className="space-y-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label htmlFor="password" className="block text-sm text-gray-700">
                                                    Password
                                                </label>
                                                <a href="#" className="text-sm text-blue-500 hover:underline">
                                                    Forget Password
                                                </a>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                    aria-label="Toggle password visibility">
                                                    {Icons.eye}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="inline-block w-full transition-transform duration-200 hover:scale-105">
                                            <PrimaryButton
                                                className={
                                                    "body-medium-600 py-2 sm:py-3 w-full text-gray-00 bg-primary-500 px-5" +
                                                    " sm:px-4" +
                                                    " rounded-xs lg:px-8" +
                                                    " flex items-center gap-2 justify-center"
                                                }
                                                aria-label="Shop now">
                                                <span>LOGIN</span>
                                                <span>{Icons.rightArrow}</span>
                                            </PrimaryButton>
                                        </div>

                                        <div className="text-center text-sm text-gray-600">
                                            Don't have account
                                        </div>

                                        <button
                                            type="button"
                                            className="w-full border border-gray-300 text-warning-500 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors">
                                            CREATE ACCOUNT
                                        </button>
                                    </form>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Mobile layout (md:hidden) */}
                <div className="flex items-center justify-between md:hidden">
                    <div className="flex items-center gap-3">
                        {/* Hamburger to open a small mobile panel */}
                        <button
                            onClick={() => setMobileOpen((s) => !s)}
                            aria-expanded={mobileOpen}
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            className="p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1">
                            {mobileOpen ? Icons.close : Icons.menu}
                        </button>

                        <img
                            src={assets.cliconCircle}
                            alt="Clicon"
                            className="w-8 h-8 object-contain"
                        />
                        <h3 className="display6 text-sm">CLICON</h3>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile search toggle */}
                        <button
                            onClick={() => setMobileSearchOpen((s) => !s)}
                            aria-expanded={mobileSearchOpen}
                            aria-label="Toggle search"
                            className="p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1">
                            {Icons.search}
                        </button>

                        {/* Cart */}
                        <button
                            className="relative text-lg"
                            aria-label="Open cart"
                            type="button">
                            {Icons.cart}
                            <span
                                className={
                                    "absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"
                                }
                                aria-hidden>
                3
              </span>
                        </button>
                        <button
                            className="relative text-lg"
                            aria-label="Open wishlist"
                            type="button">
                            {Icons.heart}
                        </button>
                        <button
                            className="relative text-lg"
                            aria-label="Open account"
                            type="button">
                            {Icons.user}
                        </button>
                    </div>
                </div>

                {/* Mobile search panel */}
                {mobileSearchOpen && (
                    <div className="mt-3 md:hidden">
                        <SearchBar className="relative">
                            <input
                                onChange={handleSearch}
                                name="search"
                                type="search"
                                placeholder="Search for anything..."
                                className="bg-gray-00 text-gray-900 w-full py-2 px-3 pr-10 rounded-xs placeholder:text-gray-400 focus:outline-none"
                                aria-label="Search products"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 text-gray-900"
                                aria-label="Search">
                                {Icons.search}
                            </button>
                        </SearchBar>
                    </div>
                )}

                {/* Mobile menu panel (revealed by hamburger) */}
                {mobileOpen && (
                    <div
                        className="mt-3 md:hidden bg-secondary-700 border-t border-gray-00/10 p-4 rounded-sm shadow-sm">
                        <div className="flex flex-col gap-3">
                            {/* CTA */}
                            <PrimaryButton
                                className={
                                    "w-full body-medium-600 py-2 text-gray-900 bg-warning-500 px-4 rounded-xs flex items-center justify-center gap-2 hover:rotate-4 transition-all"
                                }
                                aria-label="Shop now">
                                <span>Shop Now</span>
                                <span>{Icons.rightArrow}</span>
                            </PrimaryButton>

                            {/* Social icons */}
                            <div className="flex items-center gap-3">
                                <span className="label-3">Follow us:</span>
                                <div className="flex items-center gap-2">
                                    {[
                                        Icons.facebook,
                                        Icons.twitter,
                                        Icons.instagram,
                                        Icons.pinterest,
                                        Icons.reddit,
                                        Icons.youtube,
                                    ].map((icon, i) => (
                                        <span
                                            key={i}
                                            className="transition-transform hover:scale-110">
                      {icon}
                    </span>
                                    ))}
                                </div>
                            </div>

                            {/* Optional condensed promo */}
                            <div className="text-sm text-gray-00/80">
                                <span>Up to </span>
                                <span className="text-warning-500 font-semibold">50%</span>
                                <span> off — limited time</span>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
};
export default React.memo(MiddleNav);