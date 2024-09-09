import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import movieDetail from "../../MovieDetail";




//SwiperCard
function SwiperRecommend({ movie }) {
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
            onMouseEnter={() => setIsMouseHover(true)}
            onMouseLeave={() => setIsMouseHover(false)}
        >
            {/*<Overlay $isMouseHover={isMouseHover}>*/}
            {/*    <OverlayText>{movieDescription}</OverlayText>*/}

            {/*    /!*마우스 호버 시 *!/*/}
            {/*    <MouseHoverButton>*/}

            {/*        <OverlayBtn*/}
            {/*            onClick={() => {*/}
            {/*                navigate(`/user/moviePage/${movie.id}`);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            보러가기*/}
            {/*        </OverlayBtn>*/}


            {/*    </MouseHoverButton>*/}
            {/*</Overlay>*/}
            {/*<Overlay $isMouseHover={isMouseHover}>*/}
            {/*    <OverlayText>{movieDescription}</OverlayText>*/}
            {/*    <OverlayBtn onClick={() => navigate(`/user/moviePage/${movie.id}`)}>*/}
            {/*        보러가기*/}
            {/*    </OverlayBtn>*/}
            {/*</Overlay>*/}
            {/*<PosterImg src={poster} alt={movieName} />*/}

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

        </SwiperCardContainer>
    );
}
export default SwiperRecommend;

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
    width: 240px;
    height: 360px;
`;


// 호버시
const Overlay = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
    display: ${props => (props.isMouseHover ? 'block' : 'none')};
    position: absolute;
    width: 240px !important;
    height: 360px !important;
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(20px);
    animation: ${fadeIn} 0.1s ease-out;
    z-index: 100;
`;

// 2단, 호버시, 보이는 내용
const OverlayText = styled.p`
  width: 200px;
  height: 150px;
  overflow: hidden;  
  margin: 0 auto;
  margin-top: 60px;
  font-weight: 400;
  text-align: center;
  color: white;
  font-size: 12px;
  line-height: 25px;
`;

const OverlayBtn = styled.button`
  width: 120px;
  height: 45px;
  border-radius: 5px;
  margin-bottom: 60px;
  background: #1351f9;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
    margin-top: 40px;

  &:hover {
    background-color: rgb(11, 11, 13,1);
    color: #fff;
    border: 2px solid #fff;
  }
`;

const PosterImg = styled.img`
    width: 240px !important;
    height: 360px !important;
    border-radius: 5px;
    object-fit: cover;
    //border-radius: 5px;
`;


const MouseHoverButton = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 55px;
`;
