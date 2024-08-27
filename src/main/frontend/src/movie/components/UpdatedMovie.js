import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";


function UpdatedMovie() {
    const [newMovies, setNewMovies] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUpdatedMovies = async () => {
            const response = await axios.get('/user/main/updated');
            setNewMovies(response.data);
            // try {
            //     const response = await axios.get('/main/updated');
            //     setNewMovies(response.data);
            //     // console.log(response.data);
            // } catch (error) {
            //     // console.error('신규영화 오류:', error);
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
            //         alert("서버와 연결이 실패했습니다.");
            //     }
            // }
        };
        fetchUpdatedMovies();
    }, [navigate]);

    // const handleImageError = (e) => {
    //     e.target.src = ''; //경로
    // }
    // 대체 이미지 여기에 넣기


    // useEffect(() => {
    //     const fetchRecentMovies = async () => {
    //         try {
    //             const response = await axios.get('/main/recent');
    //             setNewMovies(response.data);
    //         } catch (error) {
    //             if (error.response) {
    //                 switch (error.response.data.errCode) {
    //                     case "ERR_MOVIE_NOT_FOUND":
    //                         setError("영화를 찾을 수 없습니다.");
    //                         break;
    //
    //                     case "ERR_UNAUTHORIZED":
    //                         setError("접근 권한이 없습니다.");
    //                         navigate('/login');
    //                         break;
    //
    //                     default:
    //                         setError("영화 정보를 불러오는 데 실패했습니다.")
    //                 }
    //             } else {
    //                 setError("서버와 연결이 실패했습니다.");
    //             }
    //             console.error('신규영화 오류:', error);
    //         }
    //     };
    //     fetchRecentMovies();
    // }, []);


    return (

        <>

            <div className="movie_img">
                <ul className="movie_list">
                    {newMovies.map((movie) => (
                        <li key={movie.movieId} className="update_movie_list_posters">
                            <div className="poster_container">
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
                            </div>
                        </li>
                        //     <li key={movie.movieId} className="update_movie_list_posters">
                    // <Link to={`/user/MoviePage/${movie.movieId}`}>
                    //     <img
                    //         src={movie.posterUrls}
                    //         alt={movie.movieTitle}
                    //         className="update_movie_poster"
                    //     />
                    //             <div className="movie-info">
                    //                 <h3>{movie.movieTitle}</h3>
                    //                 <p>{movie.movieDescription}</p>
                    //             </div>
                    //         </Link>
                    //     </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default UpdatedMovie;