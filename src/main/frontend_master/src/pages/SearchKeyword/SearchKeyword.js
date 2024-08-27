import React, {useState} from 'react';
import styled from 'styled-components';
import searchimg from './images/searchimg.png'
import {Link, useNavigate} from 'react-router-dom';
import search from "./images/search.svg"
import bullet from "./images/bullet.svg"

import Pagination from "react-js-pagination";
import './css/Paging.css';



//SearchKeyword
const SearchKeyword = ({postsPerPage, totalPosts, paginate}) => {

    //★네비 ---------------------------
    const navigate = useNavigate();


    //검색---------------------------
    const handleSearchInput = e => setSearchInput(e.target.value);
    const [searchInput,setSearchInput] = useState('');


    //★페이지네이션 ---------------------------
    const [page, setPage] = useState(1);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    //■ HTML ------------------------------------
    return (<Wrap>
            <MainContainer>

                <WriteSection>
                    {/*검색창*/}
                    <Link><img src={search} alt="검색창"></img></Link>

                    <SearchInput
                        type="text"
                        className="bottom_search_text"
                        placeholder="무엇이든 찾아보세요"
                        onChange={handleSearchInput}
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
                        <SectionA>
                            <img src={searchimg}></img>
                            <span>[극장판] 짱구는 못말려 23기</span>
                        </SectionA>
                        <SectionA>
                            <img src={searchimg}></img>
                            <span>[극장판] 짱구는 못말려 23기</span>
                        </SectionA>
                        <SectionA>
                            <img src={searchimg}></img>
                            <span>[극장판] 짱구는 못말려 23기</span>
                        </SectionA>
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


const SectionBottom = styled.div`
    width: 240px;
    color: #a5a5a5;
    font-size: 14px;
    display: table-cell;
    vertical-align: top;
`;