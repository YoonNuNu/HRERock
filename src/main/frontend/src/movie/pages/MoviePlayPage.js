import React, { useEffect, useState, useRef } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { useParams } from 'react-router-dom';

// css
import "../../common/css/MoviePlay.css"


function MoviePlayPage() {
    const location = useLocation();
    // const { filmUrl, watchedTime } = location.state;
    const videoRef = useRef(null);
    const [memberInfo, setMemberInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const { movieId } = useParams();
    //테스트용
    const [watchedTime, setWatchedTime] = useState(0);
    const [movieData, setMovieData] = useState(null);
    const [totalDuration, setTotalDuration] = useState(null); // totalDuration 상태 추가
    const videoUrl = `/user/videos/${encodeURIComponent('response.data.filmurl')}`;
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    //경로 하드코딩 -> 서버 올릴 시, const url 부분 수정해야함

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                // localStorage에서 데이터 가져오기
                const storedProgress = JSON.parse(localStorage.getItem(`movie_${movieId}_progress`));
                console.log('Stored progress:', storedProgress);

                if (storedProgress && storedProgress.watchedTime) {
                    setWatchedTime(storedProgress.watchedTime);
                } else if (location.state && location.state.watchedTime) {
                    setWatchedTime(location.state.watchedTime);
                }

                // API 호출
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`/user/movies/${movieId}/play`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setMovieData(response.data);

                // API 응답과 localStorage 데이터 비교
                if (response.data.watchedTime && (!storedProgress || response.data.watchedTime > storedProgress.watchedTime)) {
                    setWatchedTime(response.data.watchedTime);
                    // localStorage 업데이트
                    localStorage.setItem(`movie_${movieId}_progress`, JSON.stringify({
                        watchedTime: response.data.watchedTime,
                        progressPercentage: response.data.progressPercentage || 0
                    }));
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        fetchMovieData();
    }, [movieId, location.state]);

    const updateWatchingProgress = async (playedSeconds) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post('/user/movies/history/update-progress',
                {
                    movie: {movieId: movieId},
                    watchTime: Math.floor(playedSeconds),
                    totalDuration: totalDuration
                },
                {
                    headers: {'Authorization': `Bearer ${token}`}
                }
            );
            console.log('시청 진행 상황이 업데이트되었습니다.');

            //로컬 스토리지 업데이트
            localStorage.setItem(`movie_${movieId}_progress`, JSON.stringify({
                watchedTime: Math.floor(playedSeconds),
                progressPercentage: totalDuration ? playedSeconds / totalDuration : 0
            }))
        } catch (error) {
            console.error('시청 진행 상황 업데이트 중 오류 발생:', error);
        }
    };

    // 비디오의 전체 길이를 설정하는 함수
    const handleDuration = (duration) => {
        console.log("Total duration:", duration);
        setTotalDuration(duration);
    };

    const handleReady = () => {
        if (!hasLoaded) {
            if (videoRef.current && watchedTime) {
                videoRef.current.seekTo(watchedTime);
            }
            setIsPlaying(true);
            setHasLoaded(true);
        }
    };

    // const handleError = (e) => {
    //     console.error("Video playback error:", e);
    //     // 일시적인 에러는 무시
    //     if (e.message.includes("The play() request was interrupted")) {
    //         return;
    //     }
    //     setError("비디오를 재생할 수 없습니다. 오류 내용: " + e.message);
    // };


    return (

        <>
            <div className='iframeDiv'>
                <ReactPlayer
                    ref={videoRef}
                    // url={filmUrl}
                    url={`/user/videos/${encodeURIComponent('ex_movie_film.mp4')}`}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={isPlaying}
                    // onReady={() => {
                    //     if (videoRef.current && watchedTime) {
                    //         videoRef.current.seekTo(watchedTime);
                    //     }
                    // }}
                    onReady={handleReady}
                    onProgress={(progress) => {
                        console.log("Current progress:", progress);
                        updateWatchingProgress(progress.playedSeconds);
                    }}
                    onDuration={handleDuration} // 비디오 전체 길이 설정
                    onError={(e) => {
                        console.error("Video playback error:", e);
                        setError("비디오를 재생할 수 없습니다." + videoUrl);
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
            </div>
        </>
    );
}

export default MoviePlayPage;