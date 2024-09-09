import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { useParams } from 'react-router-dom';
import styled from "styled-components";

function MoviePlay() {
    const location = useLocation();
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { movieId } = useParams();
    const [watchedTime, setWatchedTime] = useState(0);
    const [movieData, setMovieData] = useState(null);
    const [totalDuration, setTotalDuration] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(!token){
            alert("로그인이 필요한 페이지입니다. 로그인 해주세요.");
            navigate("/login");
            return;
        }

        const fetchMovieData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`/user/movies/${movieId}/play`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("Received movie data:", response.data);
                setMovieData(response.data);
                setWatchedTime(response.data.watchTime || 0);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching movie data:", error);
                setError("영화 데이터를 불러오는데 실패했습니다.");
                setIsLoading(false);
            }
        };
        fetchMovieData();
    }, [movieId]);

    const updateWatchingProgress = async (playedSeconds) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`/user/movies/history/update-progress`,
                {
                    movie: { movieId: movieId },
                    watchTime: Math.floor(playedSeconds),
                    totalDuration: totalDuration
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            console.log('시청 진행 상황이 업데이트되었습니다.');
        } catch (error) {
            console.error('시청 진행 상황 업데이트 중 오류 발생:', error);
        }
    };

    const handleDuration = (duration) => {
        console.log("Total duration:", duration);
        setTotalDuration(duration);
    };

    const handleReady = () => {
        if (!hasLoaded && videoRef.current && watchedTime) {
            videoRef.current.seekTo(watchedTime);
            setIsPlaying(true);
            setHasLoaded(true);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const videoUrl = movieData && movieData.movieFilm
        ? `/user/videos/${encodeURIComponent(movieData.movieFilm.split('\\').pop())}`
        : '';

    return (
        <IframeDiv>
            {videoUrl && (
                <ReactPlayer
                    ref={videoRef}
                    url={videoUrl}
                    width="35%"
                    height="35%"
                    controls={true}
                    playing={isPlaying}
                    onReady={handleReady}
                    onProgress={(progress) => updateWatchingProgress(progress.playedSeconds)}
                    onDuration={handleDuration}
                    onError={(e) => {
                        console.error("Video playback error:", e);
                        setError(`비디오를 재생할 수 없습니다. 오류: ${e.message}`);
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    config={{
                        file: {
                            attributes: {
                                controlsList: 'nodownload'
                            }
                        }
                    }}
                />
            )}
            {error && <div>{error}</div>}
        </IframeDiv>
    );
}

export default MoviePlay;

const IframeDiv = styled.div`
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;

//크롬용 localstorage

// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import ReactPlayer from "react-player";
// import { useParams } from 'react-router-dom';
// import styled from "styled-components";
//
//
//
// function MoviePlay() {
//     const location = useLocation();
//     // const { filmUrl, watchedTime } = location.state;
//     const videoRef = useRef(null);
//     const [memberInfo, setMemberInfo] = useState(null);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();
//     const token = localStorage.getItem('accessToken');
//     const { movieId } = useParams();
//     //테스트용
//     const [watchedTime, setWatchedTime] = useState(0);
//     const [movieData, setMovieData] = useState(null);
//     const [totalDuration, setTotalDuration] = useState(null); // totalDuration 상태 추가
//     const videoUrl = `/user/videos/${encodeURIComponent('response.data.filmurl')}`;
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isReady, setIsReady] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [hasLoaded, setHasLoaded] = useState(false);
//
//
//
//     useEffect(() => {
//         const token = localStorage.getItem('accessToken');
//         if(!token){
//             alert("로그인이 필요한 페이지입니다. 로그인 해주세요.");
//             navigate("/login");
//         }
//
//
//     })
//
//     useEffect(() => {
//         if (movieData) {
//             console.log("movieData:", movieData);
//         }
//     }, [movieData]); // movieData가 변경될 때마다 실행
//
//     //경로 하드코딩 -> 서버 올릴 시, const url 부분 수정해야함
//
//     useEffect(() => {
//         const fetchMovieData = async () => {
//             try {
//                 // localStorage에서 데이터 가져오기
//                 const storedProgress = JSON.parse(localStorage.getItem(`movie_${movieId}_progress`));
//                 console.log('Stored progress:', storedProgress);
//
//                 if (storedProgress && storedProgress.watchedTime) {
//                     setWatchedTime(storedProgress.watchedTime);
//                 } else if (location.state && location.state.watchedTime) {
//                     setWatchedTime(location.state.watchedTime);
//                 }
//
//                 // axios 호출
//                 const token = localStorage.getItem('accessToken');
//                 const response = await axios.get(`/user/movies/${movieId}/play`, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 });
//                 setMovieData(response.data);
//
//                 // axios 응답과 localStorage 데이터 비교
//                 if (response.data.watchedTime && (!storedProgress || response.data.watchedTime > storedProgress.watchedTime)) {
//                     setWatchedTime(response.data.watchedTime);
//                     // localStorage 업데이트
//                     localStorage.setItem(`movie_${movieId}_progress`, JSON.stringify({
//                         watchedTime: response.data.watchedTime,
//                         progressPercentage: response.data.progressPercentage || 0
//                     }));
//                 }
//             } catch (error) {
//                 console.error("Error fetching movie data:", error);
//             }
//         };
//
//         fetchMovieData();
//     }, [movieId, location.state]);
//
//     const updateWatchingProgress = async (playedSeconds) => {
//         try {
//             const token = localStorage.getItem('accessToken');
//             await axios.post('/user/movies/history/update-progress',
//                 {
//                     movie: { movieId: movieId },
//                     watchTime: Math.floor(playedSeconds),
//                     totalDuration: totalDuration
//                 },
//                 {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 }
//             );
//             console.log('시청 진행 상황이 업데이트되었습니다.');
//
//             //로컬 스토리지 업데이트
//             localStorage.setItem(`movie_${movieId}_progress`, JSON.stringify({
//                 watchedTime: Math.floor(playedSeconds),
//                 progressPercentage: totalDuration ? playedSeconds / totalDuration : 0
//             }))
//         } catch (error) {
//             console.error('시청 진행 상황 업데이트 중 오류 발생:', error);
//         }
//     };
//
//     // 비디오의 전체 길이를 설정하는 함수
//     const handleDuration = (duration) => {
//         console.log("Total duration:", duration);
//         setTotalDuration(duration);
//     };
//
//     const handleReady = () => {
//         if (!hasLoaded) {
//             if (videoRef.current && watchedTime) {
//                 videoRef.current.seekTo(watchedTime);
//             }
//             setIsPlaying(true);
//             setHasLoaded(true);
//         }
//     };
//
//     // const handleError = (e) => {
//     //     console.error("Video playback error:", e);
//     //     // 일시적인 에러는 무시
//     //     if (e.message.includes("The play() request was interrupted")) {
//     //         return;
//     //     }
//     //     setError("비디오를 재생할 수 없습니다. 오류 내용: " + e.message);
//     // };
//
//
//     return (
//
//         <>
//             <IframeDiv>
//                 <ReactPlayer
//                     ref={videoRef}
//                     // url={`/user/videos/ex_movie_film.mp4`}
//                     url={`http://localhost:8080/user/videos/${encodeURIComponent('ex_movie_film.mp4')}`}
//                     width="35%"
//                     height="35%"
//                     controls={true}
//                     playing={isPlaying}
//                     onReady={handleReady}
//                     onProgress={(progress) => updateWatchingProgress(progress.playedSeconds)}
//                     onDuration={handleDuration}
//                     onError={(e) => {
//                         console.error("Video playback error:", e);
//                         if (e && e.target && e.target.error && e.target.error.code) {
//                             setError(`비디오를 재생할 수 없습니다. 오류 코드: ${e.target.error.code}`);
//                         } else {
//                             setError("비디오를 재생할 수 없습니다.");
//                         }
//                     }}
//                     onPlay={() => setIsPlaying(true)}
//                     onPause={() => setIsPlaying(false)}
//                     config={{
//                         file: {
//                             attributes: {
//                                 controlsList: 'nodownload'
//                             }
//                         }
//                     }}
//                 />
//
//             </IframeDiv>
//         </>
//     );
// }
//
// export default MoviePlay;
//
// const IframeDiv = styled.div`
//     width: 100%;
//     text-align: center;
//     display: flex;
//     justify-content: center;
//
//     ReactPlayer{
//
//
//     }
// `
