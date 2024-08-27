import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ChatBot from "../../member/component/ChatBot";

function MovieSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [topRankMovies, setTopRankMovies] = useState([]); // 상위 랭킹     영화 상태 추가
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '0')); // 페이지 기본값을 0으로 설정
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
    const [currentGroup, setCurrentGroup] = useState(Math.floor(page / 10)); // 현재 페이지 그룹 설정

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams(searchParams.toString());
                queryParams.set('page', page); // 항상 페이지 번호를 설정
                console.log('쿼리 파라미터:', queryParams.toString());
                const response = await fetch(`/user/MovieSearch?${queryParams.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('응답 데이터:', data); // 응답 데이터 구조를 확인합니다
                    if (Array.isArray(data.content)) {
                        setMovies(data.content);
                    } else if (data.content) {
                        setMovies([data.content]); // 단일 결과를 배열로 처리
                    } else {
                        setMovies([]);
                    }
                    setTotalPages(data.totalPages || 1); // 총 페이지 수 설정
                } else {
                    setError('검색 요청 실패');
                }
            } catch (err) {
                setError('서버 오류');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchParams, page]); // 페이지 번호 상태도 의존성 배열에 추가

    useEffect(() => {
        const fetchTopRankMovies = async () => {
            try {
                const response = await fetch('/user/TopRankMovies');
                if (response.ok) {
                    const data = await response.json();
                    console.log('상위 랭킹 영화 데이터:', data); // 응답 데이터 구조를 확인합니다
                    if (Array.isArray(data.content)) {
                        setTopRankMovies(data.content);
                    } else if (data.content) {
                        setTopRankMovies([data.content]); // 단일 결과를 배열로 처리
                    } else {
                        setTopRankMovies([]);
                    }
                } else {
                    setError('상위 랭킹 영화 요청 실패');
                }
            } catch (err) {
                setError('서버 오류');
            }
        };

        fetchTopRankMovies();
    }, []); // 컴포넌트 마운트 시 한 번 호출

    useEffect(() => {
        setCurrentGroup(Math.floor(page / 10));
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams.toString());
            newParams.set('page', newPage);
            return newParams;
        });
    };

    const handleNextGroup = () => {
        const nextGroupStartPage = (currentGroup + 1) * 10;
        if (nextGroupStartPage < totalPages) {
            setCurrentGroup(currentGroup + 1);
            handlePageChange(nextGroupStartPage);
        }
    };

    const handlePrevGroup = () => {
        if (currentGroup > 0) {
            const prevGroupStartPage = (currentGroup - 1) * 10;
            setCurrentGroup(currentGroup - 1);
            handlePageChange(prevGroupStartPage);
        }
    };

    const renderPagination = () => {
        const maxPagesPerGroup = 10;
        const startPage = currentGroup * maxPagesPerGroup;
        const endPage = Math.min(startPage + maxPagesPerGroup, totalPages);
        const pageButtons = [];

        for (let i = startPage; i < endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    disabled={i === page}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </button>
            );
        }

        return (
            <div className="pagination">
                {currentGroup > 0 && (
                    <button onClick={handlePrevGroup}>
                        &lt;
                    </button>
                )}
                {pageButtons}
                {endPage < totalPages && (
                    <button onClick={handleNextGroup}>
                        &gt;
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="search">
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        value={Array.from(searchParams.entries())
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        readOnly
                        placeholder="검색 예: title:Inception, director:Nolan, actor:DiCaprio, genre:Sci-Fi"
                    />
                </form>
            </div>

            {loading && <p>검색 중...</p>}
            {error && <p className="error">{error}</p>}

            <div className="top_rank_movies">
                <h2>상위 랭킹 영화</h2>
                {topRankMovies.length > 0 ? (
                    <ul>
                        {topRankMovies.map((movie) => (
                            <li key={movie.movieId}>
                                <Link to={`/user/MoviePage/${movie.movieId}`}>
                                    {movie.movieTitle}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>상위 랭킹 영화가 없습니다.</p>
                )}
            </div>

            <div className="search_result">
                {movies.length > 0 ? (
                    <span>검색 결과</span>
                ) : (
                    <span>검색 결과가 없습니다.</span>
                )}
            </div>

            <div className="result_movie">
                {movies.map((movie) => (
                    <Link key={movie.movieId} to={`/user/MoviePage/${movie.movieId}`}>
                        <figure className="movie_figure">
                            {movie.posters && movie.posters.length > 0 ? (
                                movie.posters.map((poster, index) => (
                                    <img
                                        key={index}
                                        src={poster.posterUrls || 'https://via.placeholder.com/500x750?text=No+Image'}
                                        alt={movie.movieTitle}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                                        }}
                                    />
                                ))
                            ) : (
                                <img
                                    src='https://via.placeholder.com/500x750?text=No+Image'
                                    alt={movie.movieTitle}
                                />
                            )}
                            <figcaption>{movie.movieTitle}</figcaption>
                        </figure>
                    </Link>
                ))}
            </div>
            <ChatBot />
            {renderPagination()}
        </>
    );
}

export default MovieSearch;
