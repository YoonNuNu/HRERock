import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MoviePersonal() {
    const [chartImages, setChartImages] = useState({
        personal_genres: null,
        personal_attraction: null,
        personal_emotion: null
    });
    const [actorsList, setActorsList] = useState([]);
    const [directorsList, setDirectorsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null); // 삭제 오류 상태
    const [memberInfo, setMemberInfo] = useState(null);
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState({});
    const [pointsContentRecommendations, setPointsContentRecommendations] = useState([])
    const [movieCollabRecommendation, setMovieCollabRecommendations] = useState([])
    const [pointsCollabRecommendations, setPointsCollabRecommendations] = useState([])

    // 회원 정보 가져오기
    const fetchMemberInfo = useCallback(async (token) => {
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
            if (error.response && error.response.status === 401) {
                setError("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                setError("사용자 정보를 가져오는데 실패했습니다.");
            }
            throw error;
        }
    }, [navigate]);

    // 차트 이미지 가져오기
    const fetchPersonalChartImages = useCallback(async (token, memNum) => {
        try {
            const chartTypes = ['personal_genres', 'personal_attraction', 'personal_emotion']; // 요청할 차트 타입
            const requests = chartTypes.map(type =>
                axios.get(`/user/personal/${memNum}/${type}-chart`, {
                    responseType: 'arraybuffer',
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(response => {
                    const blob = new Blob([response.data], { type: 'image/png' });
                    const url = URL.createObjectURL(blob);
                    return { type, url };
                })
            );
            const results = await Promise.all(requests);
            const images = results.reduce((acc, { type, url }) => {
                acc[type] = url;
                return acc;
            }, {});
            setChartImages(images);
        } catch (error) {
            console.error('차트 이미지를 불러오는 중 오류 발생:', error);
            setError('차트 이미지를 불러오는데 실패했습니다.');
        }
    }, []);

    // 이미지 삭제
    const deleteImages = async (fileNames) => {
        const token = localStorage.getItem('accessToken');
        try {
            await axios.post(`/user/personal/${memberInfo.memNum}/delete-image`,
                { fileNames },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // 이미지 삭제 후 새로고침
            fetchPersonalChartImages(token, memberInfo.memNum);
        } catch (error) {
            console.error('이미지 삭제 중 오류 발생:', error);
            setDeleteError('이미지를 삭제하는데 실패했습니다.');
        }
    };

    // 배우 리스트 가져오기
    const fetchPersonalActorsList = useCallback(async (token, memNum) => {
        try {
            console.log('Fetching actors list for memNum:', memNum);
            const response = await axios.get(`/user/personal/${memNum}/personal_actors-list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // 응답 데이터 로깅
            console.log('배우 리스트 응답 데이터:', response.data);

            // 데이터가 배열인지 확인
            if (Array.isArray(response.data)) {
                setActorsList(response.data);
            } else {
                console.error('응답 데이터가 배열이 아닙니다.');
            }
            setActorsList(response.data);
        } catch (error) {
            console.error('배우 리스트를 불러오는 중 오류 발생:', error);
            setError('배우 리스트를 불러오는데 실패했습니다.');
        }
    }, []);

    // 감독 리스트 가져오기
    const fetchPersonalDirectorsList = useCallback(async (token, memNum) => {
        try {
            const response = await axios.get(`/user/personal/${memNum}/personal_directors-list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDirectorsList(response.data);
        } catch (error) {
            console.error('감독 리스트를 불러오는 중 오류 발생:', error);
            setError('감독 리스트를 불러오는데 실패했습니다.');
        }
    }, []);

    // 추천 영화 목록 가져오기
    const fetchRecommendations = useCallback(async (token, memNum) => {
        try {
            const [pointsContent, movieCollab, pointsCollab] = await Promise.all([
                axios.get(`/user/personal/recommend/${memNum}/points-content`, { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get(`/user/personal/recommend/${memNum}/movie-collab`, { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get(`/user/personal/recommend/${memNum}/points-collab`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            setPointsContentRecommendations(pointsContent.data);
            setMovieCollabRecommendations(movieCollab.data);
            setPointsCollabRecommendations(pointsCollab.data);
        } catch (error) {
            console.error('추천 영화 목록을 불러오는 중 오류 발생:', error);
            setError('추천 영화 목록을 불러오는데 실패했습니다.');
        }
    }, []);

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
            } catch (error) {
                console.error("회원 정보 로딩 중 오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fetchMemberInfo, navigate]);

    useEffect(() => {
        if (memberInfo?.memNum) {
            const token = localStorage.getItem('accessToken');
            fetchPersonalChartImages(token, memberInfo.memNum);
            fetchPersonalActorsList(token, memberInfo.memNum);
            fetchPersonalDirectorsList(token, memberInfo.memNum);
            fetchRecommendations(token, memberInfo.memNum);
        }
        // 컴포넌트가 언마운트될 때 실행될 cleanup 함수
        return () => {
            const token = localStorage.getItem('accessToken');
            if (token && memberInfo?.memNum) {
                axios.post(`/user/personal/${memberInfo.memNum}/delete`, {
                    fileNames: [
                        `personal_genres_${memberInfo.memNum}.png`,
                        `personal_attraction_${memberInfo.memNum}.png`,
                        `personal_emotion_${memberInfo.memNum}.png`,
                        `personal_actors_${memberInfo.memNum}.json`,
                        `personal_directors_${memberInfo.memNum}.json`
                    ]
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(response => {
                        console.log('Images deleted:', response.data);
                    })
                    .catch((error) => {
                        console.error('Error deleting images:', error);
                    });
            }
        };
    }, [fetchPersonalChartImages, fetchPersonalActorsList, fetchPersonalDirectorsList, fetchRecommendations, memberInfo]);

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div style={{padding: '20px'}}>
            <h1>{memberInfo?.memName}님의 영화 취향 분석</h1>
            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {chartImages.personal_genres && (
                    <div style={{width: '80%', maxWidth: '600px', margin: '10px'}}>
                        <h2>장르 분석</h2>
                        <img
                            src={chartImages.personal_genres}
                            alt="장르 차트"
                            style={{width: '100%', height: 'auto'}}
                        />
                    </div>
                )}
                {chartImages.personal_attraction && (
                    <div style={{width: '80%', maxWidth: '600px', margin: '10px'}}>
                        <h2>매력포인트 분석</h2>
                        <img
                            src={chartImages.personal_attraction}
                            alt="매력포인트"
                            style={{width: '100%', height: 'auto'}}
                        />
                    </div>
                )}
                {chartImages.personal_emotion && (
                    <div style={{width: '80%', maxWidth: '600px', margin: '10px'}}>
                        <h2>감정포인트 분석</h2>
                        <img
                            src={chartImages.personal_emotion}
                            alt="감정포인트"
                            style={{width: '100%', height: 'auto'}}
                        />
                    </div>
                )}
            </div>
            <div style={{marginTop: '20px'}}>
                <h2>배우 리스트</h2>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {actorsList.length > 0 ? (
                        actorsList.map((actor, index) => (
                            <li key={index} style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                                <img
                                    src={actor.photo_url}
                                    alt={actor.actor_name}
                                    style={{width: '50px', height: 'auto', marginRight: '10px'}}
                                />
                                {actor.actor_name}
                            </li>
                        ))
                    ) : (
                        <li>배우 리스트가 없습니다.</li>
                    )}
                </ul>
            </div>

            <div style={{marginTop: '20px'}}>
                <h2>감독 리스트</h2>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {directorsList.length > 0 ? (
                        directorsList.map((director, index) => (
                            <li key={index} style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                                <img
                                    src={director.photo_url}
                                    alt={director.director_name}
                                    style={{width: '50px', height: 'auto', marginRight: '10px'}}
                                />
                                {director.director_name}
                            </li>
                        ))
                    ) : (
                        <li>감독 리스트가 없습니다.</li>
                    )}
                </ul>
            </div>

            <div style={{marginTop: '20px'}}>
                <h2>추천 영화 목록</h2>
                {Object.entries(recommendations).map(([type, movies]) => (
                    <div key={type}>
                        <h3>{type}</h3>
                        <ul style={{display: 'flex', flexWrap: 'wrap', listStyle: 'none', padding: 0}}>
                            {movies.map((movie, index) => (
                                <li key={index} style={{margin: '10px', width: '200px'}}>
                                    <img
                                        src={movie.mainPosterUrl?.posterUrls}
                                        alt={movie.movieTitle}
                                        style={{width: '100%', height: 'auto'}}
                                    />
                                    <p>{movie.movieTitle}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default MoviePersonal;
