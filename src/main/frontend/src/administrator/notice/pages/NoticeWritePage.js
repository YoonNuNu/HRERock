import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// CSS
import '../../../common/css/NoticeWrite.css';

function NoticeWritePage() {
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContent, setBoardContent] = useState('');
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    const handleTitleChange = (e) => {
        setBoardTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setBoardContent(e.target.value);
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            boardTitle: boardTitle,
            boardContent: boardContent,
        };

        try {
            const response = await axios.post('/admin/boardWrite', data);
            console.log('게시글 작성 성공:', response);
            const boardId = response.data.boardId; // 서버에서 반환한 게시글 ID

            if (files.length > 0) {
                await uploadFiles(boardId, files);
            } else {
                navigate('/admin/Notice');
            }
        } catch (error) {
            console.error('게시글 작성 실패:', error);
            alert('게시글 작성에 실패했습니다.');
        }
    };

    const uploadFiles = async (boardId, files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post(`/admin/boardUpload/${boardId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('파일 업로드 성공:', response);
            navigate('/admin/Notice');
        } catch (error) {
            console.error('파일 업로드 실패:', error.response ? error.response.data : error.message);
            alert('파일 업로드에 실패했습니다. 게시글은 작성되었습니다.');
            navigate('/admin/Notice');
        }
    };

    return (
        <div className="NoticeWrite">
            <form className="writeForm" onSubmit={handleSubmit}>
                {/* 제목 */}
                <div className="WritetTitle">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="제목을 입력하세요"
                        value={boardTitle}
                        onChange={handleTitleChange}
                    />
                </div>

                {/* 내용 */}
                <div className="WriteText">
                    <textarea
                        name="content"
                        id="content"
                        cols="40"
                        rows="10"
                        required
                        value={boardContent}
                        onChange={handleContentChange}
                    ></textarea>
                </div>

                {/* 첨부파일버튼 */}
                <div className="FileUpload">
                    <input
                        type="file"
                        id="file"
                        name="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>

                {/* 글쓰기 버튼 */}
                <div className="WriteSubmit">
                    <input type="submit" value="글쓰기" className="submit" />
                </div>
            </form>
        </div>
    );
}

export default NoticeWritePage;
