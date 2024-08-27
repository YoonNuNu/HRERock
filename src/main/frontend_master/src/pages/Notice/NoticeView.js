import React, { useEffect, useState } from 'react';
import { getPostByNo } from '../../Data';

import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../api/axios';
import styled from 'styled-components';

import '../Notice/css/Notice.css';
import '../Notice/css/NoticeView.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import notice from "./images/notice_write.png";





//공지사항 보기
const NoticeView = () => {

    // 변수 설정
    const [noticeInfo, setNoticeInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const navigate = useNavigate();
    const { boardId } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            alert("로그인이 필요합니다");
            navigate('/login');
            return;
        }

        api.get('/auth/memberinfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.memRole === 'ADMIN') {
                setIsAdmin(true);
            }
            else {
                setIsAdmin(false);

            }
            getBoardDetail(boardId);
        }).catch(error => {
            console.error("사용자 정보를 가져오는 중 오류 발생:", error);
            alert("오류가 발생했습니다. 다시 로그인해주세요")
            navigate("/login");
        })


    }, [boardId, navigate]);

    const getBoardDetail = (boardId) => {
        console.log(`Fetching details for board ID: ${boardId}`);   //디버깅 로그 추가

        api.get(`/admin/${boardId}`)
            .then(response => {
                console.log('게시글 상세 정보:', response.data);    //디버깅 로그 추가
                setNoticeInfo(response.data);

            })
            .catch(error => {
                console.error('게시글 상세 정보를 가져오는 중 오류 발생:', error);
                handleAxiosError(error);
            });
    };

    // 공지글 수정
    const editPost = () => {
        const token = localStorage.getItem('accessToken');

        const updateTitle = editTitle || noticeInfo.boardTitle;
        const updateContent = editContent || noticeInfo.boardContent;

        if (!updateTitle || !updateContent) {
            alert("공지글 제목과 내용이 모두 필요합니다.")
            return;
        }
        api.patch(`/admin/${boardId}/boardUpdate`, {
            boardId,
            boardTitle: editTitle,
            boardContent: editContent,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            alert("공지글 수정이 완료되었습니다.");
            console.log('게시글 수정 완료:', response.data);
            navigate(0);
        }).catch(error => {
            console.error('게시글 수정 중 오류 발생:', error);
            handleAxiosError(error);
        })

    }

    // 공지글 삭제
    const deletePost = () => {
        const token = localStorage.getItem('accessToken');

        api.delete(`/admin/${boardId}/delete`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('게시글 삭제 완료:', response.data);
            alert('게시글이 삭제되었습니다.');
            navigate('/user/notice');

        }).catch(error => {
            console.error('게시글 삭제 중 오류 발생:', error);
            handleAxiosError(error)
        });
    };

    //파일 다운로드
    const downloadFile = (boardFileId, fileName) => {
        const token = localStorage.getItem('accessToken');

        api.get('/admin/boardDownload', {
            params: { boardFileId },
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${token}`,
            }

        }).then(response => {
            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type: response.headers['Content-Type']
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
            else {
                console.error("downloadFile response.status:", response.status);
                alert('파일 다운로드 중 오류가 발생했습니다.');
            }

        }).catch(error => {
            console.error('파일 다룬로드 중 오류 발생:', error);
            alert("파일 다운로드 중 오류가 발생했습니다");
            // handleAxiosError(error);
        });

    };

    // 에러 처리 
    const handleAxiosError = (error) => {
        if (error.response) {
            console.error('응답 데이터:', error.response.data);
            console.error('응답 상태:', error.response.status);
            alert('오류가 발생했습니다. 상세 오류를 확인하세요.');
        }
        else if (error.request) {
            console.error('요청:', error.request);
            alert('서버에 요청을 보내지 못했습니다. 네트워크 연결을 확인하거나 관리자에게 문의하세요');

        }
        else {
            console.error('오류 메세지:', error.message);
            alert('오류가 발생했습니다. 다시 시도해주세요');
        }
    }

    useEffect(() => {
        if (noticeInfo) {
            setEditTitle(noticeInfo.boardTitle);
            setEditContent(noticeInfo.boardContent);
        }
    }, [noticeInfo]);

    return (
        <>


            <div className="noticeView">
                <div className="noticeViewHead">
                    <NoticeViewTitle>
                        {/* 조건부 렌더링 적용 */}
                        {noticeInfo ? (

                            <input
                                type="text"
                                id="boardTitle"
                                className="post_title"
                                onChange={(e) => setEditTitle(e.target.value)}
                                value={editTitle !== "" ? editTitle : noticeInfo?.boardTitle}

                                readOnly={!isAdmin}
                            />
                        ) : (
                            <input
                                type="text"
                                id="boardTitle"
                                className="post_title"
                                defaultValue="제목 없음"
                                readOnly
                            />
                        )}
                    </NoticeViewTitle>
                    <div className="noticeViewInfo">
                        {/* 조건부 렌더링 적용 */}
                        {noticeInfo ? (
                            <>
                                <span>날짜: {noticeInfo.modifyDate}</span>
                                <span>조회수: {noticeInfo.boardViewCount ?? '조회수 정보 없음'}</span>
                            </>
                        ) : (
                            <>
                                <span>날짜: 정보 없음</span>
                                <span>조회수: 조회수 정보 없음</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="noticeViewContent">
                    {/* 조건부 렌더링 적용 */}
                    {noticeInfo ? (
                        <textarea
                            id="boardContent"
                            className="post_text"
                            value={editContent !== '' ? editContent : noticeInfo?.boardContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            readOnly={!isAdmin}
                        ></textarea>
                    ) : (
                        <textarea
                            id="boardContent"
                            className="post_text"
                            defaultValue="내용 없음"
                            readOnly={!isAdmin}
                        ></textarea>
                    )}
                </div>
                <div className="noticeViewFiles">
                    {/* 조건부 렌더링 적용 */}
                    {noticeInfo && noticeInfo.files && noticeInfo.files.length > 0 ? (
                        <div>
                            <h3>첨부파일:</h3>
                            <ul>
                                {noticeInfo.files.map((file) => (
                                    <li key={file.boardFileId}>
                                        <a href="#" onClick={() => downloadFile(file.boardFileId, file.boardOriginFileName)}>
                                            {file.boardOriginFileName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>첨부파일이 없습니다.</div>
                    )}
                </div>
                <div className="noticeViewBtn">
                    <div className="btn_left"></div>
                    <div className="btn_center">
                        {isAdmin && (
                            <>
                                <button className="modify_btn" onClick={editPost}>수정</button>
                                <button className="delete_btn" onClick={deletePost}>삭제</button>
                            </>
                        )}
                    </div>
                    <div className="btn_right">
                        <button className="back_to_list" onClick={() => navigate('/user/Notice')}>목록으로<br /> 돌아가기</button>
                    </div>
                </div>
            </div>



        </>
    );

}
export default NoticeView;

const Wrap = styled.div`
    width: 100%;
    //height: 100vh;
    position: relative;
    margin: 0 auto;
    //padding: 40px 40px;
    //background: rgb(255,255,255);
    background: #fff;
    display: inline-block;
`;

const NoticeViewTitle = styled.div`

    box-sizing: border-box;
    vertical-align: middle;
    height: 48px;
    width: 1024px;
    margin-top: 1px;
    text-align: center;
    // border: 1px solid red;

    input[type = "input"]{
        border: none;
    
    }
`;



