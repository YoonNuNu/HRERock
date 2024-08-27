import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../../../common/css/AdminNoticeListPage.css";

function AdminNoticeListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();
    const initializedRef = useRef(false);

    const checkPermission = async () => {
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
                navigate('/Login');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            alert("오류가 발생했습니다. 다시 로그인해주세요.");
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const loadBoardList = async (page = 0) => {
        try {
            const response = await axios.get('/admin/boardList', {
                params: { page, size: 10, sort: 'boardId,DESC' }
            });
            setBoardList(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching boards:', error);
            alert('목록을 불러오는 중 오류가 발생했습니다.');
        }
    };

    const searchBoards = async () => {
        if (!searchKeyword.trim()) {
            loadBoardList(0); // 검색어가 없을 경우 전체 목록을 불러옴
            return;
        }
        try {
            const response = await axios.get('/admin/boardSearch', {
                params: {
                    page: 0,
                    size: 10,
                    sort: 'boardId,DESC',
                    boardTitle: searchKeyword,
                    boardContent: searchKeyword
                }
            });
            setBoardList(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(0);
        } catch (error) {
            console.error('Error searching boards:', error);
            alert('검색 중 오류가 발생했습니다.');
        }
    };

    const deleteSelectedPosts = async () => {
        const selectedBoards = Array.from(document.querySelectorAll('input[name="selectedBoards"]:checked')).map(board => board.value);
        if (selectedBoards.length > 0) {
            try {
                await axios.delete('/admin/listdelete', { data: selectedBoards });
                alert('선택한 게시물들이 삭제되었습니다.');
                loadBoardList(currentPage);
            } catch (error) {
                console.error('게시물 삭제 오류:', error);
                alert('게시물 삭제 중 오류가 발생했습니다.');
            }
        } else {
            alert('삭제할 게시물을 선택하세요.');
        }
    };

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            checkPermission();
        }
        loadBoardList();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!hasPermission) {
        return null;
    }

    return (
        <div className="body">

            <div className="main">
                <div className="admin_notice_div">
                    <div className="admin_notice_head">
                        <h2>공지사항</h2>
                    </div>
                    <div className="search-container">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            placeholder="제목 검색..."
                        />
                        <button onClick={searchBoards}>검색</button>
                    </div>
                    <div className="admin_notice_list">
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="selectAllBoards" /></th>
                                    <th>번호</th>
                                    <th>공지</th>
                                    <th>제목</th>
                                    <th>날짜</th>
                                    <th>조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boardList.map((board, index) => (
                                    <tr key={board.boardId}>
                                        <td><input type="checkbox" name="selectedBoards" value={board.boardId} /></td>
                                        <td>{index + 1}</td>
                                        <td>{board.notice ? '공지' : ''}</td>
                                        <td><Link to={`/user/Notice/${board.boardId}`} className="board-title-link">{board.boardTitle}</Link></td>
                                        <td>{board.modifyDate}</td>
                                        <td>{board.boardViewCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button onClick={() => navigate('/admin/Notice/Write')}>글쓰기</button>
                        <button onClick={deleteSelectedPosts}>선택한 글 삭제</button>
                    </div>
                    <div id="pagination" className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={i === currentPage ? 'active' : ''}
                                onClick={() => loadBoardList(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminNoticeListPage;
