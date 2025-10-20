import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
// @ts-ignore
import 'swiper/css/navigation';
// import required modules
import {Navigation, Pagination, Autoplay} from 'swiper/modules';

type SliderProps = {
    children: React.ReactNode;
    spaceBetween?: number;
    slidesPerView?: number;
    animationDuration?: number;
    animation?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
    dots?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
    navigation?: boolean;
    mobileBreakpointPx?: number;
    tabletBreakpointPx?: number;
    desktopBreakpointPx?: number;
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
                                           navigation = false,
                                           mobileBreakpointPx = 640,
                                           tabletBreakpointPx = 641,
                                           desktopBreakpointPx = 1024,
                                       }) => {
    const slides = React.Children.toArray(children).map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
    ));
    // For widths < mobileBreakpointPx -> always 1; otherwise use provided slidesPerView
    const breakpoints = {
        0: {slidesPerView: 1},
        [mobileBreakpointPx]: {slidesPerView},
        [tabletBreakpointPx]: {slidesPerView: slidesPerView >= 2 ? slidesPerView - 2 : 1},
        [desktopBreakpointPx]: {slidesPerView},
    };
    return (
        <div>
            <Swiper
                pagination={dots ? {clickable: true, dynamicBullets: true} : false}
                autoplay={autoPlay ? {delay: animationDuration, disableOnInteraction: false} : false}
                effect={animation}
                loop={loop}
                navigation={navigation}
                speed={animationDuration}
                modules={[Pagination, Navigation, Autoplay]}
                className="mySwiper"
                spaceBetween={spaceBetween}
                grabCursor={true}
                slidesPerView={slidesPerView}
                breakpoints={breakpoints}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {slides}
            </Swiper>
        </div>
    );
};

export default React.memo(Slider);