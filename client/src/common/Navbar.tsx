import React, {useState} from "react";
import Container from "./Container.tsx";
import assets from "../helpers/assetsProvider.ts";
import Icons from "../helpers/IconProvider.tsx";
import PrimaryButton from "./PrimaryButton.tsx";
import SearchBar from "./SearchBar.tsx";

const StatusBar = () => {
    return (
        <div className="bg-gray-900 py-3 sm:py-4">
            <Container>
                <div
                    className={
                        "grid grid-cols-2 lg:grid-cols-3 gap-4 justify-between items-center font-public-sans text-center"
                    }
                >
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
                            aria-label="Shop now"
                        >
                            <span>Shop Now</span>
                            <span>{Icons.rightArrow}</span>
                        </PrimaryButton>
                    </div>
                </div>
            </Container>
        </div>
    );
};

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
            }
        >
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
                                    aria-hidden
                                >
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

const MiddleNav = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
                                aria-label="Search"
                            >
                                {Icons.search}
                            </button>
                        </SearchBar>
                    </div>

                    <div className="flex items-center justify-end gap-6">
                        <button
                            className="relative text-2xl"
                            aria-label="Open cart"
                            type="button"
                        >
                            {Icons.cart}
                            <span
                                className={
                                    "absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"
                                }
                                aria-hidden
                            >
                3
              </span>
                        </button>
                        <button
                            className="relative text-2xl"
                            aria-label="Open cart"
                            type="button"
                        >
                            {Icons.heart}
                            {/*              <span*/}
                            {/*                  className={*/}
                            {/*                      "absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"*/}
                            {/*                  }*/}
                            {/*                  aria-hidden*/}
                            {/*              >*/}
                            {/*  3*/}
                            {/*</span>*/}
                        </button>
                        <button
                            className="relative text-2xl"
                            aria-label="Open cart"
                            type="button"
                        >
                            {Icons.user}
                            {/*              <span*/}
                            {/*                  className={*/}
                            {/*                      "absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"*/}
                            {/*                  }*/}
                            {/*                  aria-hidden*/}
                            {/*              >*/}
                            {/*  3*/}
                            {/*</span>*/}
                        </button>
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
                            className="p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                        >
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
                            className="p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                        >
                            {Icons.search}
                        </button>

                        {/* Cart */}
                        <button
                            className="relative text-lg"
                            aria-label="Open cart"
                            type="button"
                        >
                            {Icons.cart}
                            <span
                                className={
                                    "absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"
                                }
                                aria-hidden
                            >
                3
              </span>
                        </button>
                        <button
                            className="relative text-lg"
                            aria-label="Open cart"
                            type="button"
                        >
                            {Icons.heart}
                            {/*              <span*/}
                            {/*                  className={*/}
                            {/*                      "absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"*/}
                            {/*                  }*/}
                            {/*                  aria-hidden*/}
                            {/*              >*/}
                            {/*  3*/}
                            {/*</span>*/}
                        </button>
                        <button
                            className="relative text-lg"
                            aria-label="Open cart"
                            type="button"
                        >
                            {Icons.user}
                            {/*              <span*/}
                            {/*                  className={*/}
                            {/*                      "absolute -top-3 -right-3 bg-gray-00 text-secondary-700 body-small-600 rounded-full w-5 h-5 flex items-center justify-center"*/}
                            {/*                  }*/}
                            {/*                  aria-hidden*/}
                            {/*              >*/}
                            {/*  3*/}
                            {/*</span>*/}
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
                                aria-label="Search"
                            >
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
                                aria-label="Shop now"
                            >
                                <span>Shop Now</span>
                                <span>{Icons.rightArrow}</span>
                            </PrimaryButton>

                            {/* Social icons */}
                            <div className="flex items-center gap-3">
                                <span className="label-3">Follow us:</span>
                                <div className="flex items-center gap-2">
                                    {[Icons.facebook, Icons.twitter, Icons.instagram, Icons.pinterest, Icons.reddit, Icons.youtube].map(
                                        (icon, i) => (
                                            <span key={i} className="transition-transform hover:scale-110">
                        {icon}
                      </span>
                                        )
                                    )}
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

const BottomNav = () => {
    const features = [
        {title: "Trace Order", icon: Icons.location}
        , {title: "Compare", icon: Icons.compare}
        , {title: "24/7 Support", icon: Icons.support}
        , {title: "Help Center", icon: Icons.help}
    ]
    return (
        <div className="bg-gray-00 text-gray-00 py-4 sm:py-5 border-b border-gray-00/10 shadow-sm">
            <Container>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Left area: category select + features (inline on md+, scrollable on mobile) */}
                    <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center gap-3">
                        <select
                            defaultValue="All category"
                            aria-label="Select product category"
                            className="select select-neutral text-gray-900 w-full md:w-64"
                        >
                            <option disabled>All category</option>
                            <option>Electronics</option>
                            <option>Clothes</option>
                            <option>Home & Garden</option>
                            <option>Health & Beauty</option>
                            <option>Sports</option>
                            <option>Automotive</option>
                            <option>Toys & Hobbies</option>
                            <option>Books & Media</option>
                            <option>Music & Instruments</option>
                            <option>Groceries</option>
                            <option>Pet Supplies</option>
                            <option>Office Supplies</option>
                            <option>Travel & Luggage</option>
                            <option>Baby Products</option>
                        </select>

                        {/* Desktop / tablet: show features inline */}
                        <div className="hidden md:flex items-center gap-2 ml-4 flex-wrap">
                            {features.map((item, index) => (
                                <button
                                    key={index}
                                    aria-label={item.title}
                                    className="btn gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md flex items-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1"
                                    type="button"
                                >
                                    <span className="mr-1">{item.icon}</span>
                                    <span className="body-small-600">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right area: contact */}
                    <div className="text-gray-600 flex items-center gap-2 cursor-pointer hover:text-gray-900">
                        <span aria-hidden>{Icons.phone}</span>
                        <a href="tel:+8801957282954" className="body-medium-600">
                            +880 19572 82954
                        </a>
                    </div>

                    {/* Mobile features: horizontally scrollable row for touch friendliness */}
                    <div className="md:hidden mt-2 w-full">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {features.map((item, index) => (
                                <button
                                    key={index}
                                    aria-label={item.title}
                                    className="px-3 py-2 bg-gray-00/10 text-gray-600 hover:text-gray-900 rounded-md flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1"
                                    type="button"
                                >
                                    <span>{item.icon}</span>
                                    <span className="text-sm">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

const Navbar = () => {
    return (
        <div>
            <StatusBar/>
            <TopNav/>
            <MiddleNav/>
            <BottomNav/>
        </div>
    );
};

export default React.memo(Navbar) || Navbar;