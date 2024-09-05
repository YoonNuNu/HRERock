import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { useCallback } from 'react';
import axios from 'axios';



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



    // 영화 상세 정보
    const fetchMovieDetail = useCallback(async (token) => {
        try {
            const response = await axios.get(`/user/movies/detail/${movieId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMovieDetail(response.data);
            console.log("영화정보", response.data);
        }
        catch (error) {
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
                        case "ERR_MOVIE_NOT_FOUND":
                            alert("영화를 찾을 수 없습니다.");
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
        finally{
            setIsLoading(false)
        }
    }, [movieId, navigate, setError]);

    useEffect(() =>{
        const token = localStorage.getItem('accessToken');

        fetchMovieDetail(token)
    }, [movieId]);

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


                    {/*1.썸네일*/}



                    <ArrayContent className='colum'>
                        <Txt><a className="txt">감독</a></Txt>
                        <DirectorBox>
                            <DirectorBoxUL>
                                {movieDetail.directors?.map(director => (
                                    <>
                                        <li key={director.directorId}>
                                            {director.directorPhoto && director.directorPhoto.length > 0 ? (
                                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${director.directorName}`} target="_blank" >

                                                    <DirectorPoster
                                                        src={director.directorPhoto[0].photoUrl}
                                                        alt={`${director.directorName} 사진`}
                                                        className="directorImg"
                                                    />
                                                </Link>
                                            ) : (
                                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${director.directorName}`} target="_blank" >
                                                    <DirectorPoster
                                                        src="https://via.placeholder.com/200x300?text=No+Image"  // 디폴트 이미지 경로
                                                        alt="디폴트 사진"
                                                        className="actorImg"
                                                    />
                                                </Link>
                                            )}
                                            {director.directorName}

                                        </li>

                                    </>

                                ))}
                            </DirectorBoxUL>
                        </DirectorBox>
                    </ArrayContent>
                    {/*3.감독*/}


                    <ArrayContent className='colum'>
                        <Txt><a className="txt">출연</a></Txt>
                        <ActorBox>
                            {/*포스터-연습용*/}

                            <PhotoArray>
                                {movieDetail.actors?.map(actor => (

                                    <li key={actor.actorId}>
                                        <PhotoArrayDiv>
                                            {actor.actorPhoto && actor.actorPhoto.length > 0 ? (
                                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${actor.actorName}`} target="_blank">
                                                    <ActorPoster
                                                        src={actor.actorPhoto[0].photoUrl}  // 배우 사진이 있을 때 사용
                                                        alt={`${actor.actorName} 사진`}
                                                        className="actorImg"
                                                    />
                                                </Link>
                                            ) : (
                                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${actor.actorName}`} target="_blank">
                                                    <ActorPoster
                                                        src="https://via.placeholder.com/200x300?text=No+Image"  // 디폴트 이미지 경로
                                                        alt="디폴트 사진"
                                                        className="actorImg"
                                                    />
                                                </Link>
                                            )}


                                            {actor.actorName}
                                        </PhotoArrayDiv>
                                    </li>



                                ))}
                            </PhotoArray>
                        </ActorBox>
                    </ArrayContent>


                    <ArrayContent className='colum'>
                        <Txt><a className="txt">영화 정보</a></Txt>


                        <DetailBox>
                            <ul className="DetailList">
                                {Detail_LIST.map((category, index) => (
                                    <li key={category.id} className="DetailItem">
                                        <DetailTitle>
                                            {category.title}
                                        </DetailTitle>
                                        <DetailContext>
                                            {index === 0 && movieDetail.directors?.map((director, idx) => (
                                                <React.Fragment key={director.directorId}>
                                                    {director.directorName}
                                                    {idx < movieDetail.directors.length - 1 && ', '}
                                                </React.Fragment>
                                            ))}
                                            {index === 1 && movieDetail.actors?.map((actor, idx) => (
                                                <React.Fragment key={actor.actorId}>
                                                    {actor.actorName}
                                                    {idx < movieDetail.actors.length - 1 && ', '}
                                                </React.Fragment>
                                            ))}
                                            {index === 2 && (movieDetail.genres?.map((genre, idx) => (
                                                <React.Fragment key={genre.genreId}>
                                                    {genre.genreName}
                                                    {idx < movieDetail.genres.length - 1 && ', '}
                                                </React.Fragment>
                                            )) || "정보 없음")}
                                            {index === 3 && (movieDetail.movieRating || "정보 없음")}
                                            {index === 4 && (movieDetail.runTime || "정보 없음") + '분'}
                                            {index === 5 && (movieDetail.openYear || "정보 없음")}
                                        </DetailContext>
                                    </li>
                                ))}
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

//감독- 전체 박스
const DirectorBox = styled.div`
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    // border: 1px solid red;

    //디자인
    // margin-bottom: 30px;
    margin-left: 10px;

    justify-content: left;

`;

// 감독 사진 ul
const DirectorBoxUL = styled.ul`
    display: flex;
    flex-wrap: wrap;

    li{
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

`


//배우-이미지 박스
const ActorBox = styled.div`
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    // border: 1px solid red;
    //디자인
    margin-bottom: 30px;
    margin-left: 10px;
    display: flex;
    justify-content: left;
`;

// 사진 정렬 ul
const PhotoArray = styled.ul`
    display: flex;
    flex-wrap: wrap;
    // border: 1px solid red;

`
const PhotoArrayDiv = styled.div`
    display: flex;
    flex-direction: column;

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

    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;

    // border: 1px solid red;
    .DetailList{
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .DetailItem {
        display: flex;
        // border: 1px solid blue;
        margin-top: 15px;

    }

`;





//포스터 - 오른쪽
const DetailTitle = styled.li`

    width: 10%;
    // margin-bottom: 20px;
    padding-left: 6px;
    color: #fff;
    opacity: 0.64;
    font-size: 18px;
    text-align: left;
    text-indent: 15px;
    display: flex;
    align-items: center;
`;

//내용
const DetailContext = styled.li`
    width: 90%;


    font-size: 16px;
    font-weight: 300;
    padding-top: 2px;
    text-overflow: hidden;
    color: #fff;
    font-size: 18px;
    margin-left: 30px;
    line-height: 1.4;
    text-align: left;
    // border: 1px solid white;

    display: flex;


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




