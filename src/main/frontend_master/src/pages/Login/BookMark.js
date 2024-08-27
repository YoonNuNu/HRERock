import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../Login/css/MyPage.css';

function BookMark() {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [localFavorites, setLocalFavorites] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const moviesPerPage = 5;

    // const api = axios.create({
    //     baseURL: "http://localhost:8080"
    // });

    const fetchFavoriteMovies = useCallback(async (page) => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`/user/mypage/favor?page=${page}&size=${moviesPerPage}&sort=createDate,desc`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log("Favorite movies response:", response.data);
            setFavoriteMovies(prevMovies => [...prevMovies, ...response.data.content]);
            setHasMore(response.data.content.length === moviesPerPage);

            const newFavorites = response.data.content.reduce((acc, movie) => {
                acc[movie.movieId] = movie.favorite;
                return acc;
            }, {});
            setLocalFavorites(prev => ({ ...prev, ...newFavorites }));

        } catch (error) {
            console.error('Error fetching favorite movies:', error);
            if (error.response && error.response.status === 401) {
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                alert("찜한 컨텐츠를 불러오는 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchFavoriteMovies(currentPage);
    }, [currentPage, fetchFavoriteMovies]);

    const toggleFavorite = async (movieId) => {
        const token = localStorage.getItem('accessToken');
        try {
            const newFavorite = !localFavorites[movieId];

            setLocalFavorites((prev) => ({
                ...prev,
                [movieId]: newFavorite
            }));

            if (newFavorite) {
                await axios.post(`/user/movies/detail/${movieId}/favorites`, { movieId: movieId }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.delete(`/user/movies/detail/${movieId}/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }


        } catch (error) {
            console.error('찜하기 토글 중 오류 발생:', error);
            alert("찜하기 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="mypage-bookmark">
            {favoriteMovies.length === 0 && !loading ? (
                <div className="mypage-empty-state">찜한 컨텐츠가 없습니다.</div>
            ) : (
                <>
                    <ul className="mypage-bookmark-list">
                        {favoriteMovies.map((movie, index) => (
                            <li key={index} className="mypage-bookmark-item">
                                <div className="mypage-bookmark-poster-container">
                                    <img
                                        src={movie.poster ? movie.poster.posterUrls : 'https://via.placeholder.com/500'}
                                        alt={movie.movieTitle}
                                        className="mypage-bookmark-movie-poster"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/500'}
                                    />
                                    <Link to={`/user/MoviePage/${movie.movieId}`} className="mypage-bookmark-movie-title">
                                        {movie.movieTitle}
                                    </Link>
                                    <button
                                        onClick={() => toggleFavorite(movie.movieId)}
                                        className="mypage-bookmark-button"
                                    >
                                        {localFavorites[movie.movieId] ? '❤️' : '🤍'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {hasMore && !loading && (
                        <button onClick={handleLoadMore} className="mypage-load-more">
                            더보기
                        </button>
                    )}
                </>
            )}
            {loading && <div className="mypage-loading">Loading...</div>}
        </div>
    );
}

export default BookMark;