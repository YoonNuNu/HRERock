import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from "axios";

//SwiperCard
function SwiperCards({ movie }) {
    const [isMouseHover, setIsMouseHover] = useState(false);
    const {
        id,
        movieName,
        mainPosterUrl,
        posterUrl,
        movieDescription,
        progressPercentage
    } = movie;
    const poster = mainPosterUrl || (posterUrl && posterUrl.length > 0 ? posterUrl[0].posterUrls : '/path/to/default/image.jpg'); //default 이미지 만들기
    const navigate = useNavigate();

    const updateWatchingProgress = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post('/user/movies/history/update-progress', {
                movie: { movieId: movie.id },
                watchId: movie.watchId,
                watchTime: movie.watchTime,
                totalDuration: movie.totalDuration
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };


    const onMouseOverMovie = () => {
        setIsMouseHover(true);
    };

    const onMouseOutMovie = () => {
        setIsMouseHover(false);
    };

    // // 저장된 진행 상태 가져오기
    // const storedProgress = JSON.parse(localStorage.getItem(`movie_${movieid}_progress`));
    // const progressPercentage = storedProgress
    //     ? storedProgress.progressPercentage * 100
    //     : 0;
    // const watchTime = storedProgress ? storedProgress.watchTime : 0;

    return (
        <SwiperCardContainer
            onMouseOver={onMouseOverMovie}
            onMouseOut={onMouseOutMovie}
        >
            <Overlay isMouseHover={isMouseHover}>
                <OverlayText>{movieDescription}</OverlayText>
                <MouseHoverButton>
                    <OverlayBtn
                        onClick={() => {
                            updateWatchingProgress();
                            navigate(`/user/moviePlay/${movie.id}`);
                        }}
                    >
                        이어보기
                    </OverlayBtn>
                </MouseHoverButton>
            </Overlay>

            <PosterImg src={poster} alt={movieName}>
                <div className="progress_bar">
                    <div
                        className="progress"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </PosterImg>

        </SwiperCardContainer>
    );
}

export default SwiperCards;


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
`;

const Overlay = styled.div`
    display: ${props => (props.isMouseHover ? 'block' : 'none')};
  position: absolute;
  width: 300px;
  height: 450px;
  //border-radius: 8px;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(20px);
  animation: ${fadeIn} 0.1s ease-out;
  z-index: 100;
`;

// 2단, 호버시, 보이는 내용
const OverlayText = styled.p`
  width: 150px;
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
  margin-top: 90px;
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

const PosterImg = styled.div`
    position: relative;
    width: 300px !important;
    height: 450px;
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    border-radius: 5px;

    .progress_bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.3);
    }

    .progress {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background-color: #e50914;
        transition: width 0.3s ease-in-out;
    }
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

