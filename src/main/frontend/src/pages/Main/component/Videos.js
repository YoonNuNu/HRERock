import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReactPlayer from "react-player";
import styled from 'styled-components';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { EffectFade, Pagination, Autoplay } from 'swiper';

const Videos = () => {
    const [movies, setMovies] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const swiperRef = useRef(null);
    const playerRefs = useRef([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`/user/main/updated-trailers`);
                setMovies(response.data);
            } catch (error) {
                console.error('비디오 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        fetchVideos();
    }, []);

    useEffect(() => {
        if (playerRefs.current[0]) {
            playerRefs.current[0].getInternalPlayer()?.playVideo();
        }
    }, [movies]);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    const handleVideoEnd = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const getMainTrailerUrl = (movie) => {
        if (movie.trailer) {
            if (Array.isArray(movie.trailer)) {
                // 배열인 경우 mainTrailer가 true인 트레일러를 찾습니다
                const mainTrailer = movie.trailer.find(t => t.mainTrailer === true);
                if (mainTrailer) {
                    // console.log('메인 트레일러 URL:', mainTrailer.trailerUrls);
                    return mainTrailer.trailerUrls;
                }
                // mainTrailer가 없으면 첫 번째 트레일러를 사용
                return movie.trailer[0].trailerUrls;
            } else if (movie.trailer.mainTrailer === true) {
                // 단일 객체인 경우 mainTrailer가 true인지 확인합니다
                // console.log('메인 트레일러 URL:', movie.trailer.trailerUrls);
                return movie.trailer.trailerUrls;
            }
        }
        console.log('메인 트레일러 없음');
        return null; // 메인 트레일러가 없을 경우
    };

    return (
        <VideoWrapper>
            <StyledSwiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                pagination={{ clickable: true }}
                modules={[EffectFade, Pagination]}
                effect="fade"
                className="mySwiper"
                onSlideChange={handleSlideChange}
            >
                {movies.map((movie, index) => {
                    const trailerUrl = getMainTrailerUrl(movie);
                    if (!trailerUrl) {
                        // 트레일러가 없을 경우 이 영화를 스킵
                        return null;
                    }
                    // 여기서 하나의 슬라이드만 생성
                    return (
                        <SwiperSlide key={movie.movieId}>
                            <VideoTextWrapper>
                                <VideoTitle>{movie.movieTitle}</VideoTitle>
                                <VideoContext>{movie.movieDescription || '줄거리 정보가 없습니다.'}</VideoContext>
                                <VideoBtn onClick={() => navigate(`/user/moviePlay/${movie.movieId}`)}>
                                    재생
                                </VideoBtn>
                                <VideoBtn onClick={() => navigate(`/user/moviePage/${movie.movieId}`)}>
                                    상세 보기
                                </VideoBtn>
                            </VideoTextWrapper>
                            <MainVideoWrapper>
                                <MainVideo
                                    className="MainVideo"
                                    ref={el => playerRefs.current[index] = el}
                                    url={trailerUrl}
                                    playing={index === activeIndex}
                                    muted
                                    loop={false}
                                    controls={false}
                                    width="100%"
                                    height="100%"
                                    onEnded={handleVideoEnd}
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                modestbranding: 1,
                                                rel: 0,
                                                controls: 0,
                                                showinfo: 0,
                                                fs: 0,
                                                iv_load_policy: 3,
                                                disablekb: 1,
                                                playsinline: 1,
                                                autohide: 1,
                                                end: 0,
                                                autoplay: 1,
                                            },
                                            embedOptions: {
                                                height: '100%',
                                                width: '100%'
                                            }
                                        }
                                    }}
                                />
                            </MainVideoWrapper>
                        </SwiperSlide>
                    );
                })}
            </StyledSwiper>
        </VideoWrapper>
    );
};

export default Videos;

// 스타일 코드
const VideoWrapper = styled.div`
    position: relative;
    width: 100vw;
    overflow: hidden;
    margin-bottom: 60px;
`;

const MainVideoWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;  
    overflow: hidden;
    object-fit: contain;
`;

const VideoTextWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 120px;
    transform: translateY(-50%);
    width: 600px;
    text-align: start;
    z-index: 1000;
`;

const VideoTitle = styled.h2`
    color: #fff;
    font-size: 40px;
    font-weight: 600;
    text-shadow: 1px 1px 3px black;
`;

const VideoContext = styled.p`
    margin: 30px 0 35px 0;
    color: #fff;
    font-weight: 300;
    font-size: 17px;
    line-height: 25px;
    opacity: 1;
`;

const VideoBtn = styled.button`
    width: 120px;
    margin: 15px 10px;
    padding: 10px 10px;
    border: 2px solid #fff;
    border-radius: 5px;
    color: white;
    font-size: 15px;
    cursor: pointer;
    transition: 0.3s;
    background: rgba(0, 0, 0, 0.5);

    &:hover {
        color: #02d6e8;
        border: 2px solid #02d6e8;
        font-weight: 800;
        background: rgba(0, 0, 0, 0.7);
    }
`;

const MainVideo = styled(ReactPlayer)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    object-fit: fill;
`;

const StyledSwiper = styled(Swiper)`
    width: 100%;
    height: 620px;
    background-color: rgb(11, 11, 13);
    
    .mySwiper{
        margin-right: 20px;
        background-color: red;
    }
    .swiper-pagination-bullet {
        opacity: 1;
        background-color: #fff;
        width: 12px;
        height: 12px;
    }

    .swiper-pagination-bullet-active {
        background-color: #ff27a3;
    }

    .swiper-button-prev,
    .swiper-button-next {
        color: #fff;
    }
`;