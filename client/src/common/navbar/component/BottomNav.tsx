import React, {useState} from "react";
import Icons from "../../../helpers/IconProvider.tsx";
import Container from "../../Container.tsx";

const BottomNav = () => {
    const features: { title: string; icon: React.ReactNode }[] = [
        { title: "Trace Order", icon: Icons.location },
        { title: "Compare", icon: Icons.compare },
        { title: "24/7 Support", icon: Icons.support },
        { title: "Help Center", icon: Icons.help },
    ];

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All category");

    const categories = [
        {
            id: "computer-laptop",
            name: "Computer & Laptop",
            sub: [],
        },
        {
            id: "computer-accessories",
            name: "Computer Accessories",
            sub: [],
        },
        {
            id: "smartphone",
            name: "SmartPhone",
            sub: [
                { id: "all", name: "All" },
                { id: "iphone", name: "iPhone" },
                { id: "samsung", name: "Samsung" },
                { id: "realme", name: "Realme" },
                { id: "xiaomi", name: "Xiaomi" },
                { id: "oppo", name: "Oppo" },
                { id: "vivo", name: "Vivo" },
                { id: "oneplus", name: "OnePlus" },
                { id: "huawei", name: "Huawei" },
                { id: "infinix", name: "Infinix" },
                { id: "tecno", name: "Tecno" },
            ],
        },
        {
            id: "headphone",
            name: "Headphone",
            sub: [],
        },
        {
            id: "mobile-accessories",
            name: "Mobile Accessories",
            sub: [],
        },
        {
            id: "gaming-console",
            name: "Gaming Console",
            sub: [],
        },
        {
            id: "camera-photo",
            name: "Camera & Photo",
            sub: [],
        },
        {
            id: "tv-homes",
            name: "TV & Homes Appliances",
            sub: [],
        },
        {
            id: "watches-accessories",
            name: "Watches & Accessories",
            sub: [],
        },
        {
            id: "gps-navigation",
            name: "GPS & Navigation",
            sub: [],
        },
        {
            id: "wearable-technology",
            name: "Wearable Technology",
            sub: [],
        },
    ];

    const handleCategoryClick = (categoryId: string, categoryName: string) => {
        if (categories.find((c) => c.id === categoryId)?.sub.length) {
            // If category has subcategories, toggle expansion
            setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
        } else {
            // If no subcategories, select and close
            setSelectedCategory(categoryName);
            setIsCategoryOpen(false);
            setExpandedCategory(null);
        }
    };

    const handleSubCategoryClick = (subName: string, parentName: string) => {
        setSelectedCategory(`${parentName} - ${subName}`);
        setIsCategoryOpen(false);
        setExpandedCategory(null);
    };

    return (
        <div className="bg-gray-00 text-gray-00 py-4 sm:py-5 border-b border-gray-00/10 shadow-sm">
            <Container>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Left area: category select + features */}
                    <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center gap-3">
                        {/* Custom Category Dropdown */}
                        <div className="relative w-full md:w-64">
                            <button
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-md text-gray-900 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                type="button">
                                <span className="truncate">{selectedCategory}</span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${
                                        isCategoryOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isCategoryOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => {
                                            setIsCategoryOpen(false);
                                            setExpandedCategory(null);
                                        }}
                                    />

                                    {/* Dropdown Panel */}
                                    <div className="absolute left-0 top-full mt-1 w-full md:w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
                                        {/* All category option */}
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("All category");
                                                setIsCategoryOpen(false);
                                                setExpandedCategory(null);
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                                            type="button">
                                            All category
                                        </button>

                                        {/* Category list */}
                                        {categories.map((category) => (
                                            <div key={category.id}>
                                                <button
                                                    onClick={() =>
                                                        handleCategoryClick(category.id, category.name)
                                                    }
                                                    className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
                                                    type="button">
                                                    <span>{category.name}</span>
                                                    {category.sub.length > 0 && (
                                                        <svg
                                                            className={`w-4 h-4 transition-transform ${
                                                                expandedCategory === category.id
                                                                    ? "rotate-90"
                                                                    : ""
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>

                                                {/* Subcategories */}
                                                {expandedCategory === category.id &&
                                                    category.sub.length > 0 && (
                                                        <div className="bg-gray-50 border-l-2 border-primary-500">
                                                            {category.sub.map((sub) => (
                                                                <button
                                                                    key={sub.id}
                                                                    onClick={() =>
                                                                        handleSubCategoryClick(
                                                                            sub.name,
                                                                            category.name
                                                                        )
                                                                    }
                                                                    className="w-full px-6 py-2 text-left text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                                                                    type="button">
                                                                    {sub.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Desktop / tablet: show features inline */}
                        <div className="hidden md:flex items-center gap-2 ml-4 flex-wrap">
                            {features.map((item, index) => (
                                <button
                                    key={index}
                                    aria-label={item.title}
                                    className="btn gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md flex items-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1"
                                    type="button">
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
                                    type="button">
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
};

export default React.memo(BottomNav);