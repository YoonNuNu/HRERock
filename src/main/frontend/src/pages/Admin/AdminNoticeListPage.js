import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonTable from '../../components/table/CommonTable';
import CommonTableColumn from '../../components/table/CommonTableColumn';
import CommonTableRow from '../../components/table/CommonTableRow';
import styled from "styled-components";
import Pagination from "react-js-pagination";
import './css/Paging.css';
import search from "./images/search.svg"
import axios from "axios";
import SideBar from './SideBar';

import './css/AdminMemberList.css';

import home from "./images/home.svg";
import ChatBot from '../../components/ChatBot/ChatBot';
// import handleEnterKey from '../../components/handleEnterKey';

function AdminNoticeListPage() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [role, setRole] = useState(null);
    const initializedRef = useRef(false);

    //체크 박스 선택 변수
    const [checkboxSelectAll, setCheckSelectAll] = useState(false);
    const [selectCheckbox, setSelectCheckbox] = useState([]);

    // 검색 상태 변수
    const [isSearching, setIsSearching] = useState(false);

    // 로그인 및 권한 상태 확인
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
            if (error.response && error.response.status === 401) {
                // 401 Unauthorized: 토큰 만료 또는 잘못된 토큰
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem('accessToken'); // 토큰 제거
                navigate('/login');
            } else {
                // 기타 오류
                console.error('Error fetching user info:', error);
                alert("오류가 발생했습니다. 다시 로그인해주세요.");
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);


    // 공지글 내용 불러오기
    const loadBoardList = async (page = 1) => {
        try {
            const response = await axios.get('/user/boardList', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                params: {
                    page: page - 1,
                    size: 10,
                    sort: 'boardId,DESC'
                }
            });

            setBoardList(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);

        }
        catch (error) {
            console.error('Error fetching board:', error);
            alert('공지사항 목록을 불러오는 중 오류가 발생했습니다.')
            navigate("/login");
        }
    };

    // 공지글 검색 기능
    const searchBoards = async (page = 1) => {
        try {
            if (!searchKeyword.trim()) {
                setIsSearching(false);
                loadBoardList(0);
                return;
            }


            const response = await axios.get('/user/boardSearch', {
                params: {
                    page: page - 1,
                    size: 10,
                    sort: 'boardId,DESC',
                    boardTitle: searchKeyword,
                    boardContent: searchKeyword,
                }
            });

            setBoardList(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
            setIsSearching(true);
        }
        catch (error) {
            console.error('Error searching board:', error);
            alert('검색 중 오류가 발생했습니다.');
            navigate(0);
        }
    };

    // 엔터키 기능
    const handleEnterKey = (e) => {
        if(e.key === 'Enter'){
            searchBoards(1);
        }
    }

    // 체크 박스 초기화
    useEffect(() => {
        if (boardList) {
            setSelectCheckbox(new Array(boardList.length).fill(false)); // 초기화
        }
    }, [boardList]);

    // 체크 박스 모두 선택하기
    const handleAllcheck = (e) => {
        const isChecked = e.target.checked;
        setCheckSelectAll(isChecked);

        // 체크 박스 선택 또는 해제
        if (isChecked) {
            setSelectCheckbox(new Array(boardList.length).fill(true));
        } else {
            setSelectCheckbox(new Array(boardList.length).fill(false));
        }

    }

    // 개별 체크 박스 관리 및 동기화
    const handleCheckbox = (index) => {
        const updatedCheckbox = [...selectCheckbox];
        updatedCheckbox[index] = !updatedCheckbox[index];
        setSelectCheckbox(updatedCheckbox);

        //전체 선택 여부를 업데이트
        const allChecked = updatedCheckbox.every(item => item);
        setCheckSelectAll(allChecked);
    }

    //체크 박스 선택해서 삭제
    const deleteSelectedPosts = async () => {
        const selectedBoards = Array.from(document.querySelectorAll('input[name="selectedBoards"]:checked')).map(board => board.value);
        if (selectedBoards.length > 0) {
            try {
                await axios.delete('/admin/listdelete', { data: selectedBoards });
                alert('선택된 게시물들이 삭제되었습니다.');
                loadBoardList(currentPage);
            }
            catch (error) {
                console.error('게시물 삭제 중 오류 발생:', error);
                alert('게시물 삭제 중 오류가 발생했습니다.');

            }
        }
        else {
            alert('삭제할 게시물을 선택하세요.');
        }
    }


    const getUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error("No access Token found");
            }
            const response = await axios.get('/auth/memberinfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.memRole;
        }

        catch (error) {
            console.error('Error fetching member role:', error);
            return null;

        }

    }

    // 권한 확인 후 게시글 불러오기
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            checkPermission();
            console.log("hasPermission: ", hasPermission);

        }
        if (hasPermission) {
            loadBoardList(currentPage);
        }
        // loadBoardList();

        getUserRole().then(role => setRole(role));
    }, [hasPermission]);

    const noticeNumber = (index) => {
        return (currentPage - 1) * 10 + index + 1;
    }

    // 로딩 페이지
    if (isLoading) {
        return (
            <div>
                Loading ...
            </div>
        );
    }

    if (!hasPermission) {
        return null;
    }


    //페이지네이션 ---------------------------

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        console.log("click page:", pageNumber);

        setCurrentPage(pageNumber);
        // 검색할 때
        if (isSearching) {
            searchBoards(pageNumber);
        }
        // 기본 상태
        else {
            loadBoardList(pageNumber);
        }
    };

    return (
        <>
            <div className='wrap'>
                {/* sidebar */}
                <SideBar />
                {/*3.상단 브레드스크럼 메뉴바*/}
                {/*3-1.상단 브레드스크럼 메뉴바*/}
                <div className="admin_head">
                    <img src={home}></img>
                    <h2>관리자페이지</h2>
                </div>
                {/*3-2.상단 브레드스크럼 메뉴바*/}
                <div className="admin_movie_head">
                    <span>Admin&nbsp;&nbsp;{">"}&nbsp;&nbsp;공지 사항&nbsp;&nbsp;</span>
                    {/*<span className="s">></span>*/}
                </div>
                <WriteSection>
                    {/* 검색창 */}
                    <button
                        onClick={() => searchBoards(1)}
                        type='submit'
                    ><img src={search} alt="검색창" /></button>
                    <SearchInput
                        type="text"
                        className="bottom_search_text"
                        placeholder="무엇이든 찾아보세요"
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                        onKeyDown={handleEnterKey}
                    />
                </WriteSection>
                <div className='list_div'>

                    <Header>

                        공지사항

                        {/* 글쓰기 버튼 */}
                        {role === 'ADMIN' && (
                            <>
                                <button
                                    className="botom_write"
                                    type="button"
                                    onClick={() => navigate(`/admin/notice/write`)}
                                >
                                    <a>글쓰기</a>
                                </button>

                                <button
                                    className="botom_write noticeDelete"
                                    type="button"
                                    onClick={deleteSelectedPosts}
                                >
                                    <a>삭제</a>
                                </button>
                            </>
                        )}
                    </Header>

                    {role === 'ADMIN' ? (
                            <CommonTable headersName={[
                                <input
                                    type='checkbox'
                                    checked={checkboxSelectAll}
                                    onChange={handleAllcheck}
                                />,
                                '글번호', '제목', '등록일', '조회수']}>
                                {boardList.length > 0 ? boardList.map((item, index) => (
                                    <CommonTableRow key={index}>
                                        <CommonTableColumn>
                                            <input
                                                type='checkbox'
                                                checked={selectCheckbox[index] || false}
                                                onChange={() => handleCheckbox(index)}
                                                name='selectedBoards'
                                                value={item.boardId}
                                            />
                                        </CommonTableColumn>
                                        <CommonTableColumn>{noticeNumber(item.boardId)}</CommonTableColumn>
                                        <CommonTableColumn>
                                            <Link to={`/user/notice/${item.boardId}`}>{item.boardTitle}</Link>
                                        </CommonTableColumn>
                                        <CommonTableColumn>{item.modifyDate}</CommonTableColumn>
                                        <CommonTableColumn>{item.boardViewCount}</CommonTableColumn>
                                    </CommonTableRow>
                                )) : '공지글이 없습니다'}
                            </CommonTable>
                        ) :
                        (
                            <CommonTable headersName={[
                                '글번호', '제목', '등록일', '조회수']}>
                                {boardList.length > 0 ? boardList.map((item, index) => (
                                    <CommonTableRow key={index}>
                                        <CommonTableColumn>{noticeNumber(index)}</CommonTableColumn>
                                        <CommonTableColumn>
                                            <Link to={`/user/notice/${item.boardId}`}>{item.boardTitle}</Link>
                                        </CommonTableColumn>
                                        <CommonTableColumn>{item.modifyDate}</CommonTableColumn>
                                        <CommonTableColumn>{item.boardViewCount}</CommonTableColumn>
                                    </CommonTableRow>
                                )) : '공지글이 없습니다'}
                            </CommonTable>
                        )}


                    {/* 페이지네이션 컴포넌트 */}
                    <Pagination
                        className="noticepagination"
                        activePage={currentPage} // 현재 페이지
                        itemsCountPerPage={10} // 한 페이지당 아이템 수
                        totalItemsCount={totalPages * 10} // 총 아이템 수
                        pageRangeDisplayed={5} // 페이지네이션의 페이지 범위
                        prevPageText={"‹"}// "이전"을 나타낼 텍스트
                        nextPageText={"›"}// "다음"을 나타낼 텍스트
                        firstPageText={"«"}
                        lastPageText={"»"}
                        onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
                    />
                </div>


            </div>
            <ChatBot />
        </>

    );
};


