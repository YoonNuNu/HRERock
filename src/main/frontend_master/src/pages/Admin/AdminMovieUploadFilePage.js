import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AdminMovieUploadFilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [movieId, setMovieId] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');

    const [movieData, setMovieData] = useState({
        trailers: [
            { trailerUrls: '', trailerId: null, mainTrailer: false },
            { trailerUrls: '', trailerId: null, mainTrailer: false },
            { trailerUrls: '', trailerId: null, mainTrailer: false }
        ],
        movieFilm: '',// 문자열로 수정
        posters: [
            { posterUrls: '', posterId: null, mainPoster: false },
            { posterUrls: '', posterId: null, mainPoster: false },
            { posterUrls: '', posterId: null, mainPoster: false }
        ]
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

    const handleInputChange = (e, index, type) => {
        const { name, value, type: inputType, checked } = e.target;
        const actualValue = inputType === 'checkbox' ? checked : value;

        if (type === 'trailers' || type === 'posters') {
            const updatedItems = movieData[type].map((item, i) => {
                if (i === index) {
                    return { ...item, [name]: actualValue };
                }
                if (name === 'mainTrailer' || name === 'mainPoster') {
                    return { ...item, [name]: false };
                }
                return item;
            });
            setMovieData({ ...movieData, [type]: updatedItems });
        } else {
            setMovieData({ ...movieData, [name]: actualValue });
        }
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
                trailer: movieData.trailers.filter(trailer => trailer.trailerUrls).map(trailer => ({
                    trailerUrls: trailer.trailerUrls,
                    mainTrailer: trailer.mainTrailer
                })),
                movieFilm: { movieFilm: movieData.movieFilm },
                poster: movieData.posters.filter(poster => poster.posterUrls).map(poster => ({
                    posterUrls: poster.posterUrls,
                    mainPoster: poster.mainPoster
                }))
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
                                onChange={(e) => handleInputChange(e, null, 'movieFilm')}
                                required
                            />
                        </div>
                    </label>

                    {movieData.trailers.map((trailer, index) => (
                        <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                            <label style={{flex: 1}}>
                                <div>예고편 URL {index + 1}:</div>
                                <div>
                                    <input
                                        type="text"
                                        name="trailerUrls"
                                        value={trailer.trailerUrls}
                                        onChange={(e) => handleInputChange(e, index, 'trailers')}
                                    />
                                </div>
                            </label>
                            {index === 0 && ( // 첫 번째 항목에만 체크박스 표시
                                <label style={{marginLeft: '10px'}}>
                                    <div>메인 예고편:</div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="mainTrailer"
                                            checked={trailer.mainTrailer}
                                            onChange={(e) => handleInputChange(e, index, 'trailers')}
                                        />
                                    </div>
                                </label>
                            )}
                        </div>
                    ))}

                    {movieData.posters.map((poster, index) => (
                        <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                            <label style={{flex: 1}}>
                                <div>포스터 URL {index + 1}:</div>
                                <div>
                                    <input
                                        type="text"
                                        name="posterUrls"
                                        value={poster.posterUrls}
                                        onChange={(e) => handleInputChange(e, index, 'posters')}
                                    />
                                </div>
                            </label>
                            {index === 0 && ( // 첫 번째 항목에만 체크박스 표시
                                <label style={{marginLeft: '10px'}}>
                                    <div>메인 포스터:</div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="mainPoster"
                                            checked={poster.mainPoster}
                                            onChange={(e) => handleInputChange(e, index, 'posters')}
                                        />
                                    </div>
                                </label>
                            )}
                        </div>
                    ))}

                    <div>
                        <input type="submit" value="완료" className="MovieUploadBtn"/>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AdminMovieUploadFilePage;