import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SwiperCore, { Navigation, Scrollbar } from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCards from "../Swiper/SwiperCards";
import styled from 'styled-components';


function Watched() {
    const [watchedMovies, setWatchedMovies] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    SwiperCore.use([Navigation, Scrollbar]);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const settings = {
        speed: 1000,
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
        const fetchWatchedMovies = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.error('No access token found');
                    setError('접근 토큰이 없습니다. 다시 로그인해주세요.');
                    return;
                }

                const response = await axios.get('/user/main/history/recent-Watched', {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                console.log('Response data:', response.data.watchHistory); // 전체 응답 데이터 로깅
                setWatchedMovies(response.data.watchHistory);

                //진행상태 저장
                const mappedMovies = response.data.watchHistory.map(movie => ({
                    id: movie.movieId,
                    movieName: movie.movieTitle,
                    mainPosterUrl: movie.poster.posterUrls,
                    movieDescription: movie.movieDescription,
                    progressPercentage: movie.progressPercentage * 100
                }));
                setWatchedMovies(mappedMovies);
            } catch (error) {
                console.error('Error fetching recent watched movies:', error);
                setError('최근 시청 목록을 가져오는데 실패했습니다.')
                return;
            }
        };
        fetchWatchedMovies();
    }, []);

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
                    {watchedMovies.map(movie => {
                        return (
                            <SwiperSlide>
                                {/*재생 아이콘*/}
                                <div className="absolute-center">
                                    <svg viewBox="0 0 84 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.996">
                                            <circle cx="41.78" cy="41.5" r="34.083" fill="#000" fill-opacity="0.7"
                                                    stroke="#fff"></circle>
                                            <path d="M34.863 55.333V27.667L57.343 41.5l-22.48 13.832z"
                                                  fill="#fff"></path>
                                        </g>
                                    </svg>
                                </div>

                                {/*재생바*/}
                                {/*<div className="atom-progressBar-wrapper">*/}
                                {/*    <div className="atom-progressBar-percent"></div>*/}
                                {/*</div>*/}

                                <SwiperCards movie={movie} />
                                {/*<SwiperCards*/}
                                {/*    movie={{*/}
                                {/*        id: movie.movieId,*/}
                                {/*        movieName: movie.movieTitle,*/}
                                {/*        mainPosterUrl: movie.poster.posterUrls,*/}
                                {/*        movieDescription: movie.movieDescription,*/}
                                {/*        progressPercentage: movie.progressPercentage * 100*/}
                                {/*    }}*/}
                                {/*/>*/}
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
export default Watched;

// 전체 박스
const Container = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 2rem;
`;
// 스와이퍼 감싸는 박스
const StyledRoot = styled.div`
    .absolute-center{
        width: 6.916rem;
        height: 6.916rem;
        z-index: 20;
        position: absolute;
        left: 40%;
        top: 40%;
        --tw-translate-x: -50%;
        --tw-translate-y: -50%;
    }

    //재생 막대 박스
    .atom-progressBar-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 20;
        height: .3rem;
        width: 300px;
        background-color: rgba(0, 0, 0, .1);
    }
    //재생 막대
    .atom-progressBar-percent {
        width: 300px;
        height: 100%;
        background-color: rgba(255, 21, 60, .9);

    }

    .swiper {
        width: 1780px;

        &-SwiperSlide {
            width: 300px;
        }

        &-wrapper {
            width: 300px;
        }

        &-container {
            width: 300px;
        }

        &-slide {
            text-align: center;
            font-size: 18px;
            width: 300px;

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
// 화살표
const StyledButtonPrev = styled.button`
    //width: 100px;
    //height: 100px;
    width: 40px;
    background: transparent;
    border: 0px;
`;
// 화살표
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
