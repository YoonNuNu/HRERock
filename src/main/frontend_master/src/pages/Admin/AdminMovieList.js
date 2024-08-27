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
    // const [searchType, setSearchType] = useState("title");
    const [selectedMovies, setSelectedMovies] = useState([]);

    const navigate = useNavigate();

    //관리자 권한 인증 확인
    const initializedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    const [sortOrder, setSortOrder] = useState('asc');


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
        fetchMovies(pageNumber, searchTerm); //searchType 필요시
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
                await axios.delete('/admin/movie/delete', { data: selectedMovies });
                alert("선택한 영화가 삭제되었습니다.");
                setSelectedMovies([]);
                fetchMovies(currentPage);
            } catch (error) {
                console.error("영화 삭제에 실패했습니다:", error);
                alert("영화 삭제에 실패했습니다.");
            }
        }
    };

    const handleCheckboxChange = (movieId) => {
        setSelectedMovies(prev =>
            prev.includes(movieId)
                ? prev.filter(id => id !== movieId)
                : [...prev, movieId]
        );
    };

    const toggleSort = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        fetchMovies(currentPage, searchTerm, newOrder);
    };


    return (
        <div className="wrap">
            <SideBar />
            <div className="admin_head">
                <img src={home} alt="Home" />
                <h2>관리자페이지</h2>
            </div>
            <div className="admin_movie_head">
                <span>Admin > 영화 관리</span>
            </div>
            <div className="wrap_Boby">
                <div className="list_div">
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

                    <Header>
                        <h2>영화 관리</h2>
                        <button className="botom_write" onClick={handleAddMovie}>
                            <a>등록</a>
                        </button>
                        <button className="botom_delete" onClick={handleDeleteMovie}>
                            <a>삭제</a>
                        </button>
                    </Header>

                    <CommonTable headersName={[
                        '',
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleSort}>
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
                                <CommonTableColumn>
                                    <input
                                        type="checkbox"
                                        checked={selectedMovies.includes(movie.movieId)}
                                        onChange={() => handleCheckboxChange(movie.movieId)}
                                    />
                                </CommonTableColumn>
                                <CommonTableColumn>{movie.movieId}</CommonTableColumn>
                                <CommonTableColumn>{movie.movieTitle}</CommonTableColumn>
                                <CommonTableColumn>{movie.genres.join(', ')}</CommonTableColumn>
                                <CommonTableColumn>{movie.directors.join(', ')}</CommonTableColumn>
                                <CommonTableColumn>{movie.runtime}</CommonTableColumn>
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
            <ChatBot />
        </div>
    );
};

export default AdminMovieList;


// 검색창 전체 폼
const FormBox = styled.form`
    width: 1044px;
    display: flex;
`;

//Select
const Select = styled.select`
    width: 200px;
    outline: none;
    font-size: 16px;
    text-indent: 10px;
    color: #000;
    border: none;
    background-color: transparent;
    border-bottom: 1px solid rgb(176, 184, 193);
    margin-right: 20px;
`;

//옵션
const Option = styled.option`
    background-color: transparent;
    border: none;
`;


// 검색창 폼
const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    width: 800px;
    margin-right: 20px;
    padding-left: 20px;
    border: none;
    outline: none;
    //caret-color: rgb(49, 130, 246);
    font-size: 16px;
    font-weight: 400;
    line-height: 100%;
    color: #333;
    min-height: 32px;
    background-color: transparent;
    border-bottom: 1px solid rgb(176, 184, 193);
