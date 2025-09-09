import React from 'react';
import {Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

type SliderProps = {
    children: React.ReactNode;
    spaceBetween?: number;
    slidesPerView?: number | 'auto';
};
const Slider: React.FC<SliderProps> = ({
                                           children,
                                           spaceBetween = 50,
                                           slidesPerView = 1,
                                       }) => {
    const slides = React.Children.toArray(children).map((child, index) => (
        <SwiperSlide  key={index} >{child}</SwiperSlide>
    ));
    return (
        <div >
            <Swiper
                pagination={{
                    dynamicBullets: true,
                    clickable: true,
                }}
                modules={[Pagination]}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >
                {slides}
            </Swiper>
        </div>
    );
};

export default React.memo(Slider);