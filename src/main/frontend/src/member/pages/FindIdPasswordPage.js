import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../common/css/FindIdPassword.css';

function FindIdPassword() {

    const navigate = useNavigate();

    const [findIdForm, setFindIdForm] = useState({
        memName: '',
        memEmail: ''
    });

    const [findPasswordForm, setFindPasswordForm] = useState({
        memId: '',
        memEmail: ''
    });

    const [message, setMessage] = useState('');

    // 아이디 찾기 폼 관련
    const handleFindIdChange = (e) => {
        setFindIdForm({ ...findIdForm, [e.target.name]: e.target.value });
    };

    // 비밀번호 찾기 폼 관련
    const handleFindPasswordChange = (e) => {
        setFindPasswordForm({ ...findPasswordForm, [e.target.name]: e.target.value });
    };

    // 아이디 찾기 로직
    const handleFindId = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/find-id', findIdForm);
            alert(`아이디: ${response.data}`);
        } catch (error) {
            alert('회원정보를 찾지 못했습니다.');
        }
    };

    // 비밀번호 찾기 로직
    const handleFindPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/find-password', findPasswordForm);

            setMessage('비밀번호 재설정 이메일 발송완료');

            alert('비밀번호 재설정 이메일 발송완료');

        } catch (error) {
            setMessage('요청을 처리하는 동안 오류가 발생했습니다');

            alert('요청을 처리하는 동안 오류가 발생했습니다');
        }
    };

    return (
        <div className="wrapfindid">
            <div className="find_id">
                <div className="fi_id">
                    <h2>아이디 찾기</h2>
                </div>
                <div className="f_id">
                    <form onSubmit={handleFindId}>
                        <label htmlFor="memName">이름</label>
                        <input
                            type="text"
                            id="memName"
                            name="memName"
                            className='commonpage'
                            value={findIdForm.memName}
                            onChange={handleFindIdChange}
                        /><br />
                        <label htmlFor="memEmail">이메일</label>
                        <input
                            type="email"
                            id="memEmail"
                            name="memEmail"
                            className='commonpage'
                            value={findIdForm.memEmail}
                            onChange={handleFindIdChange}
                        /><br />
                        <button type="submit"
                                className='loginbutton'>아이디 찾기
                        </button>

                    </form>

                </div>

            </div>

            <div className="find_pw">

                <div className="fi_pw">
                    <h2>비밀번호 찾기</h2>
                </div>

                <div className="f_pw">

                    <form onSubmit={handleFindPassword}>

                        <label htmlFor="memId">아이디</label>

                        <input
                            type="text"
                            id="memId"
                            name="memId"
                            className='commonpage'
                            value={findPasswordForm.memId}
                            onChange={handleFindPasswordChange}
                        /><br />

                        <label htmlFor="memEmail">이메일</label>

                        <input
                            type="email"
                            id="memEmail"
                            name="memEmail"
                            className='commonpage'
                            value={findPasswordForm.memEmail}
                            onChange={handleFindPasswordChange}
                        /><br />

                        <button type="submit"
                                className='passwordbutton'>비밀번호 찾기
                        </button>

                    </form>

                </div>

            </div>

            {message && <div className="message">{message}</div>}

        </div>
    );
}

export default FindIdPassword;