import React, {useState} from 'react';
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const PrizeRange = () => {
    const priceOptions = [
        { label: "All Price", min: 0, max: 10000 },
        { label: "Under $20", min: 0, max: 20 },
        { label: "$25 to $100", min: 25, max: 100 },
        { label: "$100 to $300", min: 100, max: 300 },
        { label: "$300 to $500", min: 300, max: 500 },
        { label: "$500 to $1,000", min: 500, max: 1000 },
        { label: "$1,000 to $10,000", min: 1000, max: 10000 },
    ];
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [value, setValue] = useState<[number, number]>([500, 2000]);
    const handleSliderChange = (newValue: [number, number]) => {
        setValue(newValue);
    };
    const handleOptionChange = (index: number) => {
        setSelectedOption(index);
        const option = priceOptions[index];
        setValue([option.min, option.max]);
    };
    return (
        <div>
            <h2 className={"label2 mb-4"}>Price Range</h2>
            <RangeSlider id="range-slider-yellow" onInput={handleSliderChange} value={value} max={10000}/>
            <div className="flex gap-2 my-6">
                <input
                    type="text"
                    placeholder="Min price"
                    value={value[0]}
                    onChange={(e) => setValue([parseInt(e.target.value, 10) || 0, value[1]])}
                    className="input input-warning"
                />
                <input
                    type="text"
                    placeholder="Max price"
                    value={value[1]}
                    onChange={(e) => setValue([value[0], parseInt(e.target.value, 10) || 0])}
                    className="input input-warning"
                />
            </div>
            <div className="flex flex-col gap-3">
                {priceOptions.map((option, index) => (
                    <label
                        key={index}
                        className="flex items-center gap-3 cursor-pointer text-sm text-gray-700"
                    >
                        <input
                            type="radio"
                            name="priceRange"
                            defaultChecked={selectedOption === index}
                            onChange={() => handleOptionChange(index)}
                            className="radio text-primary-500 w-5 h-5"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default React.memo(PrizeRange);
