import React from 'react';

const PrizeRange = () => {
    return (
        <div>
            <h2 className={"label2 mb-4"}>Price Range</h2>
            <input type="range" min={0} max="100"
                   className="range text-primary-500 [--range-thumb:primary-500] [--range-fill:0]" />
        </div>
    );
};

export default React.memo(PrizeRange);