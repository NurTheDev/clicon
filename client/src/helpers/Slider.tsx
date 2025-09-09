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
    animationDuration?: number;
    animation?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
    dots?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
};
const Slider: React.FC<SliderProps> = ({
                                           children,
                                           spaceBetween = 50,
                                           slidesPerView = 1,
                                           animationDuration = 3000,
                                           animation = 'slide',
                                           dots = true,
                                           autoPlay = false,
                                           loop = true,
                                       }) => {
    const slides = React.Children.toArray(children).map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
    ));
    return (
        <div>
            <Swiper
                pagination={dots ? {clickable: true, dynamicBullets: true} : false}
                autoplay={autoPlay ? {delay: animationDuration, disableOnInteraction: false} : false}
                effect={animation}
                loop={true}
                speed={animationDuration}
                modules={[Pagination]}
                className="mySwiper"
                spaceBetween={spaceBetween}
                grabCursor={true}
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