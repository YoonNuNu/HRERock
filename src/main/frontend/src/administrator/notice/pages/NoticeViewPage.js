import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../../common/css/NoticeView.css';

function NoticeViewPage() {
  const [noticeInfo, setNoticeInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { boardId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }

    axios.get('/auth/memberinfo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (response.data.memRole !== 'ADMIN') {
        alert("권한이 없습니다.");
        navigate('/Login');
      } else {
        setIsAdmin(true);
        getBoardDetail(boardId);
      }
    }).catch(error => {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      alert("오류가 발생했습니다. 다시 로그인해주세요.");
      navigate('/login');
    });
  }, [boardId, navigate]);

  const getBoardDetail = (boardId) => {
    console.log(`Fetching details for board ID: ${boardId}`); // 디버깅 로그 추가
    axios.get(`/admin/${boardId}`)
      .then(response => {
        console.log('게시글 상세 정보:', response.data); // 디버깅 로그 추가
        setNoticeInfo(response.data);
      })
      .catch(error => {
        console.error('게시글 상세 정보를 가져오는 중 오류 발생:', error);
        handleAxiosError(error);
      });
  };

  const editPost = () => {
    const token = localStorage.getItem('accessToken');
    const editedTitle = document.getElementById('boardTitle').value;
    const editedContent = document.getElementById('boardContent').value;

    axios.patch(`/admin/${boardId}/boardUpdate`, {
      boardId,
      boardTitle: editedTitle,
      boardContent: editedContent
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log('게시글 수정 완료:', response.data);
      navigate(-1);
    }).catch(error => {
      console.error('게시글 수정 중 오류 발생:', error);
      handleAxiosError(error);
    });
  };

  const deletePost = () => {
    const token = localStorage.getItem('accessToken');

    axios.delete(`/admin/${boardId}/boarddelete`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log('게시글 삭제 완료:', response.data);
      alert('게시글이 삭제되었습니다.');
      navigate('/admin/Notice');
    }).catch(error => {
      console.error('게시글 삭제 중 오류 발생:', error);
      handleAxiosError(error);
    });
  };

  const downloadFile = () => {
    const token = localStorage.getItem('accessToken');
    const boardFileId = noticeInfo?.files?.[0]?.boardFileId;

    if (!boardFileId) {
      alert("다운로드할 파일이 없습니다.");
      return;
    }

    axios.get(`/admin/boardDownload`, {
      params: { boardFileId },
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = getFileNameFromContentDisposition(response.headers['content-disposition']);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch(error => {
      console.error('파일 다운로드 중 오류 발생:', error);
      handleAxiosError(error);
    });
  };

  const getFileNameFromContentDisposition = (contentDisposition) => {
    if (!contentDisposition) return 'file.txt';
    const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = fileNameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) return matches[1].replace(/['"]/g, '');
    return 'file.txt';
  };

  const handleAxiosError = (error) => {
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
      console.error('응답 상태:', error.response.status);
      alert('오류가 발생했습니다. 상세 오류를 확인하세요.');
    } else if (error.request) {
      console.error('요청:', error.request);
      alert('서버에 요청을 보내지 못했습니다. 네트워크 연결을 확인하거나 관리자에게 문의하세요.');
    } else {
      console.error('오류 메시지:', error.message);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (!noticeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="noticeView">
      <div className="noticeViewHead">
        <div className="noticeViewTitle">
          <input type="text" id="boardTitle" className="post_title" defaultValue={noticeInfo.boardTitle} />
        </div>
        <div className="noticeViewInfo">
          <span>날짜: {noticeInfo.modifyDate}</span>
          <span>조회수: {noticeInfo.boardViewCount ?? '조회수 정보 없음'}</span>
        </div>
      </div>
      <div className="noticeViewContent">
        <textarea id="boardContent" className="post_text" defaultValue={noticeInfo.boardContent} read></textarea>
      </div>
      <div className="noticeViewBtn">
        <div className="btn_left"></div>
        <div className="btn_center">
          {isAdmin && (
            <>
              <button className="modify_btn" onClick={editPost}>수정</button>
              <button className="delete_btn" onClick={deletePost}>삭제</button>
              <button className="download_btn" onClick={downloadFile}>파일 다운로드</button>
            </>
          )}
        </div>
        <div className="btn_right">
          <button className="back_to_list" onClick={() => navigate('/admin/Notice')}>목록으로<br /> 돌아가기</button>
        </div>
      </div>
    </div>
  );
}

export default NoticeViewPage;
