import React, { useEffect, useState } from 'react';
import './css/Notice.css';
import './css/NoticeView.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import ChatBot from '../../components/ChatBot/ChatBot';

//공지사항 보기
const NoticeView = () => {

    // 변수 설정
    const [noticeInfo, setNoticeInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editFiles, setEditFiles] = useState({});
    const navigate = useNavigate();
    const { boardId } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            alert("로그인이 필요합니다");
            navigate('/login');
            return;
        }

        axios.get('/auth/memberinfo', {
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
        console.log(`Fetching details for board ID: ${boardId}`);

        axios.get(`/admin/${boardId}`)
            .then(response => {
                console.log('게시글 상세 정보:', response.data);
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
        axios.patch(`/admin/${boardId}/boardUpdate`, {
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
            navigate('/admin/notice');
        }).catch(error => {
            console.error('게시글 수정 중 오류 발생:', error);
            handleAxiosError(error);
        })
    }

    // 공지글 삭제
    const deletePost = () => {
        const token = localStorage.getItem('accessToken');

        axios.delete(`/admin/${boardId}/delete`, {
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

        axios.get('/admin/boardDownload', {
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
            console.error('파일 다운로드 중 오류 발생:', error);
            alert("파일 다운로드 중 오류가 발생했습니다");
        });
    };

    // 파일 수정 (새로 추가)
    const handleFileChange = (fileId, event) => {
        setEditFiles({
            ...editFiles,
            [fileId]: event.target.files[0]
        });
    };

    const updateFile = async (fileId) => {
        const token = localStorage.getItem('accessToken');
        const file = editFiles[fileId];

        if (!file) {
            alert('새 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.put(`/admin/boardFileUpdate/${fileId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('파일이 성공적으로 수정되었습니다.');
            getBoardDetail(boardId);

        } catch (error) {
            console.error('파일 수정 중 오류 발생:', error);
            alert('파일 수정 중 오류가 발생했습니다.');
        }
    };

    // 파일 삭제 (새로 추가)
    const deleteFile = async (boardFileId) => {
        const token = localStorage.getItem('accessToken');

        try {
            await axios.delete(`/admin/boardDelete`, {
                params: { boardFileId: boardFileId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('파일이 성공적으로 삭제되었습니다.');
            getBoardDetail(boardId);
        } catch (error) {
            console.error('파일 삭제 중 오류 발생:', error);
            alert('파일 삭제 중 오류가 발생했습니다.');
        }
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
            <Wrap>
                <NoticeViewHead>
                    <Header className="name">
                        <Link to={`/user/notice/`}>
                            게시판
                        </Link>
                    </Header>
                    <NoticeViewTitle>
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
                </NoticeViewHead>
                <NoticeViewContent>
                    {noticeInfo ? (
                        <textarea
                            className="post_text"
                            value={editContent !== '' ? editContent : noticeInfo?.boardContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            readOnly={!isAdmin}
                        ></textarea>
                    ) : (
                        <textarea
                            className="post_text"
                            defaultValue="내용 없음"
                            readOnly={!isAdmin}
                        ></textarea>
                    )}
                </NoticeViewContent>
                <FormBlockFiles>
                    <NoticeViewFile>
                        {noticeInfo && noticeInfo.files && noticeInfo.files.length > 0 ? (
                            <div>
                                <h3>첨부파일:</h3>
                                <ul>
                                    {noticeInfo.files.map((file) => (
                                        <li key={file.boardFileId}>
                                            <div className="NoticeFileNameDiv">
                                                <a href="#"

                                                   onClick={() => downloadFile(file.boardFileId, file.boardOriginFileName)}>
                                                    {file.boardOriginFileName}
                                                </a>
                                            </div>

                                            {isAdmin && (
                                                <>
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleFileChange(file.boardFileId, e)}
                                                    />
                                                    <button  className="editBtn" onClick={() => updateFile(file.boardFileId)}>수정</button>
                                                    <button className="deleteBtn" onClick={() => deleteFile(file.boardFileId)}>삭제</button>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div>첨부파일이 없습니다.</div>
                        )}
                    </NoticeViewFile>

                </FormBlockFiles>
                <NoticeViewBtn>
                    <NoticeViewBtnWrap>
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
                    </NoticeViewBtnWrap>
                </NoticeViewBtn>
            </Wrap>
            <ChatBot />
        </>
    );
}
export default NoticeView;

const Wrap = styled.div`
    width: 100%;
    //height: 100vh;
    // position: relative;
    margin: 0 auto;
    //padding: 40px 40px;
    //background: rgb(255,255,255);
    background: #fff;
    display: inline-block;
    display: flex;
    flex-direction: column;
    align-items: center
`;


//제목감싸는 박스
const Header = styled.div`
    width: 1024px;
    margin: 0 auto;
    //background: red;
    font-family: 'SUIT-Regular' !important;
    // color: rgb(51, 61, 75);
    font-size: 36px;
    font-weight: 800;
    text-align: left;
`;


// 글 제목, 날짜
const NoticeViewHead = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .noticeViewInfo{
        width: 1024px;
        text-align: right;

    }

`;

// 글 제목
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


// 글 내용
const NoticeViewContent = styled.div`

    display: flex;
    justify-content: center;
    text-align: center;

    textarea{

    }
`;

// 첨부 파일
const NoticeViewFile = styled.div`
    display: flex;
    //flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    div{
        width: 1024px;
        //margin-top: 10px;    
    }

    input{
        //border: 1px solid blue;

    }
    li{
        display: flex;
        //justify-content: center;
        align-items: center;
        margin-bottom:10px;
    }
    .NoticeFileNameDiv{
        width: 200px;
        align-items: center;
        //border: 1px solid black;
    }

    .editBtn{
        border: 1px solid #3182f6;
    }
    .deleteBtn{
        color: #fff !important;
        font-weight: 500 !important;
        background-color: red !important;

        &:hover {
            background-color: #ce1d1d !important;
        }

        &:active, &:focus {
            border: 1px solid #0f2027 !important;
        }
    }
`

// 수정, 삭제, 돌아가기 버튼
const NoticeViewBtn = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;

    display: flex;
    justify-content: center;
`

const NoticeViewBtnWrap = styled.div`
    width: 1024px;

    display: flex;
    justify-content: space-between;

    // 수정 버튼
    .modify_btn{
        background-color: #e5e8eb;

        &:hover{
            cursor: pointer;
            background-color: #3182f6;
            color: white;
        }
    }

    // 삭제 버튼
    .delete_btn{
        background-color: #e5e8eb;

        &:hover{
            cursor: pointer;
            background-color: red;
            color: white;
        }


    }


    // 목록으로 돌아가기 버튼
    .back_to_list{
        width: 90px;
        height: 45px;
        background-color: #e5e8eb;
        border: 1px solid #cccccc;

        &:hover{
            cursor: pointer;
            background-color: #3182f6;
            color: white;
        }
    }

`
const FormBlockFiles = styled.div`

    //border: 1px solid red;
    box-sizing: border-box;
    vertical-align: middle;
    width: 1024px;
    margin-top: 40px;
    margin-bottom: 100px;
    text-align: left;
    display: flex;
    .submit {
        float: right;
        width: 300px !important;
        height: 45px !important;
        margin-right: auto !important;
        padding: 1em 9em !important;
        line-height: 1.5em !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        background-color: #3182f6 !important;
        color: #fff !important;

        &:hover {
            background-color: #1776ff !important;
        }

        &:active, &:focus {
            border: 1px solid #0f2027 !important;
        }
    }

    .submit-img {
        float: left;
        width: 18px;
        height: 18px;
        text-align: left;
        line-height: 25px;
    }

    .removeFile {
        color: #fff !important;
        font-weight: 500 !important;
        background-color: red !important;

        &:hover {
            background-color: #ce1d1d !important;
        }

        &:active, &:focus {
            border: 1px solid #0f2027 !important;
        }
    }

    .filebox {
        float: right;
        width: 935px;
    }

    .filebox label {
        margin-right: 20px;
        margin-bottom: 20px;
        display: inline-block;
        padding: .5em .75em;
        color: #0f2027;
        font-size: 13px;
        line-height: 30px;
        text-align: center;
        background-color: #fdfdfd;
        cursor: pointer;
        border: 1px solid #ebebeb;
        width: 90px;
        height: 45px;
        border: 1px solid #ccc;
        border-radius: 2px;
        background-color: #fff;

        &:hover {
            cursor: pointer;
            background-color: #3182f6;
            color: #fff;
        }

        &:active, &:focus {
            border: 1px solid #0f2027;
        }
    }

    .filebox input[type="file"] {
        width: 200px;
        height: 43px;
        padding: .55em .75em;
        margin-top: -4px;
        margin-right: 20px;
        border: 1px solid #ccc;
        font-size: 13px;
        vertical-align: middle;
    }

    button {
        margin-right: 20px;
        display: inline-block;
        padding: .5em .75em;
        color: #0f2027;
        font-size: 13px;
        line-height: 30px;
        text-align: center;
        background-color: #fdfdfd;
        cursor: pointer;
        border: 1px solid #ebebeb;
        width: 90px;
        height: 45px;
        border: 1px solid #ccc;
        border-radius: 2px;
        background-color: #fff;
    }
`;
