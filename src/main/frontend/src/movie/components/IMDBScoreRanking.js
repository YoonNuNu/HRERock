import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";


function IMDBScoreRanking() {
    const [rankMovies, setRankMovies] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopRatedMovies = async () => {
            const response = await axios.get(`/user/main/ranking`);
            setRankMovies(response.data);
            // try {
            //     const response = await axios.get(`/main/ranking`);
            //     setRankMovies(response.data);
            //     console.log(response.data);
            // } catch (error) {
            //     console.log('랭킹오류: ', error);
            //     if (error.response) {
            //         switch (error.response.data.errCode) {
            //             case "ERR_MOVIE_NOT_FOUND":
            //                 alert("영화를 찾을 수 없습니다.");
            //                 break;
            //
            //             case "ERR_UNAUTHORIZED":
            //                 alert("접근 권한이 없습니다.");
            //                 navigate('/login');
            //                 break;
            //
            //             default:
            //                 alert("영화 정보를 불러오는 데 실패했습니다.")
            //         }
            //     } else {
            //         setError("서버와 연결이 실패했습니다.");
            //     }
            // }
        };
        fetchTopRatedMovies();
    }, [navigate])

    return (

        <>

            <div className="movie_img">
                <ul className="movie_list">
                    {rankMovies.map((movie) => (
                        <li key={movie.movieId} className="IMDB_score_ranking_movie_list_posters">
                            <Link to={`/user/MoviePage/${movie.movieId}`}>
                                <figure>
                                    <img
                                        src={movie.poster.posterUrls}
                                        alt={movie.movieTitle}
                                        className="update_movie_poster"
                                        // onError={handleImgeError} 에러처리 이미지
                                    />
                                    <figcaption className='MoviePosterFigcaption'>
                                        {movie.movieTitle}
                                        {movie.movieDescription}
                                    </figcaption>
                                </figure>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}


export default IMDBScoreRanking;