import React, {useState, useEffect, useCallback, useRef} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {Link} from "react-router-dom";
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperRecommend from './swiper/SwiperRecommend';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

const MovieCollab = ({ memNum }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    SwiperCore.use([Navigation, Scrollbar]);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const settings = {
        speed: 1500,
        slidesOffsetAfter: 300,
        spaceBetween: 30,
        loop: 4,
        autoplay: 2000,
        navigation: {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
            clickable: true,
        },
        scrollbar: { draggable: true, el: null },
        slidesPerView: 4,
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

    const fetchMovieCollabList = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError('인증 토큰이 없습니다.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`/user/personal/recommend/${memNum}/movie-collab`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('axios Response:', response.data); // 응답 데이터 로깅
            setRecommendations(response.data);
        } catch (error) {
            console.error('데이터를 불러오는데 실패했습니다:', error);
            setError('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [memNum]);

    useEffect(() => {
        fetchMovieCollabList();
    }, [fetchMovieCollabList]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    console.log('Recommendations:', recommendations); // 상태 변수 로깅

    return (
        <Container>
            <StyledButtonPrev ref={prevRef}>
                <ArrowImg
                    alt="arrow"
                    src="https://user-images.githubusercontent.com/118322531/222052387-84d080a9-2270-40b8-a9df-66f9c6f67834.png"
                />
            </StyledButtonPrev>

            <StyledRoot>
                <Swiper {...settings}>
                    {recommendations.length > 0 ? (
                        recommendations.map(movie => (
                            <SwiperSlide key={movie.movieId}>
                                <SwiperRecommend movie={{
                                    id: movie.movieId,
                                    movieName: movie.movieName,
                                    mainPosterUrl: movie.mainPosterUrl?.posterUrls||'https://via.placeholder.com/240x360?text=No+Image',
                                    movieDescription: movie.movieDescription
                                }} />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <p>고객님의 리뷰 데이터가 부족합니다.</p>
                        </SwiperSlide>
                    )}
                </Swiper>
            </StyledRoot>

            <StyledButtonNext ref={nextRef}>
                <ArrowImg
                    alt="arrow"
                    src="https://user-images.githubusercontent.com/118322531/222052382-9c95e3f5-243b-416b-a4de-1913d872492b.png"
                />
            </StyledButtonNext>
        </Container>
    );
};

export default MovieCollab;

// Styled components
const Container = styled.div`
    width: 1024px;
    position: relative;
    margin: 0 auto;
    flex-direction: row;
    align-items: center;
    margin-bottom: 2rem;
    padding: 0 17px;
`;

const StyledRoot = styled.div`
    .swiper {
        width: 1000px;
    }

    .swiper-slide {
        width: 240px;
        height: 360px;

    }
`;

const StyledButtonPrev = styled.div`
    position: absolute;
    top: 50%;
    left: -10px;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;

`;

const StyledButtonNext = styled.div`
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;
`;

const ArrowImg = styled.img`
    width: 30px;
`;