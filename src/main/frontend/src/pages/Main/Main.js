import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

//Swiper Component (메인)
import Ranking from "./component/Ranking";
import Recent from "./component/Recent"
import Videos from "./component/Videos";
import Watched from "./component/Watched";
import Watching from "./component/Watching"

//img
import searchimg from "../MovieDetail/images/searchimg.png";
import bullet from "../SearchKeyword/images/bullet.svg";


//챗봇
import ChatBot from "../../components/ChatBot/ChatBot";

function Main() {
    const initializedRef = useRef(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;

            // 해시(#) 부분에서 토큰과 로그인 방법 추출
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const token = hashParams.get('token');
            const loginMethod = hashParams.get('loginMethod');

            if (token && loginMethod) {
                localStorage.setItem('accessToken', token);
                localStorage.setItem('loginMethod', loginMethod);
                window.history.replaceState({}, document.title, "/"); // URL 클리어
            }

            fetchMemberInfo(); // 토큰을 저장한 후에 회원 정보를 가져옴
        }
    }, []);

    const fetchMemberInfo = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                navigate('/login');
                return;
            }

            const response = await fetch('/auth/memberinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMemberInfo(data);
            } else {
                throw new Error('Failed to fetch user info');
            }
        } catch (error) {
            setError('사용자 정보를 불러오는데 실패했습니다.');
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMovieClick = async (movieId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("접근권한이 없습니다.");
            navigate('/login');
        } else {
            try {
                await axios.get(`/movie/${movieId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                navigate(`/user/MoviePage/${movieId}`);
            } catch (error) {
                if (error.response) {
                    switch (error.response.data.errCode) {
                        case "ERR_UNAUTHORIZED":
                            alert("접근 권한이 없습니다.");
                            navigate('/login');
                            break;

                        case "ERR_R_RATED_MOVIE":
                            alert("청소년 관람 불가 등급의 영화입니다.");
                            break;

                        case "ERR_MOVIE_NOT_FOUND":
                            alert("영화를 찾을 수 없습니다.");
                            break;

                        default:
                            alert("영화 정보를 불러오는 데 실패했습니다.");
                    }
                } else {
                    alert("서버와의 연결에 실패했습니다.");
                }
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <MainContainer>
            {/*<ChatBot />*/}

            {/*01-1.메인배너 - 동영상*/}
            <Videos />

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
                                    navigate(`/user/mypage/`);
                                }}
                            >
                                <img className="bullet" src={bullet}></img>
                                <a className="button">전체보기</a>
                            </button>
                        </SectionR>
                    </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainer>
                        <Watching />
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
                                    navigate(`/user/mypage/`);
                                }}
                            >
                                <img className="bullet" src={bullet}></img>
                                <a className="button">전체보기</a>
                            </button>
                        </SectionR>
                    </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainer>
                        <Watched />
                    </SectionContainer>
                </SectionANav>


                {/*04. 실시간인기영화 */}
                <SectionANav>
                    <SectionTop>
                        <SectionTitle>TOP 10 인기 영화 </SectionTitle>
                        {/*전체 보기 버튼*/}
                        {/*<SectionR>*/}
                        {/*    <button*/}
                        {/*        className="button"*/}
                        {/*        type="button"*/}
                        {/*        onClick={() => {*/}
                        {/*            navigate(`/user/MoviePage/${movieId}`);*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <img className="bullet" src={bullet}></img>*/}
                        {/*        <a className="button">전체보기</a>*/}
                        {/*    </button>*/}
                        {/*</SectionR>*/}

                    </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainer>
                        <Ranking />
                    </SectionContainer>
                </SectionANav>




                {/*05. 최근업데이트콘텐츠: 스와이퍼*/}
                <SectionANav>
                    <SectionTop>
                        <SectionTitle>최근 업데이트 콘텐츠</SectionTitle>
                        {/*전체 보기 버튼*/}
                        {/*<SectionR>*/}
                        {/*    <button*/}
                        {/*        className="button"*/}
                        {/*        type="button"*/}
                        {/*        onClick={() => {*/}
                        {/*            navigate(`/`);*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <img className="bullet" src={bullet}></img>*/}
                        {/*        <a className="button">전체보기</a>*/}
                        {/*    </button>*/}
                        {/*</SectionR>*/}
                    </SectionTop>
                    {/*컨텐츠*/}
                    <SectionContainers>
                        <Recent />
                    </SectionContainers>
                </SectionANav>



            </Article>
            <ChatBot />
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


