import axios from "axios";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import google from "./images/continue_google_neutral.png";
import { Link } from "react-router-dom";

// Logins-로그인
function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberUserName, setRememberUserName] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken){
            localStorage.removeItem('accessToken');
        }


    }, []);

    // 아이디 저장 관련 - 1
    useEffect(() => {
        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberUserName(true);
        }
    }, []);

    // 아이디 저장 관련 - 2
    const handleRememberUserName = (e) => {
        setRememberUserName(e.target.checked);
        if (!e.target.checked) {
            localStorage.removeItem('savedUsername');
        }
    };

    // json 양식
    let body = {
        memId: username,
        memPassword: password,
    };

    // 로그인 기능
    const onSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 방지


        try {
            const response = await axios.post(
                "/auth/login",
                body,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // 토큰이 null값이 아닐경우 ( 정상적인 로그인일때 )
            if (response.data.accessToken !== null) {

                // 로컬스토리지 정리
                localStorage.clear();

                // 토큰 저장
                localStorage.setItem("accessToken", response.data.accessToken);

                // 로그인 방식 저장
                localStorage.setItem('loginMethod', response.data.loginMethod);

                // 아이디 저장 관련
                if (rememberUserName) {
                    localStorage.setItem('savedUsername', username);
                } else {
                    localStorage.removeItem("savedUsername");
                }
                console.log("login success:", username);

                // 메인페이지 이동
                window.location.replace("/");
            } else {

                // 로그인이 되지 않았을경우 리셋( 기본값 )
                setUsername("");
                setPassword("");
                localStorage.clear();
            }
        } catch (e) {
            alert(
                "회원 정보가 일치 하지 않습니다. 아이디와 비밀번호를 다시 확인해 주세요!"
            );
            console.error("login onSubmit error", e);
        }
    };

//html
    return (
        <LoginWrap>
            <LoginContainer>
                <LoginSigninContent>
                    <BorderAndText>
                        <LoginHeadText>로그인</LoginHeadText>
                    </BorderAndText>
                    <LoginHeadTexts>Rock 계정으로 로그인</LoginHeadTexts>
                    <EmailLoginContainer>
                        <form onSubmit={onSubmit}>
                            <div>

                                <EmailLoginInput
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    placeholder="아이디"
                                    required
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                                <EmailLoginInput
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="비밀번호"
                                    required
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    onKeyUp={(e) => {
                                        if(e.key === 'Enter'){
                                            e.preventDefault()
                                            onSubmit(e);
                                        }
                                    }}
                                />
                            </div>
                            <EmailLoginOption>
                                <div className="inputCheckbox">
                                    <input type="checkbox" id="id-save" className="input-id-save"
                                           required
                                           checked={rememberUserName}
                                           onChange={handleRememberUserName}

                                    />
                                    <label htmlFor="id-save" className="label-id-save">아이디 저장</label>
                                </div>
                                <a href="/FindIdPassword" className="find">아이디 찾기&nbsp;&nbsp;|&nbsp;&nbsp;비밀번호 찾기</a>
                            </EmailLoginOption>
                            <CommonButton
                                type="button"
                                onClick={(e) => {
                                    onSubmit(e);
                                    // console.log("body: " + username + ", " + password);
                                }}
                            >
                                <a>로그인</a>
                            </CommonButton>
                        </form>
                        <SignupButton>
                            <Link to="/SignUp">회원가입</Link>
                        </SignupButton>
                        <LoginSignupContent>
                            <LogoImg
                                alt="logo"
                                src={google}
                                onClick={() => {
                                    window.location.replace("http://localhost:8080/oauth2/authorization/google");
                                }}
                            >
                            </LogoImg>
                        </LoginSignupContent>
                    </EmailLoginContainer>
                </LoginSigninContent>
            </LoginContainer>
        </LoginWrap>
    );
}




