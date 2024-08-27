import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import google_login from '../../common/img/google_login.png';

// css
import '../../common/css/Login.css';

function LoginPage() {
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {

        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }

        const form = document.getElementById('login-form');

        // 폼 요소 가져옴
        const handleSubmit = async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // 로그인 요청
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    memId: username,
                    memPassword: password
                })
            });

            // 응답 처리
            if (response.ok) {
                const data = await response.json();

                // 로컬스토리지 토큰 & 메서드 저장
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('loginMethod', 'custom');

                if (rememberMe) {
                    localStorage.setItem('savedUsername', username);
                } else {
                    localStorage.removeItem('savedUsername');
                }

                navigate('/')
            } else {
                alert('로그인 실패');
            }
        };

        form.addEventListener('submit', handleSubmit);

        return () => {
            form.removeEventListener('submit', handleSubmit);
        };
    }, [username, rememberMe, navigate]);

    // 구글로그인 로직
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const handleRememberMe = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    return (
        <>
            <div className="login-container">
                <div id="login-header">
                    <h2>로그인</h2>
                </div>

                <form id="login-form">
                    <div className='wrap'>
                        <div className="box1">
                            <div className="box2">
                                <label htmlFor="username">아이디:</label>
                            </div>
                            <div className="box3">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="box">
                            <div className="box2">
                                <label htmlFor="password">비밀번호:</label>
                            </div>
                            <div className="box3">
                                <input type="password" id="password" name="password" required/>
                            </div>
                        </div>
                    </div>

                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="remember-me"
                            checked={rememberMe}
                            onChange={handleRememberMe}
                        />
                        <label htmlFor="remember-me">아이디 저장</label>
                    </div>

                    <div className="box4">
                        <input type="submit" className="submit" value="로그인"/>
                    </div>
                </form>

                <div className="google_login">
                    <button onClick={handleGoogleLogin}>
                        <img src={google_login} alt="구글로그인버튼"/>
                    </button>
                </div>

                <div className="signup">
                    <div className="signupLink">
                        <Link to="/SignUp" className='white'>회원가입</Link>
                    </div>
                    <div className="signup3">
                        <Link to="/FindIdPassword" className='white'>아이디/비밀번호 찾기</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;