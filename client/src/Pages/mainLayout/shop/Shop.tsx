import React from 'react';
import Breadcrumbs from "../../../common/Breadcrumbs.tsx";
import Container from "../../../common/Container.tsx";
import {useQuery} from "@tanstack/react-query";
import ProductCard from "../../../common/ProductCard.tsx";
import ProductCardSkeleton from "../../../skeletons/ProductCardSkeleton.tsx";
import Icons from "../../../helpers/IconProvider.tsx";
import SearchBar from "../../../common/SearchBar.tsx";
interface SideBarLinksProps {
    selectedCategory: string;
    onSelect: (category: string) => void;
}
const SideBarLinks:React.FC<SideBarLinksProps> = ({selectedCategory, onSelect})=>{
    const {data, isLoading} = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetch('https://dummyjson.com/products/category-list');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
    const [visibleCategories, setvisibleCategories] = React.useState<number>(5);
    return (
        <div>
            <h2 className={"label2 mb-4"}>Category</h2>
            <ul className={"flex flex-col gap-3"}>
                {data?.slice(0, visibleCategories).map((category: string, index: number) => (
                    isLoading ? (
                        <li className="flex items-center gap-2 animate-pulse">
                            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-24"></div>
                        </li>
                    ) : (
                        <li
                            key={index}
                            className="flex items-center gap-2 py-2 last:border-b last:border-gray-100 last:pb-6"
                        >
                            <input
                                type="radio"
                                name="radio-5"
                                className="radio text-primary-500 w-5 h-5"
                                value={category}
                                checked={selectedCategory === category}
                                onClick={() => onSelect(category)}
                            />
                            <span className="ml-2 body-medium-400">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </li>
                    )
                ))}
                {data && data.length > visibleCategories && (
                    <button
                        className="mt-4 text-primary-500 body-medium-500 text-start flex items-center gap-1"
                        onClick={() => setvisibleCategories(prev => prev + 5)}
                    >
                        <span>Show More </span> <span>{Icons.rightArrow}</span>
                    </button>
                )}
            </ul>
        </div>
    )
}
const Shop:React.FC = () => {
    const [selectedCategory, setSelectedCategory] = React.useState<string>("beauty");
    const {data, isLoading} = useQuery({
        queryKey: ['products', selectedCategory],
        queryFn: async () => {
            const response = await fetch(`https://dummyjson.com/products/category/${selectedCategory}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
    const products = data?.products;
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    };
    return (
        <div>
            <Breadcrumbs/>
            <Container><div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8"}>
                {/* Sidebar - Filters */}
                <div className={"col-span-1"}>
                    <SideBarLinks selectedCategory={selectedCategory} onSelect ={setSelectedCategory}/>
                </div>
                <div className={"col-span-3 "}>
                    <div className={"flexRowBetween "}>
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
                        <div className={"flexRowBetween gap-4"}>
                            <p>Sort by:</p>
                            <button className="btn flexRowBetween" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}>
                                <span>Most Popular</span><span>{Icons.downArrow}</span>
                            </button>

                            <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                                popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */ }>
                                <li><a>Item 1</a></li>
                                <li><a>Item 2</a></li>
                            </ul>
                        </div>
                    </div>
                   <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mt-5"}>
                       {isLoading ? (
                           Array.from({ length: 8 }, (_, index) => (
                               <ProductCardSkeleton key={index} />
                           ))
                       ) : (
                           products?.map((product:any)=>(
                               <div>
                                   <ProductCard key={product.id} product={product} />
                               </div>
                           ))
                       )}
                   </div>
                </div>
            </div>
            </Container>
        </div>
    );
};

export default React.memo(Shop);