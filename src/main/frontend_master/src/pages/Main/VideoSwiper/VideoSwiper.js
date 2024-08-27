import React, { useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import Videos from './Videos';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './VideoSwiper.css';

// import required modules
import { EffectFade, Pagination, Navigation } from 'swiper';



//Tab
export default function App() {
    const [movieData, setMovieData] = useState({});



    return (
        <StyledSwiper
            rewind={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            slidesPerView={1}
            spaceBetween={100}
            loop={true}
            pagination={{
                clickable: true,
            }}
        //     navigation: {
        //   true
        // }
            modules={[EffectFade, Pagination]}
            effect="fade"
            className="mySwiper"
        >
      {/*       <SwiperSlide>*/}
      {/*  <Videos movieData={movieData} />*/}
      {/*</SwiperSlide>*/}

            {VIDEO_DATA.map(item => (
                <SwiperSlide key={item.id}>
                    <Videos item={item} />
                </SwiperSlide>
            ))}
        </StyledSwiper>
    );
}


//StyledSwiper
const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 650px;
  background-color: rgb(11, 11, 13);
    margin-bottom: 80px;
    

  .swiper-pagination .swiper-pagination-bullet {
    opacity: 1;
    //border: 1px solid rgba(255,255,255,0.5);
      background-color: #fff;
    margin-bottom: 45px;
      box-shadow: 10px 12px 25px 5px rgba(0, 0, 0, 0.5);
  }
  .swiper-pagination .swiper-pagination-bullet-active {
    width: 50px;
    border-radius: 10px;
    background-color: #ff27a3;
    transition: 0.2s ease-out;
  }
`;


//VIDEO_DATA
const VIDEO_DATA = [
    {
        id: 1,
        title: '에이리언',
        video_url:
            'https://s3550.smartucc.kr/encodeFile/3550/2024/08/16/432172eb9cc6728930b0e68f145e947d_W.mp4',
        description:
            '2142년, 부모 세대가 맞닥뜨렸던 암울한 미래를 피하려는 청년들이 더 나은 삶을 찾기 위해 식민지를 떠날 계획을 세운다.',
    },
    {
        id: 2,
        title: '늘봄가든',
        video_url:
            'https://s3550.smartucc.kr/encodeFile/3550/2024/07/23/d9b3c43e27766fd7fe378d4f78484820_W.mp4',
        description:
            '곤지암 정신병원, 경북 영덕횟집, 그리고... 늘봄가든',
    },
    {
        id: 3,
        title: '필사의 추격',
        video_url:
            'https://s3550.smartucc.kr/encodeFile/3550/2024/08/01/bff0d99406bea5eb8b6dbecf8f16968b_W.mp4',
        description:
            '완벽한 변장술로 형사들을 크게 뺑이 치게 만들어 빅뺑이라 불리는 사기꾼 김인해',
    },
    {
        id: 4,
        title: '파일럿',
        video_url:
            'https://s3550.smartucc.kr/encodeFile/3550/2024/08/01/5433ccf75a42e75a3d9dc33e5bcd9b91_W.mp4',
        description:
            '하루 아침에 인생 추락한 스타 파일럿',
    },
];
