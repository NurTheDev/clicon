import React from 'react';
import Container from "../../../../common/Container.tsx";
import {getImgUrl} from "../../../../helpers";
import {categoryShop} from "../../../../data";
import Slider from "../../../../helpers/Slider.tsx";

const CategoryShop = () => {
    return (
        <div className={"mt-5 lg:mt-10 font-public-sans text-center text-gray-900"}>
            <Container>
                <h2 className={" heading1 "}>
                    Shop with Categorys
                </h2>
                <div className={"mt-5 lg:mt-10"}>
                    <Slider slidesPerView={6} dots={false} autoPlay={true} loop={true} spaceBetween={30} animationDuration={2000} navigation={true}>
                        {categoryShop.map((item, index) => (
                            <div key={index} className={"flexColumnCenter gap-y-4 py-6 px-3 max-h-[250px] h-full"}>
                                <img className={"max-w-[148px] max-h-[148px]"} src={getImgUrl(item.image)} alt=""/>
                                <p className={"label1"}>{item.title}</p>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Container>
        </div>
    );
};

export default React.memo(CategoryShop);