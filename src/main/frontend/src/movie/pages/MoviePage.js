import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import '../../common/css/MoviePage.css';
import MovieTab from "../components/MovieTab";

function MoviePage() {
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
        if(error) {
            alert(error);
            setError(null);
        }
    }, [error]);

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
            const response = await axios.get('/auth/memberinfo', {
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

    const fetchMovieDetail = useCallback(async (token) => {
        try {
            const response = await axios.get(`/user/movies/detail/${movieId}`, {
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

    const checkFavoriteStatus = useCallback(async (token) => {
        try {
            const response = await axios.get(`/user/movies/detail/${movieId}/favorites`, {
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
    });

    const toggleFavorite = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            setIsFavorite(!isFavorite);
            setTotalFavorites(prev => isFavorite ? prev - 1 : prev + 1);

            let response;
            if (isFavorite) {
                await axios.delete(`/user/movies/detail/${movieId}/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.post(`/user/movies/detail/${movieId}/favorites`, { movieId: movieId }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (response && response.data) {
                setIsFavorite(response.data.isFavorite);
                setTotalFavorites(response.data.favorCount)
            } else {
                setIsFavorite(!isFavorite);
            }

        } catch (error) {
            console.error('찜하기 토글 중 오류 발생:', error);
            if (error.response && error.response.data) {
                alert(error.response.data.message || "찜하기 처리 중 오류가 발생했습니다.");
            } else {
                alert( "찜하기 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
            const response = await axios.get(`/user/movies/${movieId}/play`, {
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

    return (
        <div className="movie">
            <img
                src={movieDetail.posters && movieDetail.posters.length > 0 ? movieDetail.posters[0].posterUrls : ''}
                alt={`${movieDetail.movieTitle} 포스터`}
                className="movie_bg"
            />
            <div className="movie_explain">
                <div className="book_mark">
                    <button onClick={toggleFavorite}>
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                    <span> ({totalFavorites})</span>
                </div>
                <div className="explainDiv">
                    <div className="explain">
                        <ul className='explainUl'>
                            <li className="movieTitle">{movieDetail.movieTitle}</li>
                            <li className="movieGenre">
                                장르: {movieDetail.genres.map(genre => genre.genreName).join(', ')}
                            </li>
                            <li className="movieRunTime">상영 시간: {movieDetail.runTime}분</li>
                            <li className="movieOpenYear">개봉 년도: {movieDetail.openYear}</li>
                            <li className="movieRating">등급: {movieDetail.movieRating}</li>
                            <li className="movieDescription">줄거리: {movieDetail.movieDescription}</li>
                            <li className="movieDirectors">
                                감독:
                                <ul>
                                    {movieDetail.directors.map(director => (
                                        <li key={director.directorId}>
                                            {director.directorName}
                                            {director.directorPhoto && director.directorPhoto.length > 0 && (
                                                <img
                                                    src={director.directorPhoto[0].photoUrl}
                                                    alt={`${director.directorName} 사진`}
                                                    className="directorImg"
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="movieActors">
                                출연 배우:
                                <ul>
                                    {movieDetail.actors.map(actor => (
                                        <li key={actor.actorId}>
                                            {actor.actorName}
                                            {actor.actorPhoto && actor.actorPhoto.length > 0 && (
                                                <img
                                                    src={actor.actorPhoto[0].photoUrl}
                                                    alt={`${actor.actorName} 사진`}
                                                    className="actorImg"
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <MovieTab
                        movieId={movieId}
                        movieDetail={movieDetail}
                        memRole={memberInfo?.role}
                        correspondMemName={memberInfo?.memName}
                        correspondMemNum={memberInfo?.memNum}
                    />
                </div>
            </div>

            <div className="bg"></div>
            <div className="button">
                <button className="watch_movie_btn" onClick={handleWatchMovie}>
                    영화 보러 가기
                </button>
            </div>
        </div>
    );
}

export default MoviePage;