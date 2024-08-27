import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';


import DetailImg from './MovieDetailVideoImage/DetailImg';
import poster from './images/poster.jpg'
import like from './images/like.svg'
import likes from './images/likes.svg'
import share from './images/share.svg'

import MoviePlay from './MoviePlay';

import MovieInformation from './MovieInformation'
import CharmingGraph from './CharmingGraph';
import MovieReview from './MovieReview';
// import MovieTab from './MovieTab.js'
import ChatBot from '../../components/ChatBot/ChatBot';
import { api } from '../../api/axios.js';
import MovieTrailer from './MovieTrailer.js';



//MovieDetail --------------------------
const MovieDetail = () => {


    //탭 폼-----------------
    const [currentTab, setTab] = useState(0);


    const selectMenuHandler = (index: any) => {
        setTab(index);
    };

    const [scrollPosition, setScrollPosition] = useState(0);
    const [toggleBtn, setToggleBtn] = useState(true);
    const params = useParams();



    //영화 상세페이지 내용-----------------
    const [movieDetail, setMovieDetail] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [totalFavorites, setTotalFavorites] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [memberInfo, setMemberInfo] = useState(null);
    const [memRole, setMemRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { movieId } = useParams();

    const menuArr = [
        { name: '상세정보', content: <MovieInformation /> },
        { name: '리뷰', content: (<MovieReview
            movieId={movieId}
            movieDetail={movieDetail}
            memRole={memberInfo?.role}
            correspondMemName={memberInfo?.memName}
            correspondMemNum={memberInfo?.memNum} 
            />) },
        { name: '예고편', content: (<MovieTrailer
                movieDetail={movieDetail}
                />) },
            // {name: '추천', content: ""},
        // {name: '추천', content: <MovieReview />},
    ];
    
    const handleScroll = () => {
        const { scrollY } = window;
        scrollY > 200 && setToggleBtn(!toggleBtn);
    };

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setToggleBtn(false);
    };

    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    // 에러 발생시 확인
    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error]);


    useEffect(() => {
        const fetchData = async () => {
            // 로그인 확인
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate('/login');
                return;
            }

            try {
                const memberInfo = await fetchMemberInfo(token);
                setMemberInfo(memberInfo);
                setMemRole(memberInfo.role);
                await fetchMovieDetail(token, movieId);
                // await fetchReviews(token, movieId);
                await checkFavoriteStatus(token);
                setIsLoading(false);
            } catch (error) {
                console.error("데이터 로딩 중 오류 발생:", error);
                if (error.response && error.response.status === 401) {
                    alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                } else {
                    setError("데이터를 불러오는데 실패했습니다.")
                }
                setIsLoading(false);
            }
        };
        fetchData();
    }, [movieId, navigate]);

    const fetchMemberInfo = async (token) => {
        try {
            const response = await api.get('/auth/memberinfo', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("memberInfo: ",memberInfo);
            return {
                role: response.data.memRole,
                memName: response.data.memName,
                memNum: response.data.memNum
            };
            
        } catch (error) {
            console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setError("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                    navigate('/login');
                } else {
                    setError(error.response.data || "사용자 정보를 가져오는데 실패했습니다.");
                }
            } else {
                setError("서버와의 연결에 실패했습니다.");
            }
            throw error;
        }
    };

    const fetchMovieDetail = useCallback(async (token) => {
        try {
            const response = await api.get(`/user/movies/detail/${movieId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMovieDetail(response.data);
            console.log("영화정보", response.data);
        } catch (error) {
            console.error('영화 상세 정보를 가져오는 중 오류 발생:', error);
            setMovieDetail(null);

            if (error.response) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    setError(errorData);
                } else if (errorData.errCode) {
                    switch (errorData.errCode) {
                        case "ERR_R_RATED_MOVIE":
                            alert("청소년 관람 불가 등급의 영화입니다.");
                            break;
                        case "ERR_UNAUTHORIZED":
                            alert("접근 권한이 없습니다.");
                            navigate('/login');
                            break;
                        case "ERR_MEMBER_NOT_FOUND":
                            alert("회원 정보를 찾을 수 없습니다.");
                            navigate('/login');
                            break;
                        case "ERR_MOVIE_NOT_FOUND":
                            alert("영화를 찾을 수 없습니다.");
                            break;
                        case "ERR_TOKEN_EXPIRED":
                            alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                            navigate('/login');
                            break;
                        default:
                            alert(errorData.message || "영화 정보를 불러오는 데 실패했습니다.");
                    }
                } else {
                    alert("영화 정보를 불러오는 데 실패했습니다.");
                }
            } else if (error.request) {
                setError("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
            } else {
                setError("요청 설정 중 오류가 발생했습니다.");
            }
        }
    }, [movieId, navigate, setError]);

    // 찜 정보 불러오기
    const checkFavoriteStatus = useCallback(async (token) => {
        try {
            const response = await api.get(`/user/movies/detail/${movieId}/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Favorite status response:", response.data);
            setIsFavorite(response.data.favorite);
            setTotalFavorites(response.data.favorCount);
        } catch (error) {
            console.error('찜 상태를 확인하는 중 오류 발생:', error);
            setIsFavorite(false);
            setTotalFavorites(0);
        }
    }, [movieId]);

    // 찜 버튼 기능 구현
    const toggleFavorite = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const newIsFavorite = !isFavorite;
            setIsFavorite(newIsFavorite);
            setTotalFavorites(prev => newIsFavorite ? prev + 1 : Math.max(prev - 1, 0));


            const response = newIsFavorite
            ? await api.post(`/user/movies/detail/${movieId}/favorites`,
                { movieId },
                { headers: { 'Authorization': `Bearer ${token}` }
            })
            : await api.delete(`/user/movies/detail/${movieId}/favorites`,
                { headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response && response.data) {
                setIsFavorite(response.data.isFavorite);
                setTotalFavorites(response.data.favorCount);
            }
            else {
                await api.post(`/user/movies/detail/${movieId}/favorites`, { movieId: movieId }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (response && response.data) {
                setIsFavorite(response.data.isFavorites);
                setTotalFavorites(response.data.favorCount)
            } else {
                setIsFavorite(!isFavorite);
            }

        // 찜 버튼 에러
        } catch (error) {
            console.error('찜하기 토글 중 오류 발생:', error);
            if (error.response && error.response.data) {
                alert(error.response.data.message || "찜하기 처리 중 오류가 발생했습니다.");
            } else {
                alert("찜하기 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
        }
    };

    const handleWatchMovie = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }
        try {
            const response = await api.get(`/user/movies/${movieId}/play`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate(`/user/MoviePlay/${movieId}`, {
                state: {
                    filmUrl: `/user/videos/${encodeURIComponent(response.data.movieFilm)}`,  // 수정된 부분
                    watchedTime: response.data.watchTime,
                    movieId: movieId
                }
            });
        } catch (error) {
            console.error('영화 재생 정보를 가져오는 중 오류 발생:', error);
            alert('영화 재생 정보를 가져오는데 실패했습니다.');
        }
    }

    if (error) {
        return (
            <div className="error-container">
                <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
            </div>
        );
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!movieDetail) {
        return <div>영화 정보를 불러오는 중 오류가 발생했습니다.</div>;
    }


    //html  ---------------------------------------------------
    return (
        <>
            {fetchMovieDetail && (<div>
                <Div posterUrls={movieDetail.posters && movieDetail.posters.length > 0 ? movieDetail.posters[0].posterUrls : ''}>
                    <WholeContainer >

                        <MovieBox>
                            <Box>

                                <RightBox>
                                    <MovieAndDetail>
                                        <AsidePoster>
                                            {/*제목*/}
                                            <MovieTitle>{movieDetail.movieTitle}</MovieTitle>
                                            {/* <EnglishTitle>JOKER</EnglishTitle> */}

                                            <BoxButton>
                                                {/*버튼*/}
                                                <BookingButton
                                                    onClick={handleWatchMovie}
                                                >
                                                    영화 보러가기
                                                </BookingButton>


                                                <SNS>
                                                    {/*찜*/}
                                                    <MovieLike>
                                                        <button
                                                            type="button"
                                                            className="MovieLike"
                                                            onClick={toggleFavorite}
                                                        >
                                                            {isFavorite ? '❤️' : '🤍'}
                                                        </button>
                                                        <span> ({totalFavorites})</span>
                                                    </MovieLike>


                                                    {/*공유*/}
                                                    <MovieLike>
                                                        <button
                                                            type="button"
                                                            className="MovieLike">
                                                            <img src={share} alt="공유" className="share"></img>
                                                            <span className="p-share">공유</span>
                                                        </button>
                                                    </MovieLike>
                                                </SNS>
                                            </BoxButton>


                                            {/*줄거리*/}
                                            <DesBox className="description">
                                                <div className="step-bar">
                                                    <span className="gradation-blue"></span>
                                                </div>

                                                {/* <Destitle>줄거리</Destitle> */}


                                                <br />

                                                <DesContent>
                                                    {/*줄거리-연습용*/}
                                                    <span className="Destitle_span">
                                                        {/* {movieDetail.movieDescription} */}
                                                    </span>

                                                    {/*줄거리-data*/}
                                                    {/*<span>{movieDetailDescription}</span>*/}
                                                </DesContent>

                                                {/*예고편/스틸컷-data**/}
                                                {/*<DetailImg stillCutList={stillCutList}/>*/}
                                            </DesBox>


                                            {/*포스터 제목-data/*/}
                                            {/*<MovieTitle>{movieData.movieName}</MovieTitle>*/}
                                            {/*<EnglishTitle>{movieData.movieNameInEnligh}</EnglishTitle>*/}
                                            {/*<DetailBox>*/}
                                            {/*    <ul className="DetailTitle">*/}
                                            {/*        {Detail_LIST.map(category => {*/}
                                            {/*            return (<DetailTitle key={category.id}>*/}
                                            {/*                {category.title}*/}
                                            {/*            </DetailTitle>);*/}
                                            {/*        })}*/}
                                            {/*    </ul>*/}

                                            {/*    <ul className="DetailContext">*/}
                                            {/*        <DetailContext>{director}토드 필립스</DetailContext>*/}
                                            {/*        <DetailContext>{movieActors?.join(' ')}호야킨 피닉스</DetailContext>*/}
                                            {/*        <DetailContext>{country}미국</DetailContext>*/}
                                            {/*        <DetailContext>{movieAgeRating} 15세 관람가</DetailContext>*/}
                                            {/*        <DetailContext>{movieRunningTime}2시간 1분</DetailContext>*/}
                                            {/*        <DetailContext>{movieGenre?.join(' ')}스릴러</DetailContext>*/}
                                            {/*        <DetailContext>{movieOpeningDate}2019년</DetailContext>*/}
                                            {/*    </ul>*/}
                                            {/*</DetailBox>*/}
                                        </AsidePoster>

                                        {/*포스터-연습용*/}
                                        {/* <MoviePoster src={poster} alt="포스터" /> */}
                                        <MoviePoster
                                            src={movieDetail.posters && movieDetail.posters.length > 0 ? movieDetail.posters[0].posterUrls : ''}
                                            alt={`${movieDetail.movieTitle} 포스터`}
                                            className="movie_bg"
                                        />

                                        {/*포스터-data/*/}
                                        {/*<MoviePoster src={movieData.movieThumbNailImg} alt="포스터" />*/}
                                    </MovieAndDetail>
                                </RightBox>
                            </Box>


                            {/*<CharmingGraph/>*/}
                            {/*<MovieReview/>*/}
                        </MovieBox>

                        <div className="logoplace" />
                    </WholeContainer>


                    <ButtonBox>
                        <ScrollBtn
                            right={scrollPosition > 100 ? '0px' : '-30px'}
                            width="136px"
                            scrollPosition={scrollPosition}
                            onClick={() => {
                                navigate(`/user/moviepage/:movieId`);
                            }}
                        >
                            영화 보러가기
                        </ScrollBtn>

                        <ScrollBtn
                            right={scrollPosition > 100 ? '-50px' : '-100px'}
                            width="50px"
                            scrollPosition={scrollPosition}
                            onClick={goToTop}
                        >
                            ↑
                        </ScrollBtn>
                    </ButtonBox>


                    {/*바디- 탭구현*/}
                    <Wrap>
                        <WrapBody>
                            <TabMenu>
                                {menuArr.map((tap, index) => {
                                    return (<div
                                        key={index}
                                        className={currentTab === index ? 'submenu focused' : 'submenu'}
                                        onClick={() => selectMenuHandler(index)}
                                    >
                                        {tap.name}
                                    </div>);
                                })}
                                <div>
                                    <div>{menuArr[currentTab].content}</div>
                                </div>
                            </TabMenu>
                        </WrapBody>
                        <ChatBot />
                    </Wrap>
                </Div>
            </div>)}
        </>
    );
};

export default MovieDetail;

// STYLE -----------------------

//1.전체박스-배경이미지
const Div = styled.div`
    width: 100%;
    display: block;
    margin: 0 auto;
    
    background-image: url(${props => props.posterUrls});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`;

//2.첫번째 전체박스 - 블러처리
const WholeContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    backdrop-filter: blur(80px) !important;
    background-color: rgba(0, 0, 0, 0.5);
`;


//3. 전체박스
const MovieBox = styled.div`
  width: 1200px;
    height: 600px;
    
  `;

//4.전체박스
const Box = styled.div`
    width: 1200px;

`;

//5.오른쪽 감싸는 박스
const RightBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
//5-2.오른쪽 전체 감싸는 박스
const MovieAndDetail = styled.div`
  width: 100%;
 
`;


//6.왼쪽 감싸는 박스
const LeftBox = styled.div`
    width: 100%;
    float: left;
`;
//6-2.왼쪽 전체감싸는 박스
const AsidePoster = styled.div`
    width: 600px;
    float: left;
    //margin-left: 60px;
    padding-top: 80px;
`;


//보러가기 아래 버튼
const ButtonBox = styled.div`
    right: 40%;
    margin-right: -548px;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    bottom: 80px;
    min-height: 50px;
    text-align: center;
    z-index: 999;
`;


//보러가기 아래 버튼
const ScrollBtn = styled.button`
    opacity: 1;
    pointer-events: auto;
    position: absolute;
    left: auto;
    right: ${props => props.right};
    opacity: ${props => (props.scrollPosition > 100 ? '1' : '0')};
    width: ${props => props.width};
    padding: 12px 0 14px;
    font-weight: 500;
    font-size: 16px;
    color: #fff;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 30%);
    //border-radius: 25px;
    transition: right 0.5s;
    cursor: pointer;
    //border: 1px solid white;
    background-color: #1351f9;
    z-index: 999;


    &:disabled {
        cursor: default;
    }
`;




//줄거리 전체 박스
const DesBox = styled.div`
    float: left;
    width: 580px;
    margin-top: 80px;
    margin-left: 10px;
    margin-right: 10px;
    
    
    .step-bar {
        width: 580px;
        height: 5px;
        //background: rgba(72, 65, 58, 0.2);
        background: rgba(255, 255, 255, 0.1);
        margin-bottom: 20px;
        //position: absolute;
        //top: 0;
        //left: 0;
    }

    .gradation-blue {
        width: 15%;
        height: 5px;
        display: block;
        text-indent: -9999px;
        background-color: #1351f9;
    }
`;



//줄거리-제목 스타일
const Destitle = styled.span`
    font-weight: 500;
    font-size: 20px;
    color: #fff;
    margin-top: 40px;
    margin-left: 10px;
`;


//줄거리 내용
const DesContent = styled.div`
    font-size: 16px;
    color: #817f7f;
    margin-top: 20px;
    line-height: 22px;
    margin-left: 10px;
`;

//버튼 전체 박스(BoxButton)

const BoxButton = styled.div`
    display: flex;
    justify-content: left;
    margin-top: 20px;
`;

//버튼- 영화 보러가기
const BookingButton = styled.button`
    background-color: #1351f9;
    color: #fff;
    box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 12px;
    width: 343px;
    height: 58px;
    margin-top: 10px;
    margin-right: 20px;


    &:hover {
        color: #000;
        background-color: #fff;
    }
`;


//포스터 - 오른쪽
const DetailTitle = styled.li`
    margin-bottom: 30px;
    padding-left: 6px;
    color: #fff;
    opacity: 0.64;
    font-size: 18px;

`;

//내용
const DetailContext = styled.li`
    margin-bottom: 30px;
    font-size: 18px;
    font-weight: 300;
    padding-top: 2px;
    text-overflow: hidden;
    color: #fff;
    font-size: 18px;
    margin-left: 30px;
    line-height: 1.4;

`;

const DetailBox = styled.div`
    display: flex;
    justify-content: left;

    .DetailTitle {
        margin-top: 30px;
    }

    .DetailContext {
        margin-top: 30px;
    }
`;


//한글 제목
const MovieTitle = styled.h1`
    color: #fff;
    font-size: 52px;
    font-weight: 600;
    //padding: 30px 0px;
    //border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    //padding-bottom: 20px;
    padding-top: 30px;
    text-align: left;
`;
//영문 제목
const EnglishTitle = styled.p`
    color: #fff;
    font-size: 24px;
    line-height: 24px;
    font-weight: 300;
    padding-bottom: 20px;
    padding-top: 10px;
    text-align: left;
    //border-bottom: 1px solid rgba(255, 255, 255, 0.18);
`;

//찜+공유 감싸는 박스
const SNS = styled.div`
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;


`;

//찜 전체박스
const MovieLike = styled.button`
    transition: opacity 0.1s;
    cursor: pointer;
    margin-right: 20px;
    display: flex;
    align-items: center;


    //스타일
    //background-color: #1351f9;
    //background-color: #fff;
    border: 1px solid #fff;
    border-radius: 4px;
    width: 120px;
    height: 48px;


    &:hover {
        background-color: #1351f9;
        border: 1px solid #1351f9;
    }


    //찜=글씨+이미지 박스

    .MovieLike {
        position: relative;
        margin-top: 10px;
        display: flex;
        align-items: center;
        margin-left: 15px;


    }

    //이미지(하트)

    .like {
        width: 32px;
        margin-bottom: 10px;
        justify-content: right;

        &:hover {

        }

    }

    //글씨(찜)

    .p-like {
        position: relative;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: rgb(255, 255, 255);
        margin-left: 25px;
        margin-bottom: 10px;
        justify-content: right;

    }

    //이미지(공유)

    .share {
        position: relative;
        width: 32px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
    }

    //글씨(공유)

    .p-share {
        position: relative;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: rgb(255, 255, 255);
        margin-left: 25px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
    }

    &:hover {

    }
`;


//포스터 - 이미지
const MoviePoster = styled.img`
    float: right;
    border-radius: 5px;
    width: 343px;
    height: 494px;
    margin-top: 50px;
    margin-left: 80px;
`;


//데이터-연습용
const Detail_LIST = [{ id: 1, title: '감독' }, { id: 2, title: '출연' }, { id: 3, title: '국가' }, { id: 4, title: '등급' }, {
    id: 5, title: '상영시간'
}, { id: 6, title: '장르' }, { id: 7, title: '개봉일' },];




//탭 이하 전체 박스
const Wrap = styled.div`
    width: 100%;
    margin: 0 auto;
    background-color: #000;
`;

//탭 전체 박스
const WrapBody = styled.div`
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: left;
`;

//탭메뉴
const TabMenu = styled.ul`
    width: 1200px;
    
//background-color: red;
float: left;
list-style: none;
margin-bottom: 20px;
margin-top: 10px;
align-items: center;
color: #000;
font-weight: 300;
text-align: center;
font-size: 16px;
    
    
    .focused{
        color: #fff !important;
        border-bottom: 3px solid #1351f9 !important;
       
    }

.submenu {
    margin: 0 auto;
    padding: 10px;
    transition: 0.5s;
    //border: 1px solid rgba(255, 255, 255, 0.2);
    //border-bottom: 1px solid rgb(46, 46, 46);
    
  
    border-bottom: 1px solid #2f2f2f;
    
    outline: none;
    cursor: pointer;
    color: #a6a6a6;
    font-weight: 300;
    text-align: center;
    float: left;
    //padding: 40px;
    padding: 2.5rem 2.5rem;
    height: 20px;


    &:hover{
        color: #fff !important;
        border-bottom: 5px solid #1351f9 !important;
    }
    
    &:focus{
        outline: none;
        cursor: pointer;
        color: #fff !important;
        border-bottom: 5px solid #1351f9 !important;
        font-weight: 300;
        text-align: center;
        transition: 0.5s;
    }
}
`;
