import React, { useRef } from 'react';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import SwiperCard from './SwiperCard';
import useFetch from '../../../Hooks/useFetch';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


export default function PosterSwiper(data) {
    const [swiperData, loading, error] = useFetch('/data/SwiperMoviesData_4.json');


    SwiperCore.use([Navigation, Scrollbar]);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const settings = {
        speed: 1500,
        slidesOffsetAfter: 550,
        spaceBetween: 0,
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
                    {movieData.map(movie => {
                        return (
                            <SwiperSlide key={movie.id}>
                                <SwiperCard movie={movie} />
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

//데이터
const TOP_FOUR_LIST = [
    {
        id: 1,
        movieTitle: '1',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM2100/ko/20240524/0145/M000377169.jpg/dims/resize/F_webp,480',
    },
    {
        id: 2,
        movieTitle: '2',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM2100/ko/20240624/0110/M000377284.jpg/dims/resize/F_webp,400',
    },
    {
        id: 3,
        movieTitle: '3',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM2100/ko/20240220/0035/M000376602.jpg/dims/resize/F_webp,400',
    },
    {
        id: 4,
        movieTitle: '4',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM1170/ko/20240705/0254/M000377290.jpg/dims/resize/F_webp,400',
    },
    {
        id: 5,
        movieTitle: '5',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM2100/ko/20240719/0905/M000377365.jpg/dims/resize/F_webp,400',
    },
    {
        id: 6,
        movieTitle: '6',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM1160/ko/20201221/M000350734.jpg/dims/resize/F_webp,400',
    },
    {
        id: 7,
        movieTitle: '7',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM2100/ko/20231211/0715/M000359599.jpg/dims/resize/F_webp,400',
    },
    {
        id: 8,
        movieTitle: '8',
        movieSubTitle: '인사이드 아웃 2',
        movieContent: '3살이 된 라일리의 행복을 위해',
        movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM2100/ko/20230426/M000373341.jpg/dims/resize/F_webp,400',
    },
    // {
    //     id: 9,
    //     movieTitle: '9',
    //     movieSubTitle: '인사이드 아웃 2',
    //     movieContent: '3살이 된 라일리의 행복을 위해',
    //     movieThumbnail: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM1130/ko/20240327/0419/M000371836.jpg/dims/resize/F_webp,400',
    // },
    // {
    //     id: 10,
    //     movieTitle: '10',
    //     movieSubTitle: '인사이드 아웃 2',
    //     movieContent: '3살이 된 라일리의 행복을 위해',
    //     mainPosterUrl: 'https://image.tving.com/ntgs/contents/CTC/caim/CAIM1130/ko/20240327/0418/M000376432.jpg/dims/resize/F_webp,400',
    // },
];

// 2단.
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
    margin-bottom: 2rem;
    `;
    
    const StyledRoot = styled.div`
    .swiper {
      //width: 1280px;
      
      
      &-wrapper {
        //width: 100%;
        //margin: 0;
        //gap: 60px;
      }
      &-container {
        //width: 2000px;
        //margin: 0;
      }
      
      &-slide {
        text-align: center;
        font-size: 18px;
        width: 200px;
        // height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      &-slide img {
      border-radius: 10px;
      display: block;
      width: 300px;
      height: 430px;

      object-fit: cover;
      //border-radius: 10px;
      -webkit-box-shadow: 10px 12px 25px 5px rgba(0, 0, 0, 0.19);
      box-shadow: 10px 12px 25px 5px rgba(0, 0, 0, 0.19);
    }
  }
`;

const StyledButtonPrev = styled.button`
  width: 100px;
  height: 100px;
  background: transparent;
  border: 0px;
`;

const StyledButtonNext = styled.button`
  width: 100px;
  height: 100px;
  background: transparent;
  border: 0px;
`;


// 화살표
const ArrowImg = styled.img`
  //width: 30px;
    width: 40px;
    margin-left: 20px;
    margin-right: 20px;
`;
