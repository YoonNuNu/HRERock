import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminMovieUploadModifyPage2() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movieData, setMovieData] = useState({
        movieTitle: '',
        trailerUrls: '',
        trailerId: '',
        movieFilm: '',
        filmId: null,
        posterUrls: '',
        posterId: null
    });

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                console.log('Fetching movie data for movieId:', movieId);
                const response = await axios.get(`/admin/movie/${movieId}/second`);
                console.log('Full server response:', JSON.stringify(response.data, null, 2));

                const newMovieData = {
                    movieTitle: response.data.movieTitle || '',
                    trailerUrls: response.data.trailer && response.data.trailer.length > 0
                        ? response.data.trailer[0].trailerUrls
                        : '',
                    trailerId: response.data.trailer && response.data.trailer.length > 0
                        ? response.data.trailer[0].trailerId
                        : null,
                    movieFilm: response.data.movieFilm && response.data.movieFilm.movieFilm
                        ? response.data.movieFilm.movieFilm
                        : '',
                    filmId: response.data.movieFilm && response.data.movieFilm.filmId
                        ? response.data.movieFilm.filmId
                        : null,
                    posterUrls: response.data.poster && response.data.poster.length > 0
                        ? response.data.poster[0].posterUrls
                        : '',
                    posterId: response.data.poster && response.data.poster.length > 0
                        ? response.data.poster[0].posterId
                        : null
                };
                console.log('Processed movie data:', newMovieData);

                setMovieData(newMovieData);
            } catch (error) {
                console.error('Error fetching movie data:', error);
                console.error('Error response:', error.response);
                alert('영화 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchMovieData();
    }, [movieId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed: ${name} = ${value}`);
        setMovieData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                movieId: movieId,
                movieTitle: movieData.movieTitle,
                movieFilm: {
                    filmId: movieData.filmId,
                    movieFilm: movieData.movieFilm
                },
                trailer: [
                    {
                        trailerId: movieData.trailerId,
                        trailerUrls: movieData.trailerUrls
                    }
                ],
                poster: [
                    {
                        posterId: movieData.posterId,
                        posterUrls: movieData.posterUrls
                    }
                ]
            };
            console.log('Submitting data:', JSON.stringify(dataToSend, null, 2));

            const response = await axios.put(`/admin/movie/${movieId}/updateSecond`, dataToSend);
            console.log('Server response after update:', response.data);

            alert('영화 정보가 성공적으로 수정되었습니다.');
            navigate('/admin/MovieList');
        } catch (error) {
            console.error('Error updating movie:', error);
            console.error('Error response:', error.response?.data);
            alert('영화 정보 수정에 실패했습니다.');
        }
    };
    console.log('Current movieData state:', movieData);


    return (
        <div className='UploadBody'>
            <div className="AdminUploadHead">
                <h2>영화 수정 - 파일 정보</h2>
            </div>
            <div className="UploadInfo">
                <div className="UploadTitleForm">
                    <label className="label">
                        <div>제목:</div>
                        <div>{movieData.movieTitle}</div>
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="UploadInfoForm">

                    <label>
                        <div>영화 URL:</div>
                        <div>
                            <input
                                type="text"
                                name="movieFilm"
                                value={movieData.movieFilm}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="hidden"
                                name="filmId"
                                value={movieData.filmId || ''}
                            />
                        </div>
                    </label>
                    <label>
                        <div>예고편 URL:</div>
                        <div>
                            <input
                                type="text"
                                name="trailerUrls"
                                value={movieData.trailerUrls}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="hidden"
                                name="trailerId"
                                value={movieData.trailerId || ''}
                            />
                        </div>
                    </label>
                    <label>
                        <div>포스터 URL:</div>
                        <div>
                            <input
                                type="text"
                                name="posterUrls"
                                value={movieData.posterUrls}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="hidden"
                                name="posterId"
                                value={movieData.posterId || ''}
                            />
                        </div>
                    </label>
                    <div>
                        <input type="submit" value="완료" className="MovieUploadBtn"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminMovieUploadModifyPage2;
