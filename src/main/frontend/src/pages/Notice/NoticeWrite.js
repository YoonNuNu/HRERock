import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import styled from "styled-components";
import notice from "./images/notice_write.png";
import ChatBot from "../../components/ChatBot/ChatBot";
import SideBar from "../Admin/SideBar";
import home from "../Admin/images/home.svg";


// 공지글 쓰기
function NoticeWrite() {
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContent, setBoardContent] = useState('');
    const [fileInputs, setFileInputs] = useState([0]);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    const handleTitleChange = (e) => {
        setBoardTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setBoardContent(e.target.value);
    };

    const handleFileChange = (index, e) => {
        const newFiles = [...files];
        newFiles[index] = e.target.files[0];
        setFiles(newFiles);
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(!token){
            alert("로그인이 필요한 페이지입니다. 로그인부터 진행해주세요");
            navigate("/Login")
        }
    }, [navigate]);

    const addFileInput = () => {
        if (fileInputs.length >= 5) {
            alert("최대 5개의 파일만 업로드할 수 있습니다.");
            return;
        }
        setFileInputs([...fileInputs, fileInputs.length]);
    };

    const removeFileInput = (index) => {
        if (fileInputs.length <= 1) {
            alert("최소 하나의 파일 입력은 남겨야 합니다.");
            return;
        }
        const newFileInputs = fileInputs.filter((_, i) => i !== index);
        const newFiles = files.filter((_, i) => i !== index);
        setFileInputs(newFileInputs);
        setFiles(newFiles);
    };

    //handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. 게시글 정보 전송
            const boardResponse = await axios.post('/admin/boardWrite', {
                boardTitle,
                boardContent
            });
            const boardId = boardResponse.data.boardId;

            // 2. 파일 업로드
            if (files.some(file => file)) {
                const formData = new FormData();
                files.forEach((file) => {
                    if (file) {
                        formData.append('files', file);
                    }
                });

                await axios.post(`/admin/boardUpload/${boardId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            alert('게시글이 성공적으로 작성되었습니다.');
            navigate("/admin/boardList");
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            alert('게시글 작성 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };


    const uploadFiles = async (boardId, files) => {
        const formData = new FormData();
        files.forEach((file) => {
            if (file) {
                formData.append('files', file);
                console.log('첨부 파일:', file.name);  // 파일 이름 출력
            }
        });

        // formData의 모든 항목 출력
        for (let [key, value] of formData.entries()) {
            console.log(`Key: ${key}, Value:`, value);
        }


        try {
            await axios.post(`/admin/boardUpload/${boardId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('파일 업로드 성공');
            navigate('/admin/boardList');
        } catch (error) {
            console.error('파일 업로드 실패:', error.response ? error.response.data : error.message);
            alert('파일 업로드에 실패했습니다. 게시글은 작성되었습니다.');
            navigate('/admin/boardList');
        }
    };

    return (
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

            <FromNoticeWrap>
                <Header className="name">
                    <Link to={`/user/boardList/`}>
                        공지사항
                    </Link>
                </Header>

                <FormWrite onSubmit={handleSubmit}>
                    <InputTextSizeWTypeL>
                        <FormBlockHead>
                            <AsteriskRed>＊</AsteriskRed> 제목
                        </FormBlockHead>
                        <InputWrite
                            type="text"
                            id="title"
                            name="title"
                            required
                            placeholder="제목을 입력하세요"
                            value={boardTitle}
                            onChange={handleTitleChange}
                        />
                    </InputTextSizeWTypeL>

                    <FormBlock>
                        <FormBlockHead>
                            <AsteriskRed>＊</AsteriskRed> 내용
                        </FormBlockHead>
                        <TextWrite
                            name="content"
                            id="content"
                            cols="auto"
                            rows="auto"
                            required
                            placeholder="내용을 입력하세요"
                            value={boardContent}
                            onChange={handleContentChange}
                        ></TextWrite>
                    </FormBlock>

                    <FormBlockFiles>
                        <FormBlockHead>
                            <AsteriskRed>＊</AsteriskRed> 파일
                        </FormBlockHead>
                        {fileInputs.map((input, index) => (
                            <div className="filebox" key={input}>
                                <label htmlFor={`file_${index}`}>파일첨부</label>
                                <input
                                    type="file"
                                    id={`file_${index}`}
                                    name={`file_${index}`}
                                    onChange={(e) => handleFileChange(index, e)}
                                />
                                <button type="button" className="removeFile" onClick={() => removeFileInput(index)}>파일 삭제</button>
                                <button type="button" onClick={addFileInput}>파일 추가</button>
                            </div>
                        ))}
                        <button type="submit" className="submit">
                            작성
                            <img className="submit-img" src={notice} alt="작성" />
                        </button>
                    </FormBlockFiles>
                </FormWrite>
            </FromNoticeWrap>
            <ChatBot />
        </Wrap>
    );
}

// 스타일 컴포넌트
const Wrap = styled.div`
    width: 100%;
    // height: 100%;
    height: 1200px;

    position: relative;
    margin: 0 auto;
    background: #eee;
`;

const FromNoticeWrap = styled.div`
    width: 1024px;
    heigh: 1000px;
    // position: relative;
    margin: 0 auto;
    // background: #fff;
    margin-bottom: 48px;
    // padding-top: 10px;
    // border: 1px solid red;
    padding-left: 100px;

`;

const Header = styled.div`
    width: 1024px;
    margin: 0 auto;
    font-family: 'SUIT-Regular' !important;
    color: rgb(51, 61, 75);
    font-size: 36px;
    font-weight: 800;
    text-align: left;
    padding-left: 90px;
    
    a {
        color: black;
    }
`;

const InputTextSizeWTypeL = styled.div`
    box-sizing: border-box;
    vertical-align: middle;
    height: 48px;
    width: 1024px;
    margin-top: 1px;
    text-align: left;
`;

const FormBlockHead = styled.h3`
    text-indent: 30px;
    float: left;
    font-size: 14px;
    color: #0f2027;
    line-height: 40px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 200;
    margin-right: 10px;
    text-align: left;
`;

const AsteriskRed = styled.em`
    color: #ff27a3;
    font-size: 12px;
`;

const InputWrite = styled.input`
    width: 935px;
    height: 40px;
    border: none;
    outline: none;
    float: right;
    margin-right: auto;
    padding: 15px 5px;
    text-indent: 10px;
    font-size: 13px;
    font-weight: 500;
    background-color: #fff;
    -webkit-font-smoothing: antialiased;
    text-align: left;
    border: 1px solid #ccc;

    &:focus {
        border: 1px solid #0f2027;
    }
`;

const FormBlock = styled.div`
    box-sizing: border-box;
    vertical-align: middle;
    width: 1024px;
    margin-top: 1px;
    text-align: left;
`;

const TextWrite = styled.textarea`
    float: right;
    width: 935px;
    height: 500px;
    resize: none;
    border: none;
    outline: none;
    border: 1px solid #ccc;
    margin-top: 10px;
    margin-left: 5px;
    margin-right: auto;
    text-indent: 10px;
    font-size: 13px;
    font-weight: 500;
    background-color: #fff;
    -webkit-font-smoothing: antialiased;
    text-align: left;
    padding: 15px 5px;

    &:focus {
        border: 1px solid #0f2027;
    }
`;

const FormBlockFiles = styled.div`
    box-sizing: border-box;
    vertical-align: middle;
    width: 1024px;
    margin-top: 40px;
    margin-bottom: 100px;
    text-align: left;

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

const FormWrite = styled.form`
    width: 1024px;
    height: 100%;
    display: flex;
    flex-direction: column;
`;
// 첨부파일 파일 수정, 삭제 버튼
const NoticeViewFile = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    div{
        width: 1024px;
        margin-top: 10px;
    }

`

// 수정, 삭제, 돌아가기 버튼
const NoticeViewBtn = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;

    display: flex;
    justify-content: center;
`
export default NoticeWrite;

