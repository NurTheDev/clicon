import React from "react";


const PopularBrands = () => {

    const brandName = ["Apple", "Microsoft", "Dell", "Symphony", "Sony", "LG", "One Plus", "Google", "Samsung", "HP", "Xiaomi", "Panasonic", "Intel"];
        return (
        <div>
            <h2 className="label2 mb-4">POPULAR BRANDS</h2>
            <div className="flex gap-12">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 ">
                    {brandName.map((brand: string, index: number) => (
                        <label key={index} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                            <input
                                type="checkbox"
                                className="checkbox text-primary-500 w-5 h-5 border border-gray-300 rounded-md"
                            />
                            {brand}
                        </label>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(PopularBrands);