`;

//검색 버튼
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
    margin-bottom: 48px;
    padding-top: 74px;
    text-align: left;
    width: 1044px;
    margin: 0 auto;
    margin-bottom: 48px;

    .name-notice {
        display: flex;
        justify-content: center;
    }
    //01.등록 버튼
    .botom_write{
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: #3182f6;
        float: right;
        margin-top: 2px;
        position: relative;
        bottom: -10px;
        &:hover {
            cursor: pointer;
            //border: 2px solid rgb(51, 61, 75);
            background-color:  #3182f6;;
        }
    }

    .botom_write a{
        font-size: 14px;
        color: #fff;
        //padding: 10px 25px;
        text-align: center;
        display: flex;
        justify-content: center;
        cursor: pointer;

        &:hover {
            cursor: pointer;
            color: #fff;
           font-weight: 600;
        }
    }
    //02.수정 버튼
    .botom_Edit{
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: #ff27a3;
        margin-right: 20px;

        float: right;
        margin-top: 2px;
        position: relative;
        bottom: -10px;
        &:hover {
            cursor: pointer;
            //border: 2px solid rgb(51, 61, 75);
            background-color:  #3182f6;;
        }
    }
    .botom_Edit a{
        font-size: 14px;
        color: #fff;
        //padding: 10px 25px;
        text-align: center;
        display: flex;
        justify-content: center;
        cursor: pointer;

        &:hover {
            cursor: pointer;
            color: #fff;
            font-weight: 600;
        }
    }

    //03.삭제 버튼
    .botom_delete{
        margin-right: 20px;
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: red;
        float: right;
        margin-top: 2px;
        position: relative;
        bottom: -10px;

        &:hover {
            cursor: pointer;
            //border: 2px solid rgb(51, 61, 75);
            background-color:  #3182f6;;
        }
    }

    .botom_delete a{
        font-size: 14px;
        color: #fff;
        //padding: 10px 25px;
        text-align: center;
        display: flex;
        justify-content: center;
        cursor: pointer;
        color: #fff;

        &:hover {
            cursor: pointer;
            color: #fff;
            font-weight: 600;
        }
    }
`;