export default AdminNoticeListPage;
// STYLE ------------------------------
// 검색창+글쓰기 버튼 감싸는 박스
const WriteSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 74px;
    margin: 0 auto;
    width: 1024px;
    border-bottom: 1px solid rgb(176, 184, 193);
    
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
    background: #eee;
`;



const Header = styled.div`
    font-family: 'SUIT-Regular' !important;
    color: rgb(51, 61, 75);
    font-size: 36px;
    font-weight: 800;
    // margin-bottom: 48px;
    padding-top: 74px;
    text-align: left;
    width: 1044px;
    margin: 0 auto;
    // margin-bottom: 48px;

    .name-notice {
        display: flex;
        justify-content: center;
    }
    //글쓰기 버튼
    .botom_write{
        width: 120px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: #3182f6;
        font-size: 14px;
        float: right;
        color: #fff;
        // margin-top: 2px;
        margin-left: 50px;
        position: relative;
        // bottom: -10px;


        &:hover {
            font-weight: 800;
            cursor: pointer;
            //border: 2px solid rgb(51, 61, 75);
            background-color:  #3182f6;;
        }
    }
    // 글 삭제 버튼
    .noticeDelete{
                background-color: red;
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
        // color: rgb(51, 61, 75);

        &:hover {
            cursor: pointer;
            color: #fff;
           font-weight: 600;
        }
    }
`;

