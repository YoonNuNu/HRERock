import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import '../css/Header.css';
import ChatBot from '../../components/ChatBot/ChatBot';
import styled from 'styled-components';
import Pagination from "react-js-pagination";

import search from "./images/search.svg"
import bullet from "./images/bullet.svg"
import axios from 'axios';
import searchimg from './images/searchimg.png'

// 검색 페이지
function MovieSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [topRankMovies, setTopRankMovies] = useState([]); // 상위 랭킹     영화 상태 추가
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '0')); // 페이지 기본값을 0으로 설정
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
    const [currentGroup, setCurrentGroup] = useState(Math.floor(page / 10)); // 현재 페이지 그룹 설정
    const [searchInput, setSearchInput] = useState(""); // 검색 입력 상태 추가

    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    // 로그인 체크
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(!token){
            alert("로그인이 필요한 페이지입니다. 로그인부터 해주세요");
            navigate("/login");

        }

    })


    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams(searchParams.toString());
                queryParams.set('page', page);
                console.log('쿼리 파라미터:', queryParams.toString());
                const response = await axios.get(`/user/MovieSearch?${queryParams.toString()}`);
                const data = response.data;
                console.log('응답 데이터:', data); // 응답 데이터 확인
                setMovies(Array.isArray(data.content) ? data.content : []);
                setTotalPages(data.totalPages || 1);
                console.log('업데이트된 movies 상태:', data.content); // 상태 설정 후 로그
            } catch (err) {
                if (err.response) {
                    console.error('서버 응답 에러:', err.response);
                    setError('검색 요청 실패');
                } else if (err.request) {
                    console.error('요청 에러:', err.request);
                    setError('서버 오류');
                } else {
                    console.error('일반 에러:', err.message);
                    setError('요청 중 오류 발생');
                }
            } finally {
                setLoading(false);
            }
        };


        fetchMovies();
    }, [searchParams, page]);


    // 영화 검색 랭킹 기능
    useEffect(() => {
        const fetchTopRankMovies = async () => {
            try {
                const response = await axios.get('/user/TopRankMovies');
                console.log('서버 응답:', response); // 응답 확인

                const data = response.data;
                console.log("fetchTopRankMovies data:", data);


                // 데이터가 존재하고, 기대하는 구조인지 확인
                if (data && Array.isArray(data.content)) {
                    setTopRankMovies(data.content);
                } else {
                    console.error("데이터 구조가 예상과 다릅니다.");
                    setError('상위 랭킹 영화 데이터를 처리하는 중 문제가 발생했습니다.');
                }
            } catch (err) {
                console.error("fetchTopRankMovies error:", err);
                setError(err.message || '상위 랭킹 영화 요청 실패');
            }
        };

        fetchTopRankMovies();
    }, []);


    useEffect(() => {
        setCurrentGroup(Math.floor(page / 10));
    }, [page]);

    // 페이지 관리
    const handlePageChange = (newPage) => {
        setPage(newPage - 1);
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams.toString());
            newParams.set('page', newPage - 1);
            return newParams;
        });
    };

    // 검색 기능
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // 입력된 검색어를 쉼표로 구분하여 배열로 변환
        const terms = searchTerm.split(',').map(term => term.trim()).filter(term => term !== '');

        // URLSearchParams 객체 생성
        const params = new URLSearchParams();

        // 각 검색어를 파라미터에 추가 (최대 4개까지)
        if (terms.length > 0) params.append('movieTitle', terms[0]);
        if (terms.length > 1) params.append('movieDirectors', terms[1]);
        if (terms.length > 2) params.append('movieActors', terms[2]);
        if (terms.length > 3) params.append('genres', terms[3]);

        // 쿼리 파라미터를 포함한 URL 생성
        const url = `/user/MovieSearch?${params.toString()}`;
        console.log('검색 URL:', url); // 디버깅 용
        // url로 이동
        navigate(url);
    };


    // 검색 창 변경 확인
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    // 페이지 앞으로가기
    const handleNextGroup = () => {
        const nextGroupStartPage = (currentGroup + 1) * 10;
        if (nextGroupStartPage < totalPages) {
            setCurrentGroup(currentGroup + 1);
            handlePageChange(nextGroupStartPage);
        }
    };

    // 페이지 뒤로 가기
    const handlePrevGroup = () => {
        if (currentGroup > 0) {
            const prevGroupStartPage = (currentGroup - 1) * 10;
            setCurrentGroup(currentGroup - 1);
            handlePageChange(prevGroupStartPage);
        }
    };

    // pagination 버튼 기능 (지금 외부 라이브러리 Pagination 쓰고 있음)
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
                        {"<"}
                    </button>
                )}
                {pageButtons}
                {endPage < totalPages && (
                    <button onClick={handleNextGroup}>
                        {">"}
                    </button>
                )}
            </div>
        );
    };


    // 로그 확인용
    useEffect(() => {
        console.log('Current movies:', movies);
        console.log('Number of movies:', movies.length);
    }, [movies]);

    useEffect(() => {
        console.log('Top Rank Movies:', topRankMovies); // 상태가 올바르게 업데이트되는지 확인
    }, [topRankMovies]);

    // html 시작 ================
    return (
        <>

            {loading && <p>검색 중...</p>}
            {error && <p className="error">{error}</p>}
            <WriteSection>
                <form onSubmit={handleSearchSubmit}>

                    {/*검색창*/}
                    <MovieSearchButton
                        type="submit"
                        onClick={() => setSearchParams({ query: searchInput })}
                    ><img src={search} alt="검색창" />
                    </MovieSearchButton>

                    <SearchInput
                        type="text"
                        className="bottom_search_text"
                        value={searchTerm} // 입력 필드에 상태 연결
                        onChange={handleSearchChange} // 입력값 변경 시 상태 업데이트
                        placeholder="검색 예: title:Inception, director:Nolan, actor:DiCaprio, genre:Sci-Fi"
                    />
                </form>
            </WriteSection>

            {/* ============================================================== */}
            <Wrap>
                <MainContainer>

                    <Container>
                        {/*포스터.01*/}
                        <SectionTop>영화 검색 결과</SectionTop>
                        {false &&(

                            <SectionR>
                                {/*버튼*/}
                                <button
                                    className="button"
                                    type="button"
                                    onClick={() => {
                                        navigate(`/`);
                                    }}
                                >
                                    <img className="bullet" src={bullet}></img>
                                    <a className="button">전체보기</a>
                                    {/*<a>전체검색결과 돌아가기&nbsp;&nbsp;> </a>*/}
                                </button>
                            </SectionR>
                        )}






                        {/*포스터 감싸는 박스*/}

                        <SectionContainer>
                            {movies.map((movie) => (
                                <>
                                    <SectionA>
                                        <Link key={movie.movieId} to={`/user/MoviePage/${movie.movieId}`}>
                                            <figure className="movie_figure">
                                                {movie.posters && movie.posters.length > 0 ? (
                                                    movie.posters.map((poster, index) => (
                                                        <img
                                                            key={index}
                                                            src={poster.posterUrls}
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
                                    </SectionA>


                                </>
                            ))}
                        </SectionContainer>




                    </Container>


                    {/*페이지네이션*/}
                    <Pagination
                        className="pagination"
                        activePage={page + 1} // 현재 페이지 (페이지네이션 라이브러리는 1부터 시작하므로 +1)
                        itemsCountPerPage={10} // 한 페이지에 보여줄 아이템 수
                        totalItemsCount={totalPages * 10} // 총 아이템 수 (페이지 수 * 페이지당 아이템 수)
                        pageRangeDisplayed={10} // 표시할 페이지 버튼의 범위
                        prevPageText={"‹"} // 이전 페이지 텍스트
                        nextPageText={"›"} // 다음 페이지 텍스트
                        onChange={handlePageChange} // 페이지 변경 핸들러
                    />



                </MainContainer>
                <TopRankMoviesDiv>
                    <h2>상위 검색 순위</h2>
                    {topRankMovies.length > 0 ? (
                        <TopRankMoviesUl>
                            {topRankMovies.map((movie) => (
                                <TopRankMoviesLi key={movie.movieId}>
                                    <Link to={`/user/MoviePage/${movie.movieId}`}>

                                        {movie.posters && movie.posters.length > 0 ? (
                                            movie.posters.map((poster, index) => (
                                                <TopRankMoviesPoster
                                                    key={index}
                                                    src={poster.posterUrls}
                                                    alt={movie.movieTitle}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <TopRankMoviesPoster
                                                src='https://via.placeholder.com/500x750?text=No+Image'
                                                alt={movie.movieTitle}
                                            />
                                        )}
                                        <figcaption >
                                            {movie.movieTitle}
                                        </figcaption>
                                    </Link>
                                </TopRankMoviesLi>
                            ))}
                        </TopRankMoviesUl>
                    ) : (
                        <p>상위 랭킹 영화가 없습니다.</p>
                    )}
                </TopRankMoviesDiv>
                <ChatBot />
            </Wrap>
        </>
    );
}

export default MovieSearch;


const Wrap = styled.div`
    width: 100%;
    //height: 100vh;
    //background-color: #fff !important;
`;

const MainContainer = styled.div`
    width: 1044px;
    margin: 0 auto;
`;

//컨테이너 전체 감싸는 박스
const Container = styled.div`
    width: 1044px;
    margin: 0 auto;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 검색창+글쓰기 버튼 감싸는 박스
const WriteSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 74px;
    margin: 0 auto;
    width: 1024px;
    border-bottom: 1px solid rgb(176, 184, 193);
    background-color: transparent;
    
    
    img{
        width: 26px;
        height: 26px;
        margin-bottom: 10px;
        margin-left: 20px;
        opacity: 0.5;
    }
    form{
        display: flex;
    }
`;

// 검색창
const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    width: 1024px;
    padding-bottom: 16px;
    padding-left: 20px;
    border: none;
    outline: none;
    //caret-color: rgb(49, 130, 246);
    font-size: 18px;
    font-weight: 400;
    line-height: 130%;
    color: #333;
    min-height: 32px;
    background-color: transparent;
    color: white;
`;


//01.타이틀: 에피소드
const SectionTop = styled.div`
  font-size: 22px;
    line-height: 36px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
    margin-top: 100px;
    margin-bottom: 15px;
`;

//오른쪽 더보기 버튼
const SectionR = styled.div`
    float: right;
    
    .button {
        font-size: 16px;
        line-height: 24px;
        color: #a5a5a5;
        padding: 5px 5px 5px 0;
        margin-bottom: 10px;
    }  
       
    .bullet{
        width: 20px;
        margin: 4px 10px;
    }
    
    &:hover{
        font-weight: 600;
        color: #fff;
        }
    
`;


//포스터 감싸는 전체 박스
const SectionContainer = styled.div`
    width: 1300px;
    
    //margin: 0 auto;
    //margin-top: 40px;
    //padding-bottom: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    // gap: 30px;

`;

//타이틀+이미지+하단내용= 감싸는 박스
const SectionA = styled.div`
    width: 240px;
    // overflow:hidden;

    
    span{
        overflow:hidden;
        width: 240px;
        padding-top: 20px;
        color: #a5a5a5;
        font-size: 14px;
        display: table-cell;
        vertical-align: top;
    }
    .movie_figure{
        // width: 300px;

        }
        
        figcaption{
        text-align: center;
        overflow:hidden;
        width: 200px;
        padding-top: 20px;
        color: #a5a5a5;
        font-size: 17px;
        display: table-cell;
        vertical-align: top;
        }

        img{
        // border: 1px solid red;
        width: 200px;
        height: 300px;
        border-radius: 12px;
        will-change: transform;
        background-color: #252525;
        overflow:hidden;
        transition: transform 0.3s ease;

        //호버시,
        &:hover{
            transform: scale(1.1);
        }
    }
`;


const MovieSearchButton = styled.button`

`

const TopRankMoviesDiv = styled.div`
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    
    h2{
        color: #fff;
        font-size: 2rem;
        margin-bottom: 10px;
    }
    
`

// 검색 랭킹 ul
const TopRankMoviesUl = styled.ul`
    width: 1300px;
    // border: 1px solid white;
    display: flex;  
    flex-wrap: wrap;
    justify-content: center;
`
// 검색 랭킹 li
const TopRankMoviesLi = styled.li`
        display: flex;  
        flex-direction: column;
        margin-right: 30px;
        margin-bottom: 20px;

    figcaption{

        text-align: center;
        overflow:hidden;
        width: 200px;
        padding-bottom: 20px;
        padding-top: 10px;
        color: #a5a5a5;
        font-size: 17px;
        display: table-cell;
        vertical-align: top;
    }
`
// 검색 랭킹 img
const TopRankMoviesPoster = styled.img`
    width: 200px;
    height: 300px;
    border-radius: 12px;
    // border: 1px solid red;
    transition: transform 0.3s ease;

            //호버시,
        &:hover{
            transform: scale(1.1);
            overflow:hidden;
            
        }

`



// ====================================================================================================
