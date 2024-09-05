import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {SwiperSlide} from "swiper/react";
import Videos from "../component/Videos";



//SwiperCard
function SwiperCard({ movie }) {
    const [isMouseHover, setIsMouseHover] = useState(false);
    const {
        movieName,
        mainPosterUrl,
        posterUrl,
        movieDescription,
    } = movie;
    const poster = mainPosterUrl || (posterUrl && posterUrl.length > 0 ? posterUrl[0].posterUrls : '/path/to/default/image.jpg'); //default 이미지 만들기
    const navigate = useNavigate();


    //다음 페이지
    const goToBooking = () => {
        navigate(`/`);
    };

    const onMouseOverMovie = () => {
        setIsMouseHover(true);
    };

    const onMouseOutMovie = () => {
        setIsMouseHover(false);
    };

    return (

        <SwiperCardContainer
            onMouseOver={onMouseOverMovie}
            onMouseOut={onMouseOutMovie}
        >
            <Overlay isMouseHover={isMouseHover}>
                <OverlayText>{movieDescription}</OverlayText>

                {/*마우스 호버 시 */}
                <MouseHoverButton>

                    <OverlayBtn
                        onClick={() => {
                            navigate(`/user/moviePage/${movie.id}`);
                        }}
                    >
                        보러가기
                    </OverlayBtn>


                </MouseHoverButton>
            </Overlay>

            <PosterImg src={poster} alt={movieName} />

            {/*<MovieInfoTextWrapper>*/}
            {/*    <MovieInfoTitle>{movieName}</MovieInfoTitle>*/}
            {/*    <MovieInfoText>{movieNameInEnglish}</MovieInfoText>*/}
            {/*</MovieInfoTextWrapper>*/}
        </SwiperCardContainer>
    );
}
export default SwiperCard;

// style
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;


const SwiperCardContainer = styled.div`
  position: relative;
    width: 245px;
    margin-right: 10px;
    margin-left: 0px;
`;

const Overlay = styled.div`
  display: ${props => (props.isMouseHover ? 'block' : 'none')};
  position: absolute;
  width: 300px;
  height: 450px;
    //border: 1px solid red;

    //border-radius: 8px;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(20px);
  animation: ${fadeIn} 0.1s ease-out;
  z-index: 100;
    //transform: scale(1.1);
    //transition: all 0.2s linear;
    //overflow: hidden;  
`;

// 2단, 호버시, 보이는 내용
const OverlayText = styled.p`
  width: 200px;
  height: 150px;
  overflow: hidden;  
  margin: auto;
  margin-top: 100px;
  font-weight: 400;
  text-align: center;
  color: white;
  font-size: 14px;
  line-height: 25px;
`;

const OverlayBtn = styled.button`
  width: 150px;
  height: 55px;
  border-radius: 5px;
  margin-top: 30px;
  border: 0px;
  background: #1351f9;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

    
  &:hover {
    background-color: rgb(11, 11, 13,1);
    color: #fff;
    border: 2px solid #fff;
    //box-shadow: 1.8px 3.7px 8px #767676;
  }
`;

const PosterImg = styled.img`
    width: 300px !important;
    height: 450px !important;
`;

const MovieInfoTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const MovieInfoTitle = styled.h3`
  font-weight: 700;
  font-size: 20px;
`;

const MovieInfoText = styled.span`
  margin-top: 10px;
  font-size: 15px;
  color: gray;
`;

const MouseHoverButton = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 75px;
`;