//로그인 버튼
const CommonButton = styled.button`
    display: block;
    height: 48px;
    border-radius: 30px;
    font-size: 18px;
    color: #fff;
    background: #1351f9;
    border-radius: 5px;
    width: 100%;
    margin-left: 0;
    margin-top: 5px;
    margin-bottom: 20px;
    border: none;
    box-sizing: border-box;
    transition: border-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    //호버시 보색

    &:hover{
        background:rgba(0,0,0,0.1);
        border: 1px solid #fff;
    }

    a{
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        vertical-align: middle;
        color: #ffffff;
        line-height: 20px;
        font-size: 18px;
        font-weight: 500;
        font-family: 'SUIT-Regular' !important;
        display: flex;
        justify-content: center;

        //&:hover{
        //    color: #1351f9;
        //    font-weight: 800;
        //}

    }
`;
// 회원가입 버튼
const SignupButton = styled.button`
    display: block;
    height: 48px;
    border-radius: 30px;
    font-size: 18px;
    color: #fff;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid #fff;
    border-radius: 5px;
    width: 100%;
    margin-left: 0;
    margin-top: 5px;
    margin-bottom: 20px;
    box-sizing: border-box;
    transition: border-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

    &:hover{
        background:#1351f9;
        border: none;
    }


    a{
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        vertical-align: middle;
        color: #ffffff;
        line-height: 20px;
        font-size: 18px;
        font-weight: 500;
        font-family: 'SUIT-Regular' !important;
        display: flex;
        justify-content: center;
    }
`;




// 로그인 이메일 저장 체크 구간
const EmailLoginOption = styled.div`
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #a5a5a5;
    font-size: 14px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 400;


    .inputCheckbox{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    input[type=checkbox]{
        border: 1px solid #d9d9d9;
        width: 18px;
        height: 18px;
    }
    .label-id-save{
        vertical-align: middle;
        padding: 10px 10px;
        color: #a5a5a5;
        font-size: 15px;
        font-family: 'SUIT-Regular' !important;
        font-weight: 400;
    }
    //아이디/비밀번호 찾기
    .find{
        color: #a5a5a5;
        font-size: 15px;
        font-family: 'SUIT-Regular' !important;
        font-weight: 500;

        &:hover{
            color: #ff27a3;
            font-weight: 800;
        }
    }

`;


// 이메일 인풋
const EmailLoginInput = styled.input`
    width: 100%;
    font-size: 15px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 400;
    height: 53px;
    color: #fff;
    background-color: #2f2f2f;
    border: 0;
    border-radius: 5px;
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    padding: 0 15px;
    outline: none;

    &:last-child {
        margin-bottom: 0;
    }
`;

// 폼 디자인
const EmailLoginContainer = styled.div`
    float: left;
    width: 560px;
    padding: 0 40px;
`;

const LoginSigninContent = styled.div`
`;



//구글 인증 전체 박스
const LoginSignupContent = styled.div`
    width: 100%;
    height: 46px;
    background: #f2f2f2;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
//구글 인증 로그인 버튼
const LogoImg = styled.img`
    cursor: pointer;
    display: block;
    width: auto;
    height: 44px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
    text-align: center;
    transition: border-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    outline: none;
`;





const BorderAndText = styled.div`
    margin: 0 auto;
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 32px;
    font-weight: 500!important;
    margin-top: 20px;


`;

const  LoginHeadTexts= styled.div`
    font-size: 16px;
    text-align: center;
    color: #527fff;
    margin-bottom: 40px;
    line-height: 14px;
    font-weight: 500;
`;


const LoginHeadText = styled.div`
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 32px;
    text-align: center;
    color: #fff;
`;


// 로그인 전체 박스
const LoginContainer = styled.div`
    background: rgba(11, 11, 13,0.6);

    @media (min-width: 720px) {
        //padding: 1px 0 50px;
        width: 560px;
        display: block;
        //margin: 0 auto;
        overflow: hidden;
        padding: 40px 0;
        margin: 80px auto;
        height: 600px;
    }
`;

// 전체 박스
const LoginWrap = styled.div`
    padding: 1px;
    min-height: 100%;
    height: 735px;
    background-image:url('./images/bg_3.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
`;
export default Login;
