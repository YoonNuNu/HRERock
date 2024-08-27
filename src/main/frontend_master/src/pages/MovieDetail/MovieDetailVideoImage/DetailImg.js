import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import styled from 'styled-components';


//DetailImg
const DetailImg = ({ stillCutList }) => {
  // const items = [
  //   {
  //     src: '{movieStillCut[0]}',
  //   },
  //   {
  //     src: '{movieStillCut[1]}',
  //   },
  // ];

  return (
    <SwiperImg>
      <DetailImgTitle>📌스틸컷</DetailImgTitle>
      <DetailImgSwiper>
        <Swiper
          slidesPerView={1}
          spaceBetween={100}
          effect="fade"
          autoplay={{
            delay: 3000,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation, EffectFade, Pagination, Autoplay]}
          className="mySwiper"
          loop={true}
          scrollbar={{ draggable: true, el: null }}
        >
          {stillCutList?.map(item => {
            return (
              <SwiperSlide key={item.idx}>
                <img src={item} alt="스틸컷" />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <StyledButtonNext>
          <ArrowImg
            alt="arrow"
            src="https://user-images.githubusercontent.com/118322531/222052382-9c95e3f5-243b-416b-a4de-1913d872492b.png"
          />
        </StyledButtonNext>
      </DetailImgSwiper>
    </SwiperImg>
  );
};
const SwiperImg = styled.div`
  margin-bottom: 10px;
`;
const ArrowImg = styled.img`
  width: 30px;
`;
const StyledButtonNext = styled.button`
  width: 100px;
  height: 100px;
  background: transparent;
  border: 0px;
`;
const DetailImgSwiper = styled(Swiper)`
  width: 100%;
  height: 450px;

  .swiper-pagination .swiper-pagination-bullet {
    opacity: 0.8;
    border: 1px solid white;
    background-color: transparent;
    margin-bottom: 20px;
  }
  .swiper-pagination .swiper-pagination-bullet-active {
    width: 30px;
    border-radius: 10px;
    background-color: white;
    transition: 0.2s ease-out;
  }
`;

const DetailImgTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin: 10px;
  padding: 10px 0;
  display: inline-block;
  margin-bottom: 10px;
`;
export default DetailImg;
