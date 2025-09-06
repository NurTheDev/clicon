import React from 'react';
import Container from "../../../../common/Container.tsx";

const HeroBanner = () => {
    return (
        <div>
            <Container>
                <div className={"grid grid-cols-1 gap-4 md:grid-cols-2 items-center lg:grid-cols-3"}>
                    <div className={"lg:col-span-2 rounded-md bg-gray-50 lg:p-12 xl:p-14 p-6 md:p-10"}>
                        <div>
                            <p className={"text-secondary-600 body-medium-600 font-public-sans"}>
                                THE BEST PLACE TO PLAY
                            </p>
                            <h1 className={"text-gray-900 font-public-sans "}>Xbox Consoles</h1>
                        </div>
                    </div>
                    <div className={"grid grid-row-2 gap-4"}>
                        <div className={"bg-blue-400 h-10"}></div>
                        <div className={"bg-green-400 h-10"}></div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default React.memo(HeroBanner);