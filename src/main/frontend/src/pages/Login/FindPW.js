import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";




//아이디찾기
function FindLogin() {

    const navigate = useNavigate();

    const [findPasswordForm, setFindPasswordForm] = useState({
        memId: '',
        memEmail: ''
    });

    // const [username, setUsername] = useState("");
    const [message, setMessage] = useState('');

    // 비밀번호 찾기 form 관련
    const handleFindPasswordChange = (e) => {
        setFindPasswordForm({ ...findPasswordForm, [e.target.name]: e.target.value });
    };

    // 비밀번호 찾기 로직
    const handleFindPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/find-password', findPasswordForm);
            setMessage("비밀번호 재설정 이메일 발송 완료");
            alert("비밀번호 재설정 이메일 발송 완료");


        } catch (error) {
            setMessage("요청을 처리하는 동안 오류가 발생했습니다")
            alert("요청을 처리하는 동안 오류가 발생했습니다");
            console.error("handleFindPassword error:", error);

        }
    };


    //HTML
    return(
        <EmailLoginContainer>
            <Form onSubmit={handleFindPassword}>
                <EmailLoginInput
                    placeholder="아이디"
                    type="text"
                    id="memId"
                    name="memId"
                    value={findPasswordForm.memId}
                    required
                    onChange={handleFindPasswordChange}
                />
                <EmailLoginInput
                    placeholder="이메일"
                    type="email"
                    id="memEmail"
                    name="memEmail"
                    className='commonpage'
                    value={findPasswordForm.memEmail}
                    required
                    onChange={handleFindPasswordChange}
                />


                {/*아이디찾기 버튼*/}
                <CommonButton
                    type="submit"
                >
                   비밀번호 찾기
                </CommonButton>
            </Form>
        </EmailLoginContainer>
    );
}

export default FindLogin;


// 폼 디자인
const EmailLoginContainer = styled.div`
    width: 100%;
    margin: 0 auto;
    //background-color: red;
    transition: 0.5s;
`;


//폼 박스
const Form = styled.form`
    width: 320px;
    margin-top: 120px;
`;

// 인풋 디자인
const EmailLoginInput = styled.input`
    width: 100%;
    font-size: 15px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 400;
    height: 53px;
    color: #fff;
    background-color: #2f2f2f;
    text-indent: 10px;
    border: 0;
    border-radius: 5px;
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    outline: none;

    &:last-child {
        margin-bottom: 0;
    }
`;

//버튼 디자인
const CommonButton = styled.button`
    font-family: 'SUIT-Regular' !important;
    display: block;
    height: 48px;
    border-radius: 30px;
    font-size: 18px;
    color: #fff;
    background: #1351f9;
    border-radius: 30px;
    width: 100%;
    margin-left: 0;
    margin-top: 25px;
    margin-bottom: 20px;
    border: none;
    box-sizing: border-box;
    transition: border-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    //호버시 보색

    &:hover{
        background:rgba(0,0,0,0.1);
        border: 1px solid #fff;
    }

    }
`;