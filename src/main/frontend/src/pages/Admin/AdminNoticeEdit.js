import React, { useEffect, useState } from 'react';
import '../Notice/css/Notice.css';
import '../Notice/css/NoticeView.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ChatBot from '../../components/ChatBot/ChatBot';
import SideBar from './SideBar';
import home from "./images/home.svg";


//공지사항 수정
const AdminNoticeEdit = () => {

    // 변수 설정
    const [noticeInfo, setNoticeInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editFiles, setEditFiles] = useState({});
    const navigate = useNavigate();
    const { boardId } = useParams();
    const [fileInputs, setFileInputs] = useState([0]);

    const [pendingFiles, setPendingFiles] = useState([]); // 수정 대기 상태 파일
    const [selectedFiles, setSelectedFiles] = useState([]); // 선택한 파일 상태



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
    const editPost = async () => {
        const token = localStorage.getItem('accessToken');

        const updateTitle = editTitle || noticeInfo.boardTitle;
        const updateContent = editContent || noticeInfo.boardContent;

        if (!updateTitle || !updateContent) {
            alert("공지글 제목과 내용이 모두 필요합니다.");
            return;
        }

        try {
            // 게시글 수정 로직
            const response = await axios.patch(`/admin/${boardId}/boardUpdate`, {
                boardId,
                boardTitle: updateTitle,
                boardContent: updateContent,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            alert("공지글 수정이 완료되었습니다.");
            console.log('게시글 수정 완료:', response.data);
            navigate(0);
        } catch (error) {
            console.error('게시글 수정 중 오류 발생:', error);
            handleAxiosError(error);
        }
    };






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
            navigate('/admin/boardList');
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
    // 기존 파일 input의 파일이 수정된 경우 업데이트하는 함수
    const handleFileChange = (fileId, event) => {
        const newFile = event.target.files[0];
        setPendingFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
            updatedFiles[fileId] = newFile; // 새로 선택된 파일만 상태에 저장
            return updatedFiles;
        });
    };


    // 파일 선택 처리 함수
    const handleFileSelect = (index, event) => {
        const files = Array.from(event.target.files);
        console.log('선택한 파일들:', files); // 선택한 파일들을 확인
        // 파일 선택 상태 업데이트
        setSelectedFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
            updatedFiles[index] = files[0]; // 인덱스에 따라 파일 업데이트
            return updatedFiles;
        });
    };



    // 수정 버튼 클릭 시 파일 업로드
    const updateFile = async (fileId) => {
        const token = localStorage.getItem('accessToken');
        const file = pendingFiles[fileId]; // 수정 버튼 클릭 후에만 파일을 확인

        if (!file) {
            alert('새 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file); // 선택된 파일만 업로드

        try {
            const response = await axios.put(`/admin/boardFileUpdate/${fileId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('파일이 성공적으로 수정되었습니다.');
            setPendingFiles([]); // 수정된 후 파일 상태 초기화
            getBoardDetail(boardId); // 게시글 정보 새로고침
        } catch (error) {
            console.error('파일 수정 중 오류 발생:', error);
            alert('파일 수정 중 오류가 발생했습니다.');
        }
    };


    const uploadFiles = async (fileId) => {
        const token = localStorage.getItem('accessToken');
        console.log('업로드할 파일들:', selectedFiles); // 선택된 파일들 확인

        const formData = new FormData();

        if (selectedFiles[fileId]) { // 선택된 파일이 있는 경우만 업로드
            formData.append('files', selectedFiles[fileId]);
        } else {
            alert('선택된 파일이 없습니다.');
            return;
        }

        try {
            const response = await axios.post(`/admin/boardUpload/${boardId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('파일이 성공적으로 수정되었습니다.');
            setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== fileId)); // 업로드 후 파일 리스트 업데이트
            getBoardDetail(boardId); // 게시글 정보 새로고침
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


    //파일 input 추가 기능
    const addFileInput = () => {
        // noticeInfo.files가 배열이면 배열의 길이를 확인, 그렇지 않으면 숫자로 가정
        const uploadedFilesCount = Array.isArray(noticeInfo?.files) ? noticeInfo.files.length : 0; // null-safe check
        const totalFiles = fileInputs.length + uploadedFilesCount;

        if (totalFiles >= 5) {
            alert("최대 5개의 파일만 업로드할 수 있습니다.");
            return;
        }

        // 새로운 파일 input을 추가
        setFileInputs([...fileInputs, fileInputs.length]);
    };


    // 파일 input 삭제 기능
    const removeFileInput = (index) => {
        const newFileInputs = fileInputs.filter((_, i) => i !== index);
        setFileInputs(newFileInputs);
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


    // 페이지 로드 시 파일 input 수 확인
    useEffect(() => {
        const uploadedFilesCount = Array.isArray(noticeInfo?.files) ? noticeInfo.files.length : 0;
        const initialFileInputs = Array.from({ length: Math.min(5 - uploadedFilesCount, 0) }, (_, i) => i);

        setFileInputs(initialFileInputs);
    }, [noticeInfo]);

    useEffect(() => {
        console.log('현재 선택된 파일들:', selectedFiles);
    }, [selectedFiles]);
    return (
        <>


            <Wrap>
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

                <NoticeViewHead>
                    <Header className="name">
                        <Link to={`/admin/boardList/`}>
                            공지사항
                        </Link>
                    </Header>
                    <NoticeViewTitle>
                        <FormBlockHead>
                            <AsteriskRed>＊</AsteriskRed> 제목
                        </FormBlockHead>
                        {/* 조건부 렌더링 적용 */}
                        {noticeInfo ? (

                            <input
                                type="text"
                                id="boardTitle"

                                onChange={(e) => setEditTitle(e.target.value)}
                                value={editTitle !== "" ? editTitle : noticeInfo?.boardTitle}

                                readOnly={!isAdmin}
                            />
                        ) : (
                            <input
                                type="text"
                                id="boardTitle"

                                defaultValue="제목 없음"
                                readOnly
                            />
                        )}
                    </NoticeViewTitle>
                    <NoticeInfomaintDiv>
                        {/* 조건부 렌더링 적용 */}
                        {noticeInfo ? (
                            <>
                                <FormBlockHead>
                                    {/* <AsteriskRed></AsteriskRed>  */}
                                </FormBlockHead>
                                <NoticeWriter>
                                    <span>
                                        작성자: 희노애락 관리자
                                    </span>
                                </NoticeWriter>
                                <NoticeInfo>
                                    <span>날짜: {noticeInfo.modifyDate}</span>
                                    <span>조회수: {noticeInfo.boardViewCount ?? '조회수 정보 없음'}</span>
                                </NoticeInfo>
                            </>
                        ) : (
                            <>
                                <NoticeWriter>
                                    <span>
                                        작성자: 희노애락 관리자
                                    </span>
                                </NoticeWriter>
                                <NoticeInfo>
                                    <span>날짜: 정보 없음</span>
                                    <span>조회수: 조회수 정보 없음</span>
                                </NoticeInfo>
                            </>
                        )}
                    </NoticeInfomaintDiv>
                </NoticeViewHead>
                <NoticeViewContent>
                    <FormContentBlockHead>
                        <AsteriskRed>＊</AsteriskRed> 내용
                    </FormContentBlockHead>
                    {/* 조건부 렌더링 적용 */}
                    {noticeInfo ? (
                        <textarea

                            className=""
                            value={editContent !== '' ? editContent : noticeInfo?.boardContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            readOnly={!isAdmin}
                        ></textarea>
                    ) : (
                        <textarea

                            className=""
                            defaultValue="내용 없음"
                            readOnly={!isAdmin}
                        ></textarea>
                    )}
                </NoticeViewContent>
                <FormBlockFiles>
                    <FormContentBlockHead>
                        <AsteriskRed >＊</AsteriskRed> 파일
                    </FormContentBlockHead>
                    <NoticeViewFile>
                        <ul>
                            {/* 기존 파일 목록 렌더링 */}
                            {noticeInfo && noticeInfo.files && noticeInfo.files.length > 0 &&
                                noticeInfo.files.map((file) => (
                                    <li key={file.boardFileId}>
                                        <div className="NoticeFileNameDiv">
                                            <a href="#" onClick={() => downloadFile(file.boardFileId, file.boardOriginFileName)}>
                                                {file.boardOriginFileName}
                                            </a>
                                        </div>

                                        {isAdmin && (
                                            <>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(file.boardFileId, e)}
                                                />
                                                <button className="editBtn" onClick={() => updateFile(file.boardFileId)}>수정</button>
                                                <button className="deleteBtn" onClick={() => deleteFile(file.boardFileId)}>삭제</button>
                                            </>
                                        )}
                                    </li>
                                ))
                            }

                            {/* 새로운 파일 input을 렌더링 */}
                            {fileInputs.map((input, index) => (
                                <li key={input}>
                                    <div className="filebox">
                                        <label htmlFor={`file_${index}`}>파일첨부</label>
                                        <input
                                            type="file"
                                            id={`file_${index}`}
                                            name={`file_${index}`}
                                            onChange={(event) => handleFileSelect(index, event)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => uploadFiles(index)}
                                        >
                                            파일 추가
                                        </button>
                                        <button type="button" className="removeFile" onClick={() => removeFileInput(index)}>파일 삭제</button>
                                    </div>
                                </li>
                            ))}

                        </ul>

                        {/* 파일 추가 버튼 */}
                        {/* <button type="button" onClick={addFileInput}>파일 추가</button> */}
                    </NoticeViewFile>
                </FormBlockFiles>


                <NoticeViewBtn>
                    <FormBlockHead>
                        <AsteriskRed></AsteriskRed>
                    </FormBlockHead>
                    <NoticeViewBtnWrap>

                        <div className="btn_center">
                            {isAdmin && (
                                <>
                                    <button className="modify_btn" onClick={editPost}>글 수정</button>
                                    <button className="delete_btn" onClick={deletePost}>글 삭제</button>
                                    <button type="button" onClick={addFileInput}>파일 추가</button>
                                </>
                            )}
                        </div>
                        <div className="btn_right">
                            <button className="back_to_list" onClick={() => navigate('/admin/boardList')}>목록으로<br /> 돌아가기</button>
                        </div>

                    </NoticeViewBtnWrap>

                </NoticeViewBtn>
            </Wrap>

            <ChatBot />
        </>
    );

}
export default AdminNoticeEdit;

const Wrap = styled.div`
    width: 100%;
    //height: 100vh;
    height: 1220px;
    // position: relative;
    margin: 0 auto;
    //padding: 40px 40px;
    //background: rgb(255,255,255);
    background: #eee;
    display: inline-block;
    // display: flex;
    flex-direction: column;
    // border: 1px solid red;
`;


//제목감싸는 박스
const Header = styled.div`
    width: 1024px;
    margin: 0 auto;

    font-family: 'SUIT-Regular' !important;
    // color: rgb(51, 61, 75);
    // color: white;
    font-size: 36px;
    font-weight: 800;
    text-align: left;
    
    padding-left: 70px;

    a{
        color: black;
    }
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
    // vertical-align: middle;
    height: 48px;
    width: 1024px;
    margin-top: 1px;
    margin-bottom: 10px;
    text-align: left;
    // border: 1px solid red;
    display: flex;

    input{
        width:100%;
        border: 1px solid #ccc;
        padding-left: 15px;
    }
`;
// 글 작성자
const NoticeWriter = styled.div`
    // border: 1px dashed black;
    background: #f8f8f8;
    width: 50%;
    height: 45px;
    display: flex;
    justify-content: left;
    align-items: center;
    padding-right: 10px;
    border: none;
    border-top: 2px solid #d6d4ca;
    border-bottom: 2px solid #d6d4ca;
    // border-radius: 10px;
    padding-left: 10px;
    span{
        color: black;
    }
`

// 글 날짜, 조회
const NoticeInfo = styled.div`
    // border: 1px dashed black;
    background: #f8f8f8;
    width: 50%;
    height: 45px;
    display: flex;
    justify-content: right;
    align-items: center;
    padding-right: 10px;
    border: none;
    border-top: 2px solid #d6d4ca;
    border-bottom: 2px solid #d6d4ca;
    // border-radius: 10px;

    span{
        color: black;
    }
`


// 글 내용
const NoticeViewContent = styled.div`
    // border: 1px solid red;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 1024px;
    margin: 0 auto;

    textarea{

        width: 1024px;
        height: 500px;
        resize: none;
        border: none;
        outline: none;
        border: 1px solid #ccc;
        margin-top: 10px;
        // margin-left: 5px;

        text-indent: 10px;
        font-size: 13px;
        font-weight: 500;
        background-color: #fff;
        -webkit-font-smoothing: antialiased;
        text-align: left;
        padding: 15px 5px;
    }
`;


// 첨부 파일
const NoticeViewFile = styled.div`
    display: flex;
    //flex-direction: column;
    justify-content: left;
    align-items: center;
    margin-top: 10px;
    font-size: 13px;
    width: 1024px;
    div{
        // width: 1024px;
        //margin-top: 10px;    
    }

    input{
        width: 200px;
        height: 45px;
        padding: .55em .75em;
        margin-right: 20px;
        border: 1px solid #ccc;
        font-size: 13px;
        vertical-align: middle;

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
        // border: 1px solid black;
        margin-right: 15px;
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
    .editBtn{
        margin-left: 15px;
        border: 1px solid #ccc;
        background: #fff;

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
    a{
        // color: black;

    }


    .filebox {
        float: right;

    }

    .filebox > label {
        margin-right: 20px;
        // margin-bottom: 10px;
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

    .filebox > input[type="file"] {
        width: 200px;
        height: 43px;
        padding: .55em .75em;
        margin-top: -4px;
        margin-right: 20px;
        border: 1px solid #ccc;
        font-size: 13px;
        vertical-align: middle;
    }

    .filebox > button {
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


`

// 수정, 삭제, 돌아가기 버튼
const NoticeViewBtn = styled.div`
    width: 1024px;
    margin: 0 auto;
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

    display: flex;
    justify-content: left;
    text-align: center;
    // align-items: center;
    width: 1024px;
    margin: 0 auto;
    // border: 1px solid red;
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
        font-size: 13px;

        &:hover {
            background-color: #ce1d1d !important;
        }

        &:active, &:focus {
            border: 1px solid #0f2027 !important;
        }
    }



`;

const FormBlockHead = styled.h3`
    width: 60px;
    height: 45px;
    // border: 1px solid red;
    // text-indent: 30px;
    // float: left;
    font-size: 14px;
    color: #0f2027;
    line-height: 45px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 200;
    margin-right: 10px;
    text-align: left;
`;

const FormContentBlockHead = styled.h3`
    width: 60px;
    height: 45px;
    // border: 1px solid red;
    // text-indent: 30px;
    // float: left;
    font-size: 14px;
    color: #0f2027;
    line-height: 45px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 200;
    margin-right: 10px;
    text-align: left;
    margin-top: 10px;
`;

const AsteriskRed = styled.em`
    color: #ff27a3;
    font-size: 12px;
`;

const NoticeInfomaintDiv = styled.div`

    width: 1024px;
    // background: #fff;
    // border: none;
    // border-top: 2px solid #d6d4ca;
    // border-bottom: 2px solid #d6d4ca;
    // border: 1px solid #ccc;
    /* text-align: right; */
    display: flex;
    justify-content: center;
    align-items: center;


`