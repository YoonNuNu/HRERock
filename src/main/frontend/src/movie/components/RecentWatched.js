import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import { FaPlay } from 'react-icons/fa';

function RecentWatched() {
    const [recentWatchedMovies, setRecentWatchedMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchRecentWatchedList = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.error('No access token found');
                    setError('접근 토큰이 없습니다. 다시 로그인해주세요.');
                    return;
                }

                const response = await axios.get('/user/movies/history/recent-Watched', {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                console.log('Response data:', response.data.watchHistory); // 전체 응답 데이터 로깅
                setRecentWatchedMovies(response.data.watchHistory);

                //진행상태 저장
                response.data.watchHistory.forEach(movie => {
                    localStorage.setItem(`movie_${movie.id}_progress`, JSON.stringify({
                        watchTime: movie.watchTime,
                        progressPercentage: movie.progressPercentage
                    }))
                })
            } catch (error) {
                console.error('Error fetching recent watched movies:', error);
                setError('최근 시청 목록을 가져오는데 실패했습니다.')
            } finally {
                setLoading(false);
            }
        };
        fetchRecentWatchedList();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

//     return (
//         <div className="movie_img">
//             <ul className="movie_list">
//                 {recentWatchedMovies.map((movie) => (
//                     <li key={movie.movieId} className="recent_watched_movie_list_posters">
//                         <Link to={`/user/MoviePage/${movie.movieId}`}>
//                             <figure>
//                                 <img
//                                     src={movie.poster.posterUrl}
//                                     alt={movie.movieTitle}
//                                     className="recent_watched_movie_poster"
//                                 />
//                                 <figcaption className='MoviePosterFigcaption'>
//                                     {movie.movieTitle}
//                                 </figcaption>
//                             </figure>
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
    return (
        <div className="movie_img">
            <ul className="movie_list">
                {recentWatchedMovies.map((movie) => {
                    // const progressPercentage = movie.progressPercentage * 100;
                    const storedProgress = JSON.parse(localStorage.getItem(`movie_${movie.movieId}_progress`));
                    const progressPercentage = storedProgress
                        ? storedProgress.progressPercentage * 100
                        : movie.progressPercentage * 100;
                    const watchTime = storedProgress ? storedProgress.watchTime : movie.watchTime;
                    console.log(`Movie: ${movie.movieTitle}, Progress: ${progressPercentage}%`);


                    return (
                        <li key={movie.movieId} className="recent_watched_movie_list_posters">
                            <div className="poster_container">
                                <img
                                    src={movie.poster.posterUrls}
                                    alt={movie.movieTitle}
                                    className="recent_watched_movie_poster"
                                />
                                <Link
                                    to={`/user/MoviePlay/${movie.movieId}`}
                                    state={{watchedTime: movie.watchTime}}
                                    className="play_button"
                                >
                                    <FaPlay/>
                                </Link>
                                <div className="progress_bar">
                                    <div
                                        className="progress"
                                        style={{width: `${progressPercentage}%`}}
                                    ></div>
                                </div>
                                <figcaption className='MoviePosterFigcaption'>
                                    {movie.movieTitle}
                                </figcaption>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default RecentWatched;