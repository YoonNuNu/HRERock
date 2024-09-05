import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import searchimg from './images/searchimg.png'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import search from "./images/search.svg"
import bullet from "./images/bullet.svg"

import Pagination from "react-js-pagination";
import './css/Paging.css';
import ChatBot from '../../components/ChatBot/ChatBot';



//SearchKeyword
const SearchKeyword = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [topRankMovies, setTopRankMovies] = useState([]); // 상위 랭킹     영화 상태 추가
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '0')); // 페이지 기본값을 0으로 설정
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
    const [currentGroup, setCurrentGroup] = useState(Math.floor(page / 10)); // 현재 페이지 그룹 설정

    const navigate = useNavigate();

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


    //■ HTML ------------------------------------
    return (
        <Wrap>
            <MainContainer>

                <WriteSection>
                    {/*검색창*/}
                    <Link><img src={search} alt="검색창"></img></Link>

                    <SearchInput
                        type="text"
                        className="bottom_search_text"
                        placeholder="무엇이든 찾아보세요"
                        // onChange={handleSearchInput}
                    />
                </WriteSection>



                <Container>
                    {/*포스터.01*/}
                    <SectionTop>영화</SectionTop>

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






                    {/*포스터 감싸는 박스*/}

                    <SectionContainer>
                        <SectionA>
                            <img src={searchimg}></img>
                            <span>[극장판] 짱구는 못말려 23기</span>
                        </SectionA>
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
                    </SectionContainer>
                </Container>


                {/*페이지네이션*/}
                <Pagination
                    className="pagination"
                    activePage={page} // 현재 페이지
                    itemsCountPerPage={1} // 한 페이지랑 보여줄 아이템 갯수
                    totalItemsCount={10} // 총 아이템 갯수
                    pageRangeDisplayed={10} // paginator의 페이지 범위
                    prevPageText={"‹"} // "이전"을 나타낼 텍스트
                    nextPageText={"›"} // "다음"을 나타낼 텍스트
                    onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
                />

            </MainContainer>
            <ChatBot />
        </Wrap>
    );
}
export default SearchKeyword


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
`;


//01.타이틀: 에피소드
const SectionTop = styled.div`
    font-size: 22px;
    line-height: 36px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
    margin-top: 140px;
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
    width: 1044px;

    //margin: 0 auto;
    //margin-top: 40px;
    //padding-bottom: 50px;
    display: flex;
    flex-direction: row;
    gap: 30px;

`;

//타이틀+이미지+하단내용= 감싸는 박스
const SectionA = styled.div`
    width: 240px;
    overflow:hidden;


    span{
        overflow:hidden;
        width: 240px;
        padding-top: 20px;
        color: #a5a5a5;
        font-size: 14px;
        display: table-cell;
        vertical-align: top;
    }

    img{
        width: 240px;
        height: 360px;
        border-radius: 12px;
        will-change: transform;
        background-color: #252525;
        overflow:hidden;

        //호버시,
        &:hover{
            width: 240px;
            height: 360px;
            border-radius: 12px;
            transform: scale(1.1);
            transition: all 0.2s linear;
            overflow:hidden;

        }
    }
`;



// ====================================================================================================
