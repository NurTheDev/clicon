import React from 'react';
import Breadcrumbs from "../../../common/Breadcrumbs.tsx";
import Container from "../../../common/Container.tsx";
import {useQuery} from "@tanstack/react-query";
import ProductCard from "../../../common/ProductCard.tsx";
import ProductCardSkeleton from "../../../skeletons/ProductCardSkeleton.tsx";
import Icons from "../../../helpers/IconProvider.tsx";
import SearchBar from "../../../common/SearchBar.tsx";
import SideBarLinks from "./component/SideBar.tsx";
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