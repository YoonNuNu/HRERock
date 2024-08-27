import React, {useState, useEffect, useCallback, useRef} from "react";
import { useNavigate } from "react-router-dom";
import '../../../common/css/AdminMovieList.css';
import axios from "axios";

function AdminMovieListPage() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("title");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selectedMovies, setSelectedMovies] = useState([]);

    //관리자 권한 인증 확인
    const initializedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    const navigate = useNavigate();

    const pageGroupSize = 10;

    //인증
    const checkPermission = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('/auth/memberinfo', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const role = response.data.memRole;
            if (role === 'ADMIN') {
                setHasPermission(true);
            } else {
                alert("권한이 없습니다.");
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            alert("오류가 발생했습니다. 다시 로그인해주세요.");
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            checkPermission();
        }
    }, [checkPermission]);

    const fetchMovies = useCallback(async (page = currentPage) => {
        try {
            let url;
            if (isSearchActive && searchTerm) {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: '10',
                    sort: 'movieId,asc',
                    movieTitle: '',
                    movieGenres: '',
                    directorName: ''
                });
                switch(searchType) {
                    case "title":
                        params.set("movieTitle", searchTerm);
                        break;
                    case "genre":
                        params.set("movieGenres", searchTerm);
                        break;
                    case "director":
                        params.set("directorName", searchTerm);
                        break;
                    default:
                        params.set("movieTitle", searchTerm);
                }
                url = `/admin/movie/list/search?${params}`;
            } else {
                url = `/admin/movie/movielist?page=${page}&size=10&sort=movieId,asc`;
            }

            console.log("Fetching URL:", url);

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const data = await response.json();
            console.log("Fetched data:", data);
            setMovies(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("영화 데이터를 가져오는 데 실패했습니다:", error);
        }
    }, [currentPage, isSearchActive, searchTerm, searchType]);

    useEffect(() => {
        if (!isSearchActive) {
            fetchMovies();
        }
    }, [fetchMovies, isSearchActive]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearchActive(true);
        setCurrentPage(0);
        await fetchMovies(0);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchMovies(newPage);
    };

    const handleAddMovie = () => navigate("/admin/MovieUpload");
    const handleEditMovie = (movieId) => navigate(`/admin/movie/${movieId}/modify`);
    const handleDeleteMovie = async () => {
        if (selectedMovies.length === 0) {
            alert("삭제할 영화를 선택해주세요.");
            return;
        }

        if (window.confirm("선택한 영화를 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`/admin/movie/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedMovies)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                alert("선택한 영화가 삭제되었습니다.");
                setSelectedMovies([]);
                fetchMovies(currentPage);
            } catch (error) {
                console.error("영화 삭제에 실패했습니다:", error);
                alert("영화 삭제에 실패했습니다.");
            }
        }
    };
    const resetSearch = () => {
        setIsSearchActive(false);
        setSearchTerm("");
        setSearchType("title");
        setCurrentPage(0);
        fetchMovies(0);
    };

    const handleCheckboxChange = (movieId) => {
        setSelectedMovies(prev =>
            prev.includes(movieId)
                ? prev.filter(id => id !== movieId)
                : [...prev, movieId]
        );
    };

    const renderPagination = () => {
        const currentGroup = Math.floor(currentPage / pageGroupSize);
        const startPage = currentGroup * pageGroupSize;
        const endPage = Math.min(startPage + pageGroupSize, totalPages);

        const pages = [];

        if (currentGroup > 0) {
            pages.push(
                <button key="prev" onClick={() => handlePageChange(startPage - 1)}>
                    &lt;
                </button>
            );
        }

        for (let i = startPage; i < endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i + 1}
                </button>
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <button key="next" onClick={() => handlePageChange(endPage)}>
                    &gt;
                </button>
            );
        }

        return pages;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!hasPermission) {
        return <div>접근 권한이 없습니다.</div>;
    }

    return (
        <div className="list_div">
            <div className="admin_movie_head">
                <h2>영화 관리</h2>
            </div>
            <div className="admin_movie_search_div">
                <form onSubmit={handleSearch}>
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="title">제목</option>
                        <option value="genre">장르</option>
                        <option value="director">감독</option>
                    </select>
                    <input
                        type="text"
                        placeholder="검색어 입력"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">검색</button>
                </form>
                <button onClick={resetSearch}>검색 초기화</button>
            </div>
            <div className="admin_movie_list">
                <ul className="list content">
                    <li className="checkbox"></li>
                    <li className="movie_id">영화 ID</li>
                    <li className="movie_title">영화 이름</li>
                    <li className="movie_genre">영화 장르</li>
                    <li className="movie_director">영화 감독</li>
                    <li className="movie_time">영화 시간</li>
                </ul>
                {movies.map((movie, index) => (
                    <ul className="list" key={index}>
                        <li className="checkbox">
                            <input
                                type="checkbox"
                                checked={selectedMovies.includes(movie.movieId)}
                                onChange={() => handleCheckboxChange(movie.movieId)}
                            />
                        </li>
                        <li className="movie_id">{movie.movieId}</li>
                        <li className="movie_title">{movie.movieTitle}</li>
                        <li className="movie_genre">{movie.genres}</li>
                        <li className="movie_director">{movie.directors}</li>
                        <li className="movie_time">{movie.runtime}</li>
                        <li>
                            <button onClick={() => handleEditMovie(movie.movieId)}>수정</button>
                        </li>
                    </ul>
                ))}
            </div>
            <div className="list_number">
                {renderPagination()}
            </div>
            <div className="movie_edit_btn">
                <button onClick={handleAddMovie}>영화 추가</button>
                <button onClick={handleDeleteMovie}>영화 삭제</button>
            </div>
        </div>
    );
}

export default AdminMovieListPage;