import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import poster from './images/poster.jpg'

import Actor from './images/Actor.jpg'
import Director from './images/Director.jpg'
import { useCallback } from 'react';
import { api } from '../../api/axios';

// import authorship1 from './images/authorship1.jpg'
// import authorship2 from './images/authorship2.jpg'
// import authorship3 from './images/authorship3.jpg'


//영화,상세정보 탭
const MovieInformation = () => {
    // useState 설정
    const [movieDetail, setMovieDetail] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [totalFavorites, setTotalFavorites] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [memberInfo, setMemberInfo] = useState(null);
    const [memRole, setMemRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { movieId } = useParams();

    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error]);

    // 로그인 정보 확인 후 작업
    useEffect(() => {
        const fetchData = async () => {
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

    // 로그인 정보 
    const fetchMemberInfo = async (token) => {
        try {
            const response = await api.get('/auth/memberinfo', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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

    // 영화 상세 정보
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

        <Div>
            {fetchMovieDetail && (<div>
                <WholeContainer>
                    <div className="logoplace" />

                    <ArrayContent>
                        <ThumbBox>
                            {/*포스터-연습용*/}
                            <MoviePoster
                            // src={movieDetail.posters && movieDetail.posters.length > 0 ? movieDetail.posters[0].posterUrls : ''}
                            // alt={`${movieDetail.movieTitle} 포스터`}
                            />

                            {/*포스터-data/*/}
                            {/*<MoviePoster src={movieData.movieThumbNailImg} alt="포스터" />*/}
                        </ThumbBox>


                        {/*2.줄거리*/}
                        <DesBox className="description">

                            <Destitle>줄거리</Destitle>
                            <DesContent>
                                {movieDetail.movieDescription || '줄거리를 불러올 수 없습니다'}
                            </DesContent>
                        </DesBox>
                    </ArrayContent>
                    {/*1.썸네일*/}



                    <ArrayContent className='colum'>
                        <Txt><a className="txt">감독</a></Txt>
                        <DirectorBox>
                            <ul>
                                {movieDetail.directors?.map(director => (
                                    <>
                                        <li key={director.directorId}>
                                            {director.directorPhoto && director.directorPhoto.length > 0 && (
                                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${director.directorName}`} target="_blank" >

                                                    <DirectorPoster
                                                        src={director.directorPhoto[0].photoUrl}
                                                        alt={`${director.directorName} 사진`}
                                                        className="directorImg"
                                                    />
                                                </Link>
                                            )}
                                        </li>
                                        <li key={director.directorId}>
                                            {director.directorName}
                                        </li>
                                    </>

                                ))}
                            </ul>
                        </DirectorBox>
                    </ArrayContent>
                    {/*3.감독*/}


                    <ArrayContent className='colum'>
                        <Txt><a className="txt">출연</a></Txt>
                        <ActorBox>
                            {/*포스터-연습용*/}

                            {/*포스터-data/*/}
                            {/*<MoviePoster src={movieData.movieThumbNailImg} alt="포스터" />*/}
                            <PhotoArray>
                                {movieDetail.actors?.map(actor => (

                                    <li key={actor.actorId}>
                                        <div>
                                            {actor.actorPhoto && actor.actorPhoto.length > 0 && (
                                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${actor.actorName}`} target="_blank" >

                                                    <ActorPoster
                                                        src={actor.actorPhoto[0].photoUrl}
                                                        alt={`${actor.actorName} 사진`}
                                                        className="actorImg"
                                                    />
                                                </Link>
                                            )}

                                            {actor.actorName}
                                        </div>
                                    </li>



                                ))}
                            </PhotoArray>
                        </ActorBox>
                    </ArrayContent>


                    <ArrayContent className='colum'>
                        <Txt><a className="txt">영화 정보</a></Txt>

                        <DetailBox>
                            <ul className="DetailTitle">
                                {Detail_LIST.map(category => {
                                    return (<DetailTitle key={category.id}>
                                        {category.title}
                                    </DetailTitle>);
                                })}
                            </ul>

                            <ul className="DetailContext" key="index">

                                {/* 배우 */}
                                <MovieDetailBoxUl>
                                    {movieDetail.directors?.map(director => (
                                        <DetailContext key={director.directorId}>
                                            {director.directorName}
                                        </DetailContext>

                                    ))}
                                </MovieDetailBoxUl>

                                {/* 배우 */}
                                <MovieDetailBoxUl>
                                    {movieDetail.actors?.map(actor => (
                                        <DetailContext key={actor.actorId}>
                                            {actor.actorName}
                                        </DetailContext>

                                    ))}
                                </MovieDetailBoxUl>
                                {/* 장르 */}
                                <DetailContext>{movieDetail.genres?.map(genre => genre.genreName).join(', ') || "정보 없음"}</DetailContext>
                                {/* 등급 */}
                                <DetailContext>{movieDetail.movieRating || "정보 없음"}</DetailContext>
                                {/* 상영 시간 */}
                                <DetailContext>{movieDetail.runTime || "정보 없음"}분</DetailContext>
                                {/* 개봉일 */}
                                <DetailContext>{movieDetail.openYear || "정보 없음"}</DetailContext>
                            </ul>


                        </DetailBox>

                    </ArrayContent>

                </WholeContainer>
            </div>)}
        </Div>);
};
export default MovieInformation;


// STYLE -----------------------
const ArrayContent = styled.div`
    display: flex;
    margin-bottom: 30px;

    &.colum{
        flex-direction: column;
    }
`


//1.전체박스
const Div = styled.div`
    width: 100%;
    margin: 80px auto;
    margin-top: 120px;
    
`;

//2.첫번째 전체박스
const WholeContainer = styled.div`
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    color: #a5a5a5;
    margin: 0 auto;
`;

const ThumbBox = styled.div`
    flex: none;
    position: relative;
    overflow: hidden;
    // width: 185px;
    height: 278px;
    border-radius: 12px;
`;
//포스터 - 이미지
const MoviePoster = styled.img`
    // width: 185px;
    height: 278px;
`;

//감독- 전체 박스
const DirectorBox = styled.div`
    width: 785px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
   

    //디자인
    // margin-bottom: 30px;
    margin-left: 10px;
    display: flex;
    justify-content: left;
    
`;

//배우-이미지 박스
const ActorBox = styled.div`
    width: 785px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    //디자인
    margin-bottom: 30px;
    margin-left: 10px;
    display: flex;
    justify-content: left;
`;

// 사진 정렬 ul
const PhotoArray = styled.ul`
    display: flex;
    flex-wrap: wrap'

    `

//텍스트
const Txt = styled.div`
    //background-color: #1b1b1b;
    //border-radius: 12px;
    border-bottom: 1px solid rgb(33, 33, 33);
    width: 785px;
    height: 50px;
    padding: 10px 0;
    text-align: left;
    margin-top: 40px;
    
    .txt{
        margin-bottom: 10px;
        color: #fff;
        margin-left: 20px;
        font-size: 16px;
        display: flex;
       align-items: center;
    }
`;

//감독 포스터(이미지)
const DirectorPoster = styled.img`

    float: left;
    width: 200px;
    border-radius: 12px;
    margin-right: 20px;

`;
//배우 포스터(이미지)
const ActorPoster = styled.img`
    // float: left;
    // display: flex;
    width: 200px;
    border-radius: 12px;
    margin-right: 20px;
`;

// 영화 상세 설명
const DetailBox = styled.div`
    
    width: 785px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;

    

    .DetailTitle {
        // border: 1px solid red;
    }

    .DetailContext {


    }
`;

// 감독 출연진 정렬 박스
const MovieDetailBoxUl = styled.ul`
    display: flex;
    // border: 1px solid white;
    // width: 700px;
`



//줄거리 전체 박스
const DesBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 680px;
    height: 200px;
    margin-left: 20px;
    line-height: 30px;
`;

//줄거리-제목 스타일
const Destitle = styled.span`
    font-weight: 500;
    font-size: 20px;
    text-align: left;
    color: #fff;
    margin-top: 20px;
    margin-left: 10px;
    //border-bottom: 1px solid #fff;
`;


//줄거리 내용
const DesContent = styled.div`
    text-align: left;
    font-size: 16px;
    color: #817f7f;
    margin-left: 10px;
    margin-top: 20px;
    
    //줄거리 내용
    .Destitle_span{
        margin-top: 20px;
    }
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
    margin-bottom: 20px;
    padding-left: 6px;
    color: #fff;
    opacity: 0.64;
    font-size: 18px;
    text-align: left;
    text-indent: 15px;
`;

//내용
const DetailContext = styled.li`
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 300;
    padding-top: 2px;
    text-overflow: hidden;
    color: #fff;
    font-size: 18px;
    margin-left: 30px;
    line-height: 1.4;
    text-align: left;
    
`;

//데이터-연습용
const Detail_LIST = [
    { id: 1, title: '감독' },
    { id: 2, title: '출연' },
    { id: 3, title: '장르' },
    { id: 4, title: '등급' },
    { id: 5, title: '상영시간' },
    { id: 6, title: '개봉일' }
];




