import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AdminMovieUploadFilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [movieId, setMovieId] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');

    const [movieData, setMovieData] = useState({
        trailerUrls: '',
        trailerId: null,
        movieFilm: '',
        filmId: null,
        posterUrls: '',
        posterId: null
    });

    useEffect(() => {
        if (location.state) {
            console.log('Received state:', location.state);
            setMovieId(location.state.movieId);
            setMovieTitle(location.state.movieTitle);
        } else {
            console.log('No state received');
            navigate('/admin/MovieUpload');
        }
    }, [location.state, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMovieData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!movieId) {
            alert('영화 ID가 없습니다. 처음부터 다시 시작해주세요.');
            navigate('/admin/MovieUpload');
            return;
        }
        try {
            const dataToSend = {
                movieId: movieId,
                movieTitle: movieTitle,
                trailer: [{
                    trailerId: movieData.trailerId,
                    trailerUrls: movieData.trailerUrls
                }],
                movieFilm: {
                    filmId: movieData.filmId,
                    movieFilm: movieData.movieFilm
                },
                poster: [{
                    posterId: movieData.posterId,
                    posterUrls: movieData.posterUrls
                }]
            };

            console.log('Sending data:', dataToSend);

            const response = await axios.post('/admin/movie/list/add', dataToSend);
            console.log('Server response:', response.data);
            alert('영화 정보가 성공적으로 저장되었습니다.');
            navigate("/admin/MovieList");
        } catch (error) {
            console.error('Error submitting movie data:', error.response?.data || error.message);
            alert('영화 정보 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className='UploadBody'>
            <div className="AdminUploadHead">
                <h2>영화 업로드 - 파일 정보</h2>
            </div>
            <div className="UploadInfo">
                <div className="UploadTitleForm">
                    <label className="label">
                        <div>제목:</div>
                        <div>{movieTitle}</div>
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

export default AdminMovieUploadFilePage;