import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCard from '../Swiper/SwiperCard';
// import useFetch from '../../../Hooks/useFetch';
import axios from "axios";
import styled from 'styled-components';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const Recent = () => {
    const [recentMovies, setRecentMovies] = useState([]);
    const navigate = useNavigate();

    SwiperCore.use([Navigation, Scrollbar]);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const settings = {
        speed: 1500,
        slidesOffsetAfter: 300,
        spaceBetween: 0,
        loop: 5,
        autoplay: 2000,
        navigation: {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
            clickable: true,
        },
        scrollbar: { draggable: true, el: null },
        slidesPerView: 5,
        onInit: swiper => {
            setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
            });
        },
    };

    useEffect(() => {
        const fetchRecentMovies = async () => {
            const response = await axios.get(`/user/main/updated`);
            setRecentMovies(response.data);
        };

        fetchRecentMovies();
    }, [navigate]);

    return (
        <Container>
            <StyledButtonPrev ref={prevRef}>
                <ArrowImg
                    alt="arrow"
                    src="https://user-images.githubusercontent.com/118322531/222052387-84d080a9-2270-40b8-a9df-66f9c6f67834.png"
                />
            </StyledButtonPrev>

            {/*스와이퍼 - API  받기*/}
            <StyledRoot>
                <Swiper {...settings}>
                    {recentMovies.map(movie => {
                        return (
                            <SwiperSlide key={movie.id} >
                                <SwiperCard
                                    movie={{
                                        id: movie.movieId,
                                        movieName: movie.movieTitle,
                                        mainPosterUrl: movie.poster.posterUrls,
                                        movieDescription: movie.movieDescription
                                    }}
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </StyledRoot>


            {/*화살표*/}
            <StyledButtonNext ref={nextRef}>
                <ArrowImg
                    alt="arrow"
                    src="https://user-images.githubusercontent.com/118322531/222052382-9c95e3f5-243b-416b-a4de-1913d872492b.png"
                />
            </StyledButtonNext>
        </Container>
    );
}

export default Recent;

// 2단.
const Container = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 2rem;
`;




const StyledRoot = styled.div`

    .swiper {
        width: 1780px;


        &-SwiperSlide{
            width: 300px;
            margin-bottom: 40px;
        }
        &-wrapper {
            width: 300px;
            margin-bottom: 40px;
        }
        &-container {
            width: 300px;
            margin-bottom: 40px;
        }

        &-slide {
            text-align: center;
            font-size: 18px;
            width: 300px;
            margin-bottom: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            //margin-right: 3rem;

        }

        &-slide img {
            display: block;
            width: 300px;
            border-radius: 5px;
            -webkit-box-shadow: 10px 12px 25px 5px rgba(0, 0, 0, 0.19);
            box-shadow: 10px 12px 25px 5px rgba(0, 0, 0, 0.19);
        }
    }
`;

const StyledButtonPrev = styled.button`
    //width: 100px;
    //height: 100px;
    width: 40px;
    background: transparent;
    border: 0px;
`;

const StyledButtonNext = styled.button`
    //width: 100px;
    //height: 100px;
    width: 40px;
    background: transparent;
    border: 0px;
`;


// 화살표
const ArrowImg = styled.img`
    //width: 30px;
    width: 40px;
    //margin-left: 20px;
    //margin-right: 20px;
`;

// // 포스터 이미지
// const TopListImg = styled.img`
//   //border-radius: 15px;
//   width: 300px;
//   height: 450px;
//   border-radius: 5px;
//   //padding: 10px;
//   //margin-bottom: 20px;
// `;

