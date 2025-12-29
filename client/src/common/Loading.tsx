import React from 'react';

const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-full">
            <span className="loading loading-dots loading-xl text-primary-500"></span>
            <span className="label1">Please wait...</span>
        </div>
    );
};

export default React.memo(Loading);
