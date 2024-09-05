import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import './css/AdminMemberList.css';
import styled from "styled-components"
import SideBar from "./SideBar";

//img
import home from "./images/home.svg";
import Pagination from "react-js-pagination";
import ChatBot from "../../components/ChatBot/ChatBot";
import {  useNavigate } from "react-router-dom";


function AdminMemberListPage() {

    const [members, setMembers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedMembers, setSelectedMembers] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [hasPermission, setHasPermission] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const initializedRef = useRef(false);


    useEffect(() => {
        fetchMembers();
    }, [currentPage, searchTerm]);

    // 권한 확인 후 게시글 불러오기
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            checkPermission();
            console.log("hasPermission: ", hasPermission);

        }
        if (hasPermission) {
            fetchMembers(currentPage);
        }



    }, [hasPermission]);


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


    // 회원 목록 가져오는 로직
    const fetchMembers = async () => {
        try {
            const response = await axios.get(`/admin/members/search?term=${searchTerm}`);
            const allMembers = response.data; // 전체 검색 결과를 가져옴

            // 페이지네이션 처리
            const startIndex = (currentPage - 1) * 10;
            const endIndex = startIndex + 10;
            const pagedMembers = allMembers.slice(startIndex, endIndex);

            setMembers(pagedMembers); // 현재 페이지의 회원 목록 업데이트
            setTotalPages(Math.ceil(allMembers.length / 10)); // 총 페이지 수 업데이트
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };



    // 회원 검색 로직
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/admin/members/search?term=${searchTerm}`);
            setMembers(response.data);
        }
        catch (error) {
            console.error("Error searching members:", error);
        }

    }


    // 전체 선택 체크박스 핸들러
    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedMembers(members.map(member => member.memNum));
        } else {
            setSelectedMembers([]);
        }
    };

    // 개별 체크박스 핸들러
    const handleCheckboxChange = (memNum) => {
        setSelectedMembers(prev => {
            const newSelection = prev.includes(memNum)
                ? prev.filter(id => id !== memNum)
                : [...prev, memNum];

            setSelectAll(newSelection.length === members.length);
            return newSelection;
        });
    };

    // 회원 탈퇴 로직
    const handleDeleteMembers = async () => {
        if (window.confirm("선택한 회원을 삭제하시겠습니까?")) {
            try {
                const membersToDelete = members
                    .filter(member => selectedMembers.includes(member.memNum))
                    .map(member => member.memId);

                const response = await axios.post("/admin/members/delete", membersToDelete);

                // 서버 응답 처리
                if (response.data.deletedMembers && response.data.failedToDeleteMembers) {
                    let message = "";
                    if (response.data.deletedMembers.length > 0) {
                        message += `다음 회원들이 삭제되었습니다: ${response.data.deletedMembers.join(", ")}\n`;
                    }
                    if (response.data.failedToDeleteMembers.length > 0) {
                        message += `다음 회원들은 삭제할 수 없습니다 (관리자 권한): ${response.data.failedToDeleteMembers.join(", ")}`;
                    }
                    alert(message);
                } else {
                    alert(response.data);
                }

                // 회원 목록을 다시 불러오고, 선택 상태 초기화
                await fetchMembers();
                setSelectedMembers([]);
                setSelectAll(false);  // 전체 선택 상태도 해제
            } catch (error) {
                console.error("회원 삭제 중 오류 발생:", error.response?.data || error.message);
                alert(`회원 삭제 중 오류가 발생했습니다: ${error.response?.data || error.message}`);
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchMembers(); // 페이지 변경 시 데이터 새로 요청
    };



    // 검색 엔터키 기능
    const handleEnterKey = (e) => {
        e.preventDefault();
        if (e.key === 'Enter') {
            console.log("input enter key:", searchTerm)
        }
    }


    // 로딩 상태
    if (isLoading) {
        return (
            <div>
                Loading ...
            </div>
        );
    }

    // 권한없을시 페이지 없음
    if (!hasPermission) {
        return null;
    }

    return (
        <>
            {/* 배경 wrap*/}
            <div className="wrap" >

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
                    <span>Admin&nbsp;&nbsp;{">"}&nbsp;&nbsp;회원 관리&nbsp;&nbsp;</span>
                    {/*<span className="s">></span>*/}
                </div>

                {/* 회원 검색 */}
                <FormBox onSubmit={handleSearch}>
                    {/* 검색창 */}
                    <SearchInput
                        type="text"
                        className="bottom_search_text"
                        placeholder="검색어 입력"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* 검색 버튼 */}
                    <Button
                        className="search_submit"
                        type="submit">
                        검색
                    </Button>
                    {/* 삭제 버튼 */}

                    <DeleteButton onClick={handleDeleteMembers}>회원 삭제</DeleteButton>

                </FormBox>

                <div className="list_div">
                    {/* 회원 관리 제목*/}
                    <div className="admin_member_haed">
                        <h2>회원 관리</h2>
                    </div>
                    <AdminMemberList>
                        <div>
                            {/* 회원 관리 목차 */}
                            <ul className="AdminMemberIndex">
                                <li className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        onKeyDown={handleEnterKey}
                                    />
                                </li>
                                <li className="mem_no">회원 번호</li>
                                <li className="mem_id">회원 ID</li>
                                <li className="mem_name">이름</li>
                                <li className="mem_email">이메일</li>
                                <li className="mem_phone">연락처</li>
                                <li className="mem_gender">성별</li>
                                <li className="mem_birth">생년월일</li>
                                <li className="mem_role">권한</li>
                            </ul>
                        </div>
                        {/* 회원 정보 */}
                        <div>
                            {members.map((member) => (
                                <ul className="AdminMemberContent" key={member.memNum}>
                                    <li className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(member.memNum)}
                                            onChange={() => handleCheckboxChange(member.memNum)}
                                        />
                                    </li>
                                    <li className="mem_no">{member.memNum}</li>
                                    <li className="mem_id">{member.memId}</li>
                                    <li className="mem_name">{member.memName}</li>
                                    <li className="mem_email">{member.memEmail}</li>
                                    <li className="mem_phone">{member.memTel}</li>
                                    <li className="mem_gender">{member.memGender}</li>
                                    <li className="mem_birth">{member.memBirth}</li>
                                    <li className="mem_role">{member.memRole}</li>
                                </ul>
                            ))}
                        </div>
                    </AdminMemberList>

                    {/* 페이지네이션 컴포넌트 */}
                    {/* <div className="pagination"> */}
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={10}
                        totalItemsCount={totalPages * 10}
                        pageRangeDisplayed={10}
                        onChange={handlePageChange}
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        firstPageText={"«"}
                        lastPageText={"»"}
                    />
                    {/* </div> */}

                </div>
            </div>
            <ChatBot />
        </>
    );
}


export default AdminMemberListPage;




const DeleteButton = styled.button`

    width: 140px;
    height: 45px;
    border: 1px solid #cccccc;
    border-radius: 2px;
    background-color: #e5e8eb;
    float: right;
    font-size: 14px;
    margin-left: 20px;
    background-color: red;
    color: #fff;
    &:hover{
        font-weight: 800;
        background-color: #1351f9;
    }

`



// 검색창 전체 폼
const FormBox = styled.form`
    width: 1044px;
    display: flex;
    margin: 0 auto;
    margin-bottom: 20px;
    padding-top: 72px;
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

const AdminMemberList = styled.div`
    width: 1044px;
    margin: 0 auto;
    /*text-align: left;*/
    border-spacing: 0;
    /*height: 500px;*/
    background-color: #fff;
    margin-top: 20px;
    /*margin-bottom: 40px;*/
    text-align: center;

    .AdminMemberIndex{
        display: flex;
        border-top: 1px solid rgba(201, 201, 201, 0.6);
        border-bottom: 1px solid rgba(201, 201, 201, 0.6);
        font-size: 13px;
        padding: 10px 5px;
        font-weight: 500;
        /*text-align: left;*/
        /*padding-left: 20px;*/
        background-color: #e5e8eb;
        color: #0f2027;
        -webkit-font-smoothing: antialiased;
        text-indent: 10px;

    }

    .AdminMemberContent{
        display: flex;
        // border-top: 1px solid rgba(201, 201, 201, 0.6);
        border-bottom: 1px solid rgba(201, 201, 201, 0.6);
        font-size: 13px;
        padding: 10px 5px;
        font-weight: 500;
        /*text-align: left;*/
        /*padding-left: 20px;*/
        background-color: #fff;
        color: #0f2027;
        -webkit-font-smoothing: antialiased;
        text-indent: 10px;
    }
`


