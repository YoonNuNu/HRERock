import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styled from 'styled-components';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// import useFetch from "../../../Hooks/useFetch";
import SwiperCore, {Navigation, Scrollbar} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCard from "../Swiper/SwiperCard";



//MainTop10 -03.실시간 인기 영화 <인기 순위>
const Ranking = () => {
    const [rankMovies, setRankMovies] = useState([]);
    // const [error, setError] = useState(null);
    const navigate = useNavigate();

    SwiperCore.use([Navigation, Scrollbar]);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const settings = {
        speed: 1000,
        slidesOffsetAfter: 0,
        spaceBetween: 10,
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
        const fetchRankingMovies = async () => {
            const response = await axios.get(`/user/main/ranking`);
            setRankMovies(response.data);
        };
        fetchRankingMovies();
    }, [navigate])


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
                    {rankMovies.map((movie, index) => (
                        <SwiperSlide key={movie.id}>
                            {/* ★!! 순위와 영화 제목 !!★ */}
                            <Top4ContextContainer>
                                <Top4TitleText>{index + 1}</Top4TitleText>
                            <SwiperCard
                                movie={{
                                    id: movie.movieId,
                                    movieName: movie.movieTitle,
                                    mainPosterUrl: movie.poster.posterUrls,
                                    movieDescription: movie.movieDescription
                                }}
                            />


                            </Top4ContextContainer>
                        </SwiperSlide>
                    ))}
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
};

export default Ranking;


// 전체 박스
const Container = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    //flex-direction: row; //추가부분
    //align-items: center; //추가부분
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
            //margin-bottom: 40px; //간격맞추기
        }
        &-container {
            width: 300px;
            margin-bottom: 40px;
        }

        &-slide {
            text-align: center;
            font-size: 18px;
            width: 300px;
            //margin-bottom: 40px; //간격맞추기
            display: flex;
            justify-content: center;
            align-items: center;
            //margin-right: 3rem;

        }

        &-slide img {
            display: block;
            width: 300px;
            height: 450px;
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

// --------------------------------------------------
// style
// const Top4WholeContainer = styled.div`
//     display: flex;
//     flex-direction: column;
// `;

//3단 포스터-
const Top4ContextContainer = styled.div`
    // background-color: RGB(228 228 228);
    //padding: 30px;
    //// border-radius: 20px;
    //word-break: break-all;
    //overflow-x: hidden;
`;

// 순위표기
const Top4TitleText = styled.p`
    color: #fff;
    font-size: 9rem;
    line-height: 0.5rem;
    font-weight: 900;
    margin-bottom: 20px;
    //font-family: "Montserrat", sans-serif;
    position: absolute;
    bottom: 31px;
    left: auto;
    margin-left: -0.2rem;
    text-align: left;
    //text-indent: -40px;
    z-index: 10;
    //font-family: 'SUIT-Regular';
    //text-shadow: 1px 1px 1px #676767;
`;

// const Top4SubTitleText = styled.p`
//     font-family: 'SUIT-Regular';
//   font-size: 18px;
//     line-height: 1.5rem;
//     color: #fff;
// `;

// const TopListImgAndContext = styled.div`
//   //padding: 10px;
//   border-radius: 20px;
//   box-shadow: 21px 17px 28px -4px rgba(0, 0, 0, 0.36);
//   -webkit-box-shadow: 21px 17px 28px -4px rgba(0, 0, 0, 0.36);
//   -moz-box-shadow: 21px 17px 28px -4px rgba(0, 0, 0, 0.36);
//   transition: 0.3s;
//
//   &:hover {
//     scale: 1.1;
//     transition: 0.3s;
//   }
// `;
//
// const Hotkeyword = styled.span`
//     color: #fff;
// `;


// // 3단 전체 박스
// const TopList4Container = styled.div`
//   //  width: 100%;
//   //  background-color: rgb(11, 11, 13) !important;
//   //display: flex;
//   //justify-content: center;
//   //flex-direction: column;
//
//     width: 1780px;
//     margin: 0 auto;
//     font-family: 'SUIT-Regular';
//     font-size: 20px;
//     line-height: 36px;
//     color: #fff;
//     font-weight: 400;
//     text-align: left;
//     //margin-bottom: 40px;
// `;

// const TopListBox = styled.div`
//   display: grid;
//   grid-template-columns: repeat(8, 2fr);
//     padding: 0 40px;
//   //gap: 10px;
//     gap: 20px;
//
//
// //2단 이미지 시작 구간
//     margin-left: auto;
//     margin-right: auto;
//     position: relative;
//     overflow: hidden;
//     list-style: none;
//     z-index: 1;
// `;
//
// // 포스터 이미지
// const TopListImg = styled.img`
//   //border-radius: 15px;
//   width: 300px;
//   height: 450px;
//   border-radius: 5px;
//   //padding: 10px;
//   //margin-bottom: 20px;
// `;
//
// //제목
// const Top4TitleBox = styled.div`
//     width: 100%;
//     display: flex;
//
// `;
//
// // 문구
// const Top4Title = styled.h1`
//     //@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap');
//     //font-family: "Nanum Gothic", sans-serif;
//     //font-size: 1.2rem;
//     //color: rgba(255,255,255,1);
//     //font-weight: 500;
//     //letter-spacing: -2px;
//     //line-height: 1.5;
//     //padding: 0 0 1rem;
//     //font-stretch: normal;
//     //font-style: normal;
//     //letter-spacing: normal;
//     //text-align: left;
//     //margin-left: 3rem;
//     //z-index: 1;
//     //padding-top: 5rem;
//
//     font-size: 22px;
//     //margin-bottom: 20px;
//     line-height: 86px;
//     color: #fff;
//     font-weight: 400;
//     vertical-align: middle;
//     margin-left: 3rem;
//
//     //.SectionANav{
//     //    font-size: 1.2rem;
//     //    color: #02d6e8;
//     //    font-weight: 700;
//     //    line-height: 1.5;
//     //    letter-spacing: -0.5px;
//     //}
// `;
//
// // 포스터 이미지
// const Icon = styled.img`
//   width: 100px;
//   height: 100px;
//   margin-top: 10px;
// `;