const CheckboxInput = styled.input`
    margin: 0;
    cursor: pointer;
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



// Styled components remain unchanged

// import React, {useState, useEffect, useCallback, useRef} from "react";
// import {Link, useNavigate} from 'react-router-dom';
//
// import "./css/Admin.css";
// import useCheckGroup from "./useCheckGroup";
//
// //css
// import './css/AdminMovieList.css';
// import './css/Paging.css';
// import styled from "styled-components";
//
// import Pagination from "react-js-pagination";
// import axios from "axios";
// import SideBar from "./SideBar";
//
// //img
// import home from "./images/home.svg";
// import search from "./images/search.svg"
//
//
// //테이블
// import CommonTable from './AdminTable/CommonTable';
// import CommonTableColumn from './AdminTable/CommonTableColumn';
// import CommonTableRow from './AdminTable/CommonTableRow';
// import {postList} from '../../Admin';
//
//
//
//
//
//
// // ■admin/movieList ---------------------------------------------
// const AdminMovieList = ({postsPerPage, totalPosts, paginate}) => {
//
//     const [checkedItems, setCheckedItems] = useState([]);
//
//     const onChangeCheckBox = (e, item) => {
//         const isChecked = e.target.checked;
//         setCheckedItems((prevCheckedItems) => {
//             if (isChecked) {
//                 return [...prevCheckedItems, item.no];
//             } else {
//                 return prevCheckedItems.filter((no) => no !== item.no);
//             }
//         });
//     };
//
//     //변수
//     const [movies, setMovies] = useState([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [searchType, setSearchType] = useState("title");
//     const [isSearchActive, setIsSearchActive] = useState(false);
//     const [selectedMovies, setSelectedMovies] = useState([]);
//
//
//     //검색---------------------------
//     const handleSearchInput = e => setSearchInput(e.target.value);
//     const [searchInput,setSearchInput] = useState('');
//
//
//     //페이지네이션 ---------------------------
//     const [page, setPage] = useState(1);
//
//     const handlePageChange = (page) => {
//         setPage(page);
//     };
//
//     const pageNumbers = [];
//     for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
//         pageNumbers.push(i);
//     }
//
//     //★연습용 Data.js ---------------------------
//     const [dataList, setDataList] = useState([]);
//
//     useEffect(() => {
//         setDataList(postList);
//     }, [])
//
//
//     //관리자 권한 인증 확인
//     // const initializedRef = useRef(false);
//     // const [isLoading, setIsLoading] = useState(true);
//     // const [hasPermission, setHasPermission] = useState(false);
//
//     const navigate = useNavigate();
//
//     const pageGroupSize = 10;
//
//     //인증
//     // const checkPermission = useCallback(async () => {
//     //     const token = localStorage.getItem('accessToken');
//     //     if (!token) {
//     //         alert("로그인이 필요합니다.");
//     //         navigate('/login');
//     //         return;
//     //     }
//     //
//     //     try {
//     //         const response = await axios.get('/auth/memberinfo', {
//     //             headers: { 'Authorization': 'Bearer ' + token }
//     //         });
//     //         const role = response.data.memRole;
//     //         if (role === 'ADMIN') {
//     //             setHasPermission(true);
//     //         } else {
//     //             alert("권한이 없습니다.");
//     //             navigate('/');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching user info:', error);
//     //         alert("오류가 발생했습니다. 다시 로그인해주세요.");
//     //         navigate('/login');
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // }, [navigate]);
//     //
//     // useEffect(() => {
//     //     if (!initializedRef.current) {
//     //         initializedRef.current = true;
//     //         checkPermission();
//     //     }
//     // }, [checkPermission]);
//
//     const fetchMovies = useCallback(async (page = currentPage) => {
//         try {
//             let url;
//             if (isSearchActive && searchTerm) {
//                 const params = new URLSearchParams({
//                     page: page.toString(),
//                     size: '10',
//                     sort: 'movieId,asc',
//                     movieTitle: '',
//                     movieGenres: '',
//                     directorName: ''
//                 });
//                 switch (searchType) {
//                     case "title":
//                         params.set("movieTitle", searchTerm);
//                         break;
//                     case "genre":
//                         params.set("movieGenres", searchTerm);
//                         break;
//                     case "director":
//                         params.set("directorName", searchTerm);
//                         break;
//                     default:
//                         params.set("movieTitle", searchTerm);
//                 }
//                 url = `/admin/movie/list/search?${params}`;
//             } else {
//                 url = `/admin/movie/movielist?page=${page}&size=10&sort=movieId,asc`;
//             }
//
//             console.log("Fetching URL:", url);
//
//             const response = await fetch(url);
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Network response was not ok: ${errorText}`);
//             }
//             const data = await response.json();
//             console.log("Fetched data:", data);
//             setMovies(data.content);
//             setTotalPages(data.totalPages);
//         } catch (error) {
//             console.error("영화 데이터를 가져오는 데 실패했습니다:", error);
//         }
//     }, [currentPage, isSearchActive, searchTerm, searchType]);
//
//     useEffect(() => {
//         if (!isSearchActive) {
//             fetchMovies();
//         }
//     }, [fetchMovies, isSearchActive]);
//
//     const handleSearch = async (e) => {
//         e.preventDefault();
//         setIsSearchActive(true);
//         setCurrentPage(0);
//         await fetchMovies(0);
//     };
//
//
//     // const handlePageChange = (newPage) => {
//     //     setCurrentPage(newPage);
//     //     fetchMovies(newPage);
//     // };
//
//     const handleAddMovie = () => navigate("/admin/MovieUpload");
//     const handleEditMovie = (movieId) => navigate(`/admin/movie/${movieId}/modify`);
//     const handleDeleteMovie = async () => {
//         if (selectedMovies.length === 0) {
//             alert("삭제할 영화를 선택해주세요.");
//             return;
//         }
//
//         if (window.confirm("선택한 영화를 삭제하시겠습니까?")) {
//             try {
//                 const response = await fetch(`/admin/movie/delete`, {
//                     method: 'DELETE', headers: {
//                         'Content-Type': 'application/json',
//                     }, body: JSON.stringify(selectedMovies)
//                 });
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 alert("선택한 영화가 삭제되었습니다.");
//                 setSelectedMovies([]);
//                 fetchMovies(currentPage);
//             } catch (error) {
//                 console.error("영화 삭제에 실패했습니다:", error);
//                 alert("영화 삭제에 실패했습니다.");
//             }
//         }
//     };
//     const resetSearch = () => {
//         setIsSearchActive(false);
//         setSearchTerm("");
//         setSearchType("title");
//         setCurrentPage(0);
//         fetchMovies(0);
//     };
//
//     const handleCheckboxChange = (movieId) => {
//         setSelectedMovies(prev => prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]);
//     };
//
//     const renderPagination = () => {
//         const currentGroup = Math.floor(currentPage / pageGroupSize);
//         const startPage = currentGroup * pageGroupSize;
//         const endPage = Math.min(startPage + pageGroupSize, totalPages);
//
//         const pages = [];
//
//         if (currentGroup > 0) {
//             pages.push(<button key="prev" onClick={() => handlePageChange(startPage - 1)}>
//                 &lt;
//             </button>);
//         }
//
//         for (let i = startPage; i < endPage; i++) {
//             pages.push(<button
//                 key={i}
//                 onClick={() => handlePageChange(i)}
//                 className={currentPage === i ? 'active' : ''}
//             >
//                 {i + 1}
//             </button>);
//         }
//
//         if (endPage < totalPages) {
//             pages.push(<button key="next" onClick={() => handlePageChange(endPage)}>
//                 &gt;
//             </button>);
//         }
//
//         return pages;
//     };
//
//     // if (isLoading) {
//     //     return <div>Loading...</div>;
//     // }
//
//     // if (!hasPermission) {
//     //     return <div>접근 권한이 없습니다.</div>;
//     // }
//
//
//
//
//
//     //■ html ---------------------------------
//     return (
//         //1.전체 박스
//         <div className="wrap">
//             {/*2.왼쪽 사이드 메뉴바*/}
//             <SideBar/>
//
//             {/*3.상단 브레드스크럼 메뉴바*/}
//             {/*3-1.상단 브레드스크럼 메뉴바*/}
//             <div className="admin_head">
//                     <img src={home}></img>
//                     <h2>관리자페이지</h2>
//             </div>
//             {/*3-2.상단 브레드스크럼 메뉴바*/}
//             <div className="admin_movie_head">
//                 <span>Admin&nbsp;&nbsp;>&nbsp;&nbsp;영화 관리&nbsp;&nbsp;</span>
//                 {/*<span className="s">></span>*/}
//             </div>
//
//
//
//             {/*04.바디 박스*/}
//             <div className="wrap_Boby">
//                 {/*05.컨텐츠 박스*/}
//                 <div className="list_div">
//                     {/*6.검색 + 옵션*/}
//                     <FormBox onSubmit="">
//                         {/*6-1.옵션*/}
//                         <Select
//                             value={searchType}
//                             onChange={(e) => setSearchType(e.target.value)}
//                         >
//                             <Option
//                                 className="option-btn"
//                                 value="title">제목</Option>
//
//                             <Option
//                                 className="option-btn"
//                                 value="genre">장르</Option>
//
//                             <Option
//                                 className="option-btn"
//                                 value="director">감독</Option>
//                         </Select>
//
//                         {/*6-2.검색창*/}
//                         <SearchInput
//                             type="text"
//                             className="bottom_search_text"
//                             placeholder="검색어 입력"
//                             onChange={handleSearchInput}
//                         />
//
//                         {/*6-3.검색 버튼*/}
//                         <Button
//                             className="search_submit"
//                             type="submit">검색
//                         </Button>
//                     </FormBox>
//
//
//                     {/*7.바디: 제목+ 버튼+ 테이블*/}
//                         {/*제목*/}
//                         <Header>
//                             <h2 className="name-notice"/>영화 관리
//
//                             {/* <!-- 버튼 --> */}
//
//                             {/*수정 버튼*/}
//                             <button
//                                 className="botom_write"
//                                 type="button"
//                                 onClick={() => {
//                                     navigate(`/`);
//                                 }}
//                             >
//                                 <a>등록</a>
//                             </button>
//
//                             {/*수정 버튼*/}
//                             <button
//                                 className="botom_Edit"
//                                 type="button"
//                                 onClick={() => {
//                                     navigate(`/`);
//                                 }}
//                             >
//                                 <a>수정</a>
//                             </button>
//
//                             {/*삭제 버튼*/}
//                             <button
//                                 className="botom_delete"
//                                 type="button"
//                                 onClick={() => {
//                                     navigate(`/`);
//                                 }}
//                             >
//                                 <a>삭제</a>
//                             </button>
//                         </Header>
//
//
//                         {/*테이블*/}
//                         <CommonTable
//                             headersName={['영화 ID', '영화 이름', '영화 장르', '영화 감독', '영화 시간']}>
//
//                             {dataList ? dataList.map((item, index) => {
//                                 return (
//
//                                     <CommonTableRow key={index}>
//                                         <CommonTableColumn>{item.no}</CommonTableColumn>
//                                         <CommonTableColumn>{item.title}</CommonTableColumn>
//                                         <CommonTableColumn>{item.genre}</CommonTableColumn>
//                                         <CommonTableColumn>{item.director}</CommonTableColumn>
//                                         <CommonTableColumn>{item.createDate}</CommonTableColumn>
//
//                                     </CommonTableRow>
//                                 )
//                             }) : ''}
//                         </CommonTable>
//
//
//
//                     {/*6.페이지 네이션*/}
//                     <Pagination
//                         className="pagination"
//                         activePage={page} // 현재 페이지
//                         itemsCountPerPage={1} // 한 페이지랑 보여줄 아이템 갯수
//                         totalItemsCount={10} // 총 아이템 갯수
//                         pageRangeDisplayed={10} // paginator의 페이지 범위
//                         prevPageText={"‹"} // "이전"을 나타낼 텍스트
//                         nextPageText={"›"} // "다음"을 나타낼 텍스트
//                         onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
//                     />
//
//                 </div>
//             </div>
//         </div>
//     );
// };export default AdminMovieList;
//
//
//
//
//
//
//
// // 검색창 전체 폼
// const FormBox = styled.form`
//   width: 1044px;
//     display: flex;
// `;
//
// //Select
// const Select = styled.select`
//     width: 200px;
//     outline: none;
//     font-size: 16px;
//     text-indent: 10px;
//     color: #000;
//     border: none;
//     background-color: transparent;
//     border-bottom: 1px solid rgb(176, 184, 193);
//     margin-right: 20px;
// `;
//
// //옵션
// const Option = styled.option`
//     background-color: transparent;
//     border: none;
// `;
//
//
// // 검색창 폼
// const SearchInput = styled.input`
//     display: flex;
//     justify-content: center;
//     width: 800px;
//     margin-right: 20px;
//
//     padding-left: 20px;
//     border: none;
//     outline: none;
//     //caret-color: rgb(49, 130, 246);
//     font-size: 16px;
//     font-weight: 400;
//     line-height: 100%;
//     color: #333;
//     min-height: 32px;
//     background-color: transparent;
//     border-bottom: 1px solid rgb(176, 184, 193);
// `;
//
// //검색 버튼
// const Button = styled.button`
//     width: 140px;
//     height: 45px;
//     border: 1px solid #cccccc;
//     border-radius: 2px;
//     background-color: #e5e8eb;
//     float: right;
//     font-size: 14px;
//
//     &:hover{
//         background-color: #1351f9;
//         color: #fff;
//     }
//
// `;
//
//
// const Header = styled.div`
//     font-family: 'SUIT-Regular' !important;
//     font-size: 36px;
//     font-weight: 800;
//     margin-bottom: 48px;
//     padding-top: 74px;
//     text-align: left;
//     width: 1044px;
//     margin: 0 auto;
//     margin-bottom: 48px;
//
//     .name-notice {
//         display: flex;
//         justify-content: center;
//     }
//     //01.등록 버튼
//     .botom_write{
//         width: 90px;
//         height: 45px;
//         border: 1px solid #cccccc;
//         border-radius: 2px;
//         background-color: #3182f6;
//         float: right;
//         margin-top: 2px;
//         position: relative;
//         bottom: -10px;
//         &:hover {
//             cursor: pointer;
//             //border: 2px solid rgb(51, 61, 75);
//             background-color:  #3182f6;;
//         }
//     }
//
//     .botom_write a{
//         font-size: 14px;
//         color: #fff;
//         //padding: 10px 25px;
//         text-align: center;
//         display: flex;
//         justify-content: center;
//         cursor: pointer;
//
//         &:hover {
//             cursor: pointer;
//             color: #fff;
//            font-weight: 600;
//         }
//     }
//     //02.수정 버튼
//     .botom_Edit{
//         width: 90px;
//         height: 45px;
//         border: 1px solid #cccccc;
//         border-radius: 2px;
//         background-color: #ff27a3;
//         margin-right: 20px;
//
//         float: right;
//         margin-top: 2px;
//         position: relative;
//         bottom: -10px;
//         &:hover {
//             cursor: pointer;
//             //border: 2px solid rgb(51, 61, 75);
//             background-color:  #3182f6;;
//         }
//     }
//     .botom_Edit a{
//         font-size: 14px;
//         color: #fff;
//         //padding: 10px 25px;
//         text-align: center;
//         display: flex;
//         justify-content: center;
//         cursor: pointer;
//
//         &:hover {
//             cursor: pointer;
//             color: #fff;
//             font-weight: 600;
//         }
//     }
//
//     //03.삭제 버튼
//     .botom_delete{
//         margin-right: 20px;
//         width: 90px;
//         height: 45px;
//         border: 1px solid #cccccc;
//         border-radius: 2px;
//         background-color: red;
//         float: right;
//         margin-top: 2px;
//         position: relative;
//         bottom: -10px;
//
//         &:hover {
//             cursor: pointer;
//             //border: 2px solid rgb(51, 61, 75);
//             background-color:  #3182f6;;
//         }
//     }
//
//     .botom_delete a{
//         font-size: 14px;
//         color: #fff;
//         //padding: 10px 25px;
//         text-align: center;
//         display: flex;
//         justify-content: center;
//         cursor: pointer;
//         color: #fff;
//
//         &:hover {
//             cursor: pointer;
//             color: #fff;
//             font-weight: 600;
//         }
//     }
//
// `;
