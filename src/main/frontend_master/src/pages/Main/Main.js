import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import VideoSwiper from './VideoSwiper/VideoSwiper';
import MainTop10 from './MainTop10';

//Swiper
import Swiper from './Swiper/Swiper';
import Swiper2 from './Swiper/Swiper2';
import Swiper3 from './Swiper/Swiper3';
import Swiper4 from './Swiper/Swiper4';


//img
import searchimg from "../MovieDetail/images/searchimg.png";
import bullet from "../SearchKeyword/images/bullet.svg";

//챗봇
// import ChatBot from "../../components/ChatBot/ChatBot";



function Main() {
    const navigate = useNavigate();

    return (
        <MainContainer>
            {/*<ChatBot />*/}

            {/*01-1.메인배너 - 동영상*/}
            <VideoSwiper />

            {/*01-2.컨텐츠 전체 박스*/}
            <Article>
                {/*02.이어보기: 스와이퍼 */}
                <SectionANav>
                    <SectionTop>
                        <SectionTitle>회원님의 콘텐츠 이어보기</SectionTitle>
                        {/*전체 보기 버튼*/}
                        <SectionR>
                            <button
                                className="button"
                                type="button"
                                onClick={() => {
                                    navigate(`/`);
                                }}
                            >
                                <img className="bullet" src={bullet}></img>
                                <a className="button">전체보기</a>
                            </button>
                        </SectionR>
                    </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainer>
                        <Swiper />
                    </SectionContainer>
                </SectionANav>



                {/*03. 최근시청: 스와이퍼*/}
                <SectionANav>
                    <SectionTop>
                        <SectionTitle>회원님이 시청하는 콘텐츠</SectionTitle>
                        {/*전체 보기 버튼*/}
                        <SectionR>
                            <button
                                className="button"
                                type="button"
                                onClick={() => {
                                    navigate(`/`);
                                }}
                            >
                                <img className="bullet" src={bullet}></img>
                                <a className="button">전체보기</a>
                            </button>
                        </SectionR>
                    </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainer>
                        <Swiper2 />
                    </SectionContainer>
                </SectionANav>



                {/*04. 실시간인기영화 */}
            <SectionANav>
                <SectionTop>
                    <SectionTitle>TOP 10 인기 영화 </SectionTitle>
                    {/*전체 보기 버튼*/}
                    <SectionR>
                        <button
                            className="button"
                            type="button"
                            onClick={() => {
                                navigate(`/`);
                            }}
                        >
                            <img className="bullet" src={bullet}></img>
                            <a className="button">전체보기</a>
                        </button>
                    </SectionR>

                </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainer>

                        {/*<Swiper3 />*/}
                        <MainTop10 />
                    </SectionContainer>
            </SectionANav>




                {/*05. 최근업데이트콘텐츠: 스와이퍼*/}
                <SectionANav>
                    <SectionTop>
                        <SectionTitle>최근 업데이트 콘텐츠</SectionTitle>
                        {/*전체 보기 버튼*/}
                        <SectionR>
                            <button
                                className="button"
                                type="button"
                                onClick={() => {
                                    navigate(`/`);
                                }}
                            >
                                <img className="bullet" src={bullet}></img>
                                <a className="button">전체보기</a>
                            </button>
                        </SectionR>
                    </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainers>
                        <Swiper4 />
                    </SectionContainers>
                </SectionANav>



            </Article>
        </MainContainer>
    );
}


const SectionR = styled.div`
    float: right;

    .button {
        font-size: 16px;
        line-height: 24px;
        color: #a5a5a5;
        padding: 5px 5px 5px 0;
        margin-bottom: 10px;
    }

    .bullet {
        width: 20px;
        margin: 4px 10px;
    }

    &:hover {
        font-weight: 600;
        color: #fff;
    }
`;

// 컨테이너 전체박스
const Article = styled.div`
    width: 80%;
    margin-right: auto;
    margin-left: 20px;
`;

// 타이틀
const SectionTop = styled.div`
    display: flex;
    justify-content: space-between;
    width: 1780px;
    margin: 0 auto;
    margin-bottom: 20px;
`;
const SectionTitle = styled.div`
    font-size: 22px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
    float: left;
    margin-left: 30px;
`;

//포스터 감싸는 전체 박스
const SectionContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-bottom: 30px;
    margin: 0 auto;
`;

const SectionContainers = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-bottom: 30px;
    margin: 0 auto;
`;



//실시간 인기 순위
const SectionRanking = styled.div`
    width: 1780px;
    margin: 0 auto;
    font-family: 'SUIT-Regular';
    font-size: 20px;
    line-height: 36px;
    color: #fff;
    font-weight: 400;
    text-align: left;
    margin-bottom: 40px;
    z-index: 1;
`;
//실시간 인기 순위 컨테이너
const SectionRankingContainer = styled.div`
  
    overflow: visible;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: -webkit-flex;
    display: flex;
    transition-property: -webkit-transform;
    transition-property: transform;
    transition-property: transform, -webkit-transform;
    box-sizing: content-box;
`;



//(공통) 메인 문구- 부모 박스
const SectionANav = styled.div`
    width: 1780px;
    margin: 0 auto;
    
    font-family: 'SUIT-Regular';
    font-size: 20px;
    line-height: 36px;
    color: #fff;
    font-weight: 400;
    text-align: left;
    margin-bottom: 40px;
    z-index: 1;
`;




const MainContainer = styled.div`
    width: 100%;
    //background-color: rgb(11, 11, 13) !important;

`;

// 2단 배너 + 문구 사이
const SectionA = styled.div`
  width: 80%;
    margin-left: 20px;
    margin-right: 20px;
  
  display: flex;
    //flex-flow:wrap;
  flex-direction: column;
  justify-content: left;
  align-items: center;
    margin-top: 2rem;
    
    //margin-left: 15rem;
`;

// const SectionTop = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   width: 100%;
//   height: 80px;
//   margin-left: 100px;
//   margin-top: 20px;
// `;

const SectionTopTitleColored = styled.h3`
  color: #fff;
  font-weight: 700;
  font-size: 25px;
`;

const SectionTopTitle = styled.h3`
  margin-left: 15px;
  font-weight: 400;
  color: gray;
  font-size: 25px;
`;

const SectionTopMore = styled.button`
  position: absolute;
  right: 200px;
  color: #fff;
  padding: 8px 15px;
  border: 2px solid #fff;
  border-radius: 30px;
  background: transparent;
  font-weight: 700;
  font-size: 15px;
  transition: 0.3s;

  &:hover {
    color: white;
    background: #fff;
    transition: 0.3s;
  }
`;

export default Main;


