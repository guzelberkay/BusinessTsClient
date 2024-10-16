import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../store/index";
import { useDispatch } from "react-redux";
import {
    fetchFindAllProduct,
    fetchFindAllProductCategory,
    fetchFindAllStockMovement,
    fetchFindAllSupplier,
    fetchFindAllWareHouse
} from "../store/feature/stockSlice";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import localImage1 from '../images/resim.jpg';
import localImage2 from '../images/unnamed.jpg';
import localImage3 from '../images/unnamed2.png';

function HomePage() {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const images = [
        'https://blog.inkaik.com/wp-content/uploads/2024/02/Insan-Kaynaklari-Alaninda-Gelecegin-Meslekleri-ve-Trendleri-scaled.jpg',
        localImage1,
        localImage2,
        localImage3
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <div style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
            <Slider {...settings} style={{ height: '100%' }}>
                {images.map((img, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%', 
                        }}
                    >
                        <img 
                            src={img} 
                            alt={`slide ${index}`} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                            }} 
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default HomePage;
