import React from "react";
import {useQuery} from "@tanstack/react-query";
import Icons from "../../../../helpers/IconProvider.tsx";
interface SideBarLinksProps {
    selectedCategory: string;
    onSelect: (category: string) => void;
}
const Sidebar_CategoryLink:React.FC<SideBarLinksProps> = ({selectedCategory, onSelect})=>{
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
                                defaultChecked={selectedCategory === category}
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

export default React.memo(Sidebar_CategoryLink);