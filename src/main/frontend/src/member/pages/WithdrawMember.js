import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../common/css/WithdrawMember.css";
import WithdrawModal from "../component/WithdrawModal";

function WithdrawMember() {
    const [modal, setModal] = useState(false);
    const [memPassword, setMemPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        setMemPassword(e.target.value);
    };

    // 비밀번호 확인
    const verifyPassword = async () => {
        try {
            const response = await axios.post('/auth/verify-password', { memPassword }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return response.data;
        } catch (error) {
            console.error('비밀번호 확인 오류:', error);
            return false;
        }
    };

    // 탈퇴 버튼 클릭시
    const handleWithdraw = async () => {
        const isPasswordCorrect = await verifyPassword();
        if (!isPasswordCorrect) {
            setError('비밀번호가 올바르지 않습니다.');
            return;
        }

        setModal(true);
    };

    // 탈퇴 처리 함수
    const confirmWithdraw = async () => {
        try {
            const response = await axios.delete('/auth/delete', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            localStorage.removeItem('accessToken');
            return response.data;
        } catch (error) {
            console.error('회원 탈퇴 오류:', error);
            throw error;
        }
    };

    return (
        <>
            {modal && <WithdrawModal onClose={() => setModal(false)} onConfirmWithdraw={confirmWithdraw} />}
            <div className="withdraw_title">
                <h2>탈퇴하기</h2>
            </div>
            <div className="password_form_div">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="password_div">
                        <div>
                            비밀번호 입력:
                        </div>
                        <div>
                            <input
                                type="password"
                                className="check_password"
                                value={memPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="withdraw">
                        <button type="button" className="withdraw_btn" onClick={handleWithdraw}>
                            탈퇴하기
                        </button>
                    </div>
                </form>
            </div>
            <div className="main_page">
                <button className="ReturnBtn" onClick={() => navigate(-1)}>돌아가기</button>
            </div>
        </>
    );
}

export default WithdrawMember;