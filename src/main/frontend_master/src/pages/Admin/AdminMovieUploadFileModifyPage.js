import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminMovieUploadFileModifyPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [originalData, setOriginalData] = useState(null);

    const [movieTitle, setMovieTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [movieData, setMovieData] = useState({
        trailers: [
            { trailerUrls: '', trailerId: null, mainTrailer: false },
            { trailerUrls: '', trailerId: null, mainTrailer: false },
            { trailerUrls: '', trailerId: null, mainTrailer: false }
        ],
        movieFilm: '',
        posters: [
            { posterUrls: '', posterId: null, mainPoster: false },
            { posterUrls: '', posterId: null, mainPoster: false },
            { posterUrls: '', posterId: null, mainPoster: false }
        ]
    });

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                console.log('Fetching movie data for movieId:', movieId);
                const response = await axios.get(`/admin/movie/${movieId}/second`);
                console.log('Full server response:', JSON.stringify(response.data, null, 2));

                const newMovieData = {
                    movieTitle: response.data.movieTitle || '',
                    trailers: [
                        ...(response.data.trailer || []).map(trailer => ({
                            trailerUrls: trailer.trailerUrls || '',
                            trailerId: trailer.trailerId || null,
                            mainTrailer: trailer.mainTrailer || false
                        })),
                        ...Array(3 - (response.data.trailer || []).length).fill({ trailerUrls: '', trailerId: null, mainTrailer: false })
                    ].slice(0, 3),
                    movieFilm: response.data.movieFilm?.movieFilm || '',
                    posters: [
                        ...(response.data.poster || []).map(poster => ({
                            posterUrls: poster.posterUrls || '',
                            posterId: poster.posterId || null,
                            mainPoster: poster.mainPoster || false
                        })),
                        ...Array(3 - (response.data.poster || []).length).fill({ posterUrls: '', posterId: null, mainPoster: false })
                    ].slice(0, 3)
                };

                setMovieData(newMovieData);
                setOriginalData(newMovieData);  // 원본 데이터 저장
                setMovieTitle(newMovieData.movieTitle);
            } catch (error) {
                console.error('Error fetching movie data:', error);
                setErrorMessage('영화 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchMovieData();
    }, [movieId, navigate]);

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
        setErrorMessage('');
        try {
            const changedData = {
                movieId: movieId,
                movieTitle: movieTitle,
                trailer: movieData.trailers.filter((trailer, index) =>
                    trailer.trailerUrls !== originalData.trailers[index]?.trailerUrls ||
                    trailer.mainTrailer !== originalData.trailers[index]?.mainTrailer
                ),
                movieFilm: movieData.movieFilm !== originalData.movieFilm ? { movieFilm: movieData.movieFilm } : undefined,
                poster: movieData.posters.filter((poster, index) =>
                    poster.posterUrls !== originalData.posters[index]?.posterUrls ||
                    poster.mainPoster !== originalData.posters[index]?.mainPoster
                )
            };

            // 변경된 데이터만 포함
            const dataToSend = Object.fromEntries(
                Object.entries(changedData).filter(([key, value]) =>
                    value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
                )
            );

            console.log('Sending changed data:', dataToSend);

            const response = await axios.put(`/admin/movie/${movieId}/updateSecond`, dataToSend);
            console.log('Server response after update:', response.data);
            alert('영화 정보가 성공적으로 수정되었습니다.');
            navigate("/admin/MovieList");
        } catch (error) {
            console.error('Error submitting movie data:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || '영화 정보 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };
    return (
        <div className='UploadBody'>
            <div className="AdminUploadHead">
                <h2>영화 수정 - 파일 정보</h2>
            </div>
            <div className="UploadInfo">
                {errorMessage && (
                    <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
                        {errorMessage}
                    </div>
                )}
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
                            {index === 0 && (
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
                            {index === 0 && (
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

export default AdminMovieUploadFileModifyPage;
