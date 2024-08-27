import React, { useState } from 'react';
import axios from 'axios';
import '../../common/css/SignUp.css';
import { useNavigate } from 'react-router-dom';

function SignUp() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        memId: '',
        memPassword: '',
        memPasswordCheck: '',
        memName: '',
        memEmail: '',
        memBirthdate: '',
        memGender: '',
        memTel: '',
    });

    const [emailVerificationCode, setEmailVerificationCode] = useState('');

    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const [isIdAvailable, setIsIdAvailable] = useState(false);

    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [passwordError, setPasswordError] = useState('');

    // 비밀번호 정규식
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasNonalphas = /\W/.test(password);

        if (password.length < minLength) {
            return '비밀번호는 최소 8자 이상이어야 합니다.';
        } else if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas)) {
            return '비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
        }
        return '';
    };

    // 입력값 변경될때
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const newData = { ...prevData, [name]: value };
            if (name === 'memPassword') {
                setPasswordError(validatePassword(value));
            }
            return newData;
        });
    };

    // 아이디 중복 검사
    const checkIdAvailability = async () => {
        try {
            const response = await axios.get(`/auth/check-id?memId=${formData.memId}`);

            setIsIdAvailable(!response.data);

            alert(response.data ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.");
        } catch (error) {
            console.error("ID 중복 확인 중 오류 발생:", error);
            
            alert("ID 중복 확인 중 오류가 발생했습니다.");
        }
    };

    // 이메일 중복 검사 및 인증메일 발송
    const sendVerificationEmail = async () => {
        try {
            const response = await axios.post(`/auth/check-and-send-verification?memEmail=${formData.memEmail}`);

            alert(response.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data);
            } else {
                console.error("이메일 확인 또는 인증 메일 발송 중 오류 발생:", error);

                alert("처리 중 오류가 발생했습니다.");
            }
        }
    };

    // 이메일 인증 ( 코드 )
    const verifyEmail = async () => {
        try {
            const response = await axios.post('/auth/verify-email', null, {

                params: {
                    email: formData.memEmail,

                    verificationCode: emailVerificationCode
                }
            });
            setIsEmailVerified(true);
            alert("이메일이 성공적으로 인증되었습니다.");
        } catch (error) {
            alert("이메일 인증에 실패했습니다.");
        }
    };

    // 회원가입 완료 (저장) 하기 전에 마지막으로 확인 작업
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isIdAvailable) {
            alert("아이디 중복 확인을 해주세요.");
            return;
        }

        if (!isEmailVerified) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }

        if (!agreeToTerms) {
            alert("이용약관에 동의해주세요.");
            return;
        }

        if (formData.memPassword !== formData.memPasswordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const passwordValidationError = validatePassword(formData.memPassword);
        if (passwordValidationError) {
            alert(passwordValidationError);
            return;
        }

        const formDataToSend = {
            memId: formData.memId,
            memPassword: formData.memPassword,
            memPasswordCheck: formData.memPasswordCheck,
            memName: formData.memName,
            memBirth: formData.memBirthdate,
            memGender: formData.memGender,
            memTel: formData.memTel,
            memEmail: formData.memEmail
        };

        try {
            const response = await axios.post('/auth/signup', formDataToSend);
            alert("회원가입이 완료되었습니다.");
            navigate('/Login');
        } catch (error) {
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
            navigate('/SignUp')
        }
    };

    return (

        <div className="wrap">

            <div className='signupheder'><h2>회원가입</h2></div>

            <form onSubmit={handleSubmit}>

                <div className="inner">

                    <div className='idDiv'>

                        <div className='username2'>아이디
                            <input type="text"
                                   name="memId"
                                   value={formData.memId}
                                   onChange={handleChange}
                                   className='commonpage'
                                   placeholder={"아이디를 입력해주세요."}/>
                        </div>

                        <button type="button"
                                onClick={checkIdAvailability}
                                className='idbutton'>중복 확인
                        </button>

                    </div>

                    <div className='password2'>비밀번호
                        <input type="password"
                               name="memPassword"
                               value={formData.memPassword}
                               onChange={handleChange}
                               className='commonpage'
                        placeholder={"8자 이상 대문자, 소문자, 숫자, 특수문자를 포함해야합니다"}/>
                    </div>
                    {passwordError && <div className="error-message">{passwordError}</div>}

                    <div className='passwordcheck'>비밀번호 확인
                        <input type="password"
                               name="memPasswordCheck"
                               value={formData.memPasswordCheck}
                               onChange={handleChange}
                               className='commonpage'/>
                    </div>

                    <div className='name2'>이름
                        <input type="text"
                               name="memName"
                               value={formData.memName}
                               onChange={handleChange}
                               className='commonpage'/>
                    </div>

                    <div className='emailDiv'>
                        <div className='email2'>이메일
                            <input type="email"
                                   name="memEmail"
                                   value={formData.memEmail}
                                   onChange={handleChange}
                                   className='commonpage'
                            placeholder={"이메일을 정확히 작성해 주세요."}/>
                        </div>
                        <button type="button"
                                onClick={sendVerificationEmail}
                                className='idbutton'>이메일<br/>인증
                        </button>
                    </div>

                    <div className='emailDiv'>
                        <div className='email2'>인증 코드
                            <input type="text"
                                   value={emailVerificationCode}
                                   onChange={(e) => setEmailVerificationCode(e.target.value)}
                                   className='commonpage'
                            placeholder={"이메일을 확인해주세요."}/>
                        </div>
                        <button type="button"
                                onClick={verifyEmail}
                                className='idbutton'>인증
                        </button>
                    </div>

                    <div className='bu'>생년월일
                        <input type="date"
                               name="memBirthdate"
                               value={formData.memBirthdate}
                               onChange={handleChange}
                               className='commonpage'/>
                    </div>

                    <div className="gender">
                        <div id="mg">
                            <label htmlFor="gender">성별 선택</label>
                        </div>
                        <div className="asd">
                            <select id="gender"
                                    name="memGender"
                                    value={formData.memGender}
                                    onChange={handleChange}
                                    className="sel"
                                    required>
                                <option value="">선택</option>
                                <option value="남성">남성</option>
                                <option value="여성">여성</option>
                            </select>
                        </div>
                    </div>

                    <div className='phonnumber'>휴대폰 번호
                        <input type="tel"
                               name="memTel"
                               value={formData.memTel}
                               onChange={handleChange}
                               className='commonpage'
                        placeholder={" \' - \' 을 제외한 나머지를 작성해주세요."}/>
                    </div>

                </div>

                <div className='textfile'>
                    <h3 className="title">이용약관</h3>
                    <div className="text">
                        {/* 이용약관 내용 */}
                    </div>
                    <label className="custom-checkbox">
                        <input type="checkbox"
                               required onChange={(e) => setAgreeToTerms(e.target.checked)}/>
                        <span className="checkmark">동의(필수)</span>
                    </label>
                </div>

                <button type="submit"
                        className='signupsubmit'>회원가입
                </button>

            </form>

        </div>
    );
}

export default SignUp;