import React, {useState, useEffect, useCallback, useRef} from "react";
import { useNavigate } from 'react-router-dom';

import styled from "styled-components";
import Pagination from "react-js-pagination";
import axios from "axios";
import SideBar from "./SideBar";
import home from "./images/home.svg";
import CommonTable from './AdminTable/CommonTable';
import CommonTableColumn from './AdminTable/CommonTableColumn';
import CommonTableRow from './AdminTable/CommonTableRow';
import ChatBot from "../../components/ChatBot/ChatBot"

import "./css/Admin.css";
import "./css/AdminMovieList.css";
import "./css/Paging.css";

const AdminMovieList = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [selectedPosters, setSelectedPosters] = useState([]);
    const [selectedTrailers, setSelectedTrailers] = useState([]);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [selectedWatchHistories, setSelectedWatchHistories] = useState([]);
    const [selectedFavorites, setSelectedFavorites] = useState([]);


    const navigate = useNavigate();

    const initializedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    const [sortOrder, setSortOrder] = useState('asc');

    const checkPermission = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/Login');
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
            navigate('/Login');
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

    const fetchMovies = useCallback(async (page = currentPage, term = searchTerm, order = sortOrder) => {
        try {
            const url = '/admin/movie/list/search';
            const params = {
                page: page - 1,
                size: 5,
                sort: `movieId,${order}`,
                searchTerm: term
            };

            const response = await axios.get(url, { params });
            setMovies(response.data.content);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error("영화 데이터를 가져오는 데 실패했습니다:", error);
        }
    }, []);

    useEffect(() => {
        fetchMovies(currentPage, searchTerm, sortOrder);
    }, [fetchMovies, currentPage, searchTerm, sortOrder]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchMovies(1, searchTerm);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchMovies(pageNumber, searchTerm);
    };

    const handleAddMovie = () => navigate("/admin/MovieUpload");
    const handleEditMovie = (movieId) => navigate(`/admin/Movie/${movieId}/modify`);

    const handleCheckboxChange = (movie) => {
        setSelectedMovies(prev =>
            prev.includes(movie.movieId)
                ? prev.filter(id => id !== movie.movieId)
                : [...prev, movie.movieId]
        );

        const posterIds = Array.isArray(movie.posterIds) ? movie.posterIds : [];
        const trailerIds = Array.isArray(movie.trailerIds) ? movie.trailerIds : [];
        const reviewIds = Array.isArray(movie.reviewIds) ? movie.reviewIds : [];
        const watchIds = Array.isArray(movie.watchIds) ? movie.watchIds : [];
        const favorIds = Array.isArray(movie.favorIds) ? movie.favorIds : [];

        setSelectedPosters(prev =>
            prev.some(id => posterIds.includes(id))
                ? prev.filter(id => !posterIds.includes(id))
                : [...prev, ...posterIds]
        );

        setSelectedTrailers(prev =>
            prev.some(id => trailerIds.includes(id))
                ? prev.filter(id => !trailerIds.includes(id))
                : [...prev, ...trailerIds]
        );

        setSelectedReviews(prev =>
            prev.some(id => reviewIds.includes(id))
                ? prev.filter(id => !reviewIds.includes(id))
                : [...prev, ...reviewIds]
        );

        setSelectedWatchHistories(prev =>
            prev.some(id => watchIds.includes(id))
                ? prev.filter(id => !watchIds.includes(id))
                : [...prev, ...watchIds]
        );

        setSelectedFavorites(prev =>
            prev.some(id => favorIds.includes(id))
                ? prev.filter(id => !favorIds.includes(id))
                : [...prev, ...favorIds]
        );
    };

    const handleDeleteMovie = async () => {
        if (selectedMovies.length === 0) {
            alert("삭제할 영화를 선택해주세요.");
            return;
        }

        if (window.confirm("선택한 영화를 삭제하시겠습니까?")) {
            try {
                const params = new URLSearchParams();

                // 모든 ID 배열에 대해 처리
                const idArrays = {
                    posterIds: selectedPosters,
                    trailerIds: selectedTrailers,
                    reviewIds: selectedReviews,
                    watchIds: selectedWatchHistories,
                    favorIds: selectedFavorites
                };

                for (const [key, array] of Object.entries(idArrays)) {
                    if (array.length > 0) {
                        array.forEach(id => params.append(key, id));
                    } else {
                        // 빈 배열인 경우 빈 문자열로 추가
                        params.append(key, '');
                    }
                }

                const url = `/admin/movie/delete?${params.toString()}`;

                await axios.delete(url, {
                    data: selectedMovies
                });

                alert("선택한 영화가 삭제되었습니다.");
                setSelectedMovies([]);
                setSelectedPosters([]);
                setSelectedTrailers([]);
                setSelectedReviews([]);
                setSelectedWatchHistories([]);
                setSelectedFavorites([]);
                fetchMovies(currentPage);
            } catch (error) {
                console.error("영화 삭제에 실패했습니다:", error);
                alert("영화 삭제에 실패했습니다.");
            }
        }
    };

    const toggleSort = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        fetchMovies(currentPage, searchTerm, newOrder);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!hasPermission) {
        return <div>접근 권한이 없습니다.</div>;
    }

    return (
        <Wrap>
            <SideBar />
            <div className="admin_head">
                <img src={home} alt="Home" />
                <h2>관리자페이지</h2>
            </div>
            <div className="admin_movie_head">
                <span>Admin&nbsp;&nbsp;{">"}&nbsp;&nbsp;영화 관리&nbsp;&nbsp;</span>
            </div>
            <div className="wrap_Body">
                <div className="list_div">
                    <WriteSection>


                        <FormBox onSubmit={handleSearch}>
                            <SearchInput
                                type="text"
                                placeholder="제목,장르,감독을 입력하세요."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Button type="submit">검색</Button>
                        </FormBox>
                    </WriteSection>
                    <div className="list_div">
                        <Header>
                            <h2>영화 관리</h2>
                        </Header>
                        <MovieAddDeleteButtonDiv>

                            <button className="botom_write" onClick={handleAddMovie}>
                                <a>등록</a>
                            </button>
                            <button className="botom_delete" onClick={handleDeleteMovie}>
                                <a>삭제</a>
                            </button>
                        </MovieAddDeleteButtonDiv>


                        <CommonTable headersName={[
                            '',
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={toggleSort}>
                                영화 ID
                                <button style={{ marginLeft: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    {sortOrder === 'asc' ? '▲' : '▼'}
                                </button>
                            </div>,
                            '영화 이름',
                            '영화 장르',
                            '영화 감독',
                            '영화 시간',
                            ''
                        ]}>
                            {movies.map((movie, index) => (
                                <CommonTableRow key={index}>
                                    <CommonTableColumn className="Admin_MovieTable_CheckBox">
                                        <input
                                            type="checkbox"
                                            checked={selectedMovies.includes(movie.movieId)}
                                            onChange={() => handleCheckboxChange(movie)}
                                        />
                                        <input type="hidden" name="posterIds"
                                               value={JSON.stringify(movie.posterIds || [])} />
                                        <input type="hidden" name="trailerIds"
                                               value={JSON.stringify(movie.trailerIds || [])} />
                                        <input type="hidden" name="reviewIds"
                                               value={JSON.stringify(movie.reviewIds || [])} />
                                        <input type="hidden" name="watchIds" value={JSON.stringify(movie.watchIds || [])} />
                                        <input type="hidden" name="favorIds" value={JSON.stringify(movie.favorIds || [])} />
                                    </CommonTableColumn>
                                    <CommonTableColumn className="Admin_MovieTable_Id" >{movie.movieId}</CommonTableColumn>
                                    <CommonTableColumn className="Admin_MovieTable_Title" >{movie.movieTitle}</CommonTableColumn>
                                    <CommonTableColumn className="Admin_MovieTable_Genres" >{movie.genres.join(', ')}</CommonTableColumn>
                                    <CommonTableColumn className="Admin_MovieTable_Director" >{movie.directors.join(', ')}</CommonTableColumn>
                                    <CommonTableColumn className="Admin_MovieTable_Runtime" >{movie.runtime}</CommonTableColumn>
                                    <CommonTableColumn>
                                        <EditButton onClick={() => handleEditMovie(movie.movieId)}>수정</EditButton>
                                    </CommonTableColumn>
                                </CommonTableRow>
                            ))}
                        </CommonTable>

                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={5}
                            totalItemsCount={totalItems}
                            pageRangeDisplayed={5}
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
            <ChatBot />
        </Wrap>
    );
};

export default AdminMovieList;

// 스타일 컴포넌트들은 그대로 유지
const FormBox = styled.form`
    // width: 1044px;
    display: flex;
`;

const Wrap = styled.div`

    height: 1000px;
    background: #eee;

`

const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    width: 800px;
    margin-right: 20px;
    padding-left: 20px;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 400;
    line-height: 100%;
    color: #333;
    min-height: 32px;
    background-color: transparent;
    border-bottom: 1px solid rgb(176, 184, 193);
`;

const MovieAddDeleteButtonDiv = styled.div`
    width: 1044px;
    display: flex;
    justify-content: right;
    // border: 1px solid red;
    .botom_write, .botom_delete {
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        // float: right;
        // margin-top: 2px;
        position: relative;
        // bottom: -10px;

        a {
            font-size: 14px;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            cursor: pointer;

            &:hover {
                font-weight: 600;
            }
        }
    }

    .botom_write {
        background-color: #3182f6;
        margin-right: 20px;
    }

    .botom_delete {
        background-color: red;
    }


`



const Button = styled.button`
    width: 140px;
    height: 45px;
    border: 1px solid #cccccc;
    border-radius: 2px;
    background-color: #e5e8eb;
    float: right;
    font-size: 14px;

    &:hover{
        background-color: #1351f9;
        color: #fff;
    }
`;

const Header = styled.div`
    font-family: 'SUIT-Regular' !important;
    font-size: 36px;
    font-weight: 800;
    padding-top: 74px;
    text-align: center;
    width: 1044px;
    margin: 0 auto;

   
`;

const EditButton = styled.button`
    padding: 5px 10px;
    background-color: #ff27a3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background-color: #e61e91;
    }
`;

const WriteSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 74px;
    margin: 0 auto;
    width: 1024px;
    // border-bottom: 1px solid rgb(176, 184, 193);
    
    img{
        width: 26px;
        height: 26px;
        margin-bottom: 10px;
        margin-left: 20px;
        opacity: 0.5;
    }
`;
