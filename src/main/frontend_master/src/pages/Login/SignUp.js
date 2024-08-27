import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { Button, FormSelect } from "react-bootstrap";
// import SelectorEngine from "bootstrap/js/src/dom/selector-engine";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



// SignUp-회원가입
function SignUp() {
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
            'Content-Type': 'application/json',
        }
    })
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

    const [emailVerificationCode, setEmailVerificationCode] = useState();

    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const [isIdAvailable, setIsIdAvailable] = useState(false);

    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [passwordError, setPasswordError] = useState('');

    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    
    const validatePassword = (password) => {
           const minLength = 8;
           const hasUpperCase = /[A-Z]/.test(password);
           const hasLowerCase = /[a-z]/.test(password);
           const hasNumberCase = /\d/.test(password);
           const hasNonalpha = /\W/.test(password);


           if(password.length < minLength){
                return("비밀번호는 최소 8자 이상이어야 합니다");
           }
           else if(!(hasUpperCase && hasLowerCase && hasNumberCase && hasNonalpha)){
                return ("비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다");
           }
        return('');
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData(prevData => {
            const newData = {...prevData, [name]: value};
            if(name === 'memPassword'){
                setPasswordError(validatePassword(value));
            }
             return newData;
        });
    };

    // 아이디 중복 검사
    const checkIdAvailability = async () => {
        try {
            const response = await api.get(`/auth/check-id?memId=${formData.memId}`);

            if(!formData.memId){
                alert("아이디를 입력해주세요");
                setIsIdAvailable(false);
                return;
            }
            else if(!(/[a-z]/.test(formData.memId) && /\d/.test(formData.memId))){
                alert("아이디는 소문자와 숫자만 이용하여 작성해야합니다.");
                setIsIdAvailable(false);
                return;
            }

            else{
                if(response.data){
                    alert("이미 사용중인 아이디입니다.");
                    setIsIdAvailable(false);
                }
                else{
                    alert("사용 가능한 아이디입니다.")
                    setIsIdAvailable(true);
                }
            }
            // alert(response.data ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.");
            console.log(isIdAvailable);
        } 
        catch (error) {
            console.error("ID 중복 확인 중 오류 발생:", error);
            
            alert("ID 중복 확인 중 오류가 발생했습니다.");
        }   

    };


    // 이메일 중복 검사 및 인증메일 발송
    const sendVerificationEmail = async () => {
        try {
            console.log("Sending verification email to:", formData.memEmail);
            const response = await api.post(`/auth/check-and-send-verification?memEmail=${encodeURIComponent(formData.memEmail)}`);
            console.log("Server response:", response);
            alert(response.data.message || "이메일 발송 성공");
        } catch (error) {
            console.error("Error details:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                alert('이미 존재하는 이메일입니다. 다른 이메일로 인증해주세요');
            } else if (error.request) {
                console.error("Request details:", error.request);
                alert("서버에 요청을 보냈으나 응답을 받지 못했습니다.");
            } else {
                console.error("Error message:", error.message);
                alert(`알 수 없는 오류: ${error.message}`);
            }
        }
    };

    // 이메일 인증 코드
    const verifyEmail = async () => {
        try {
            const response = await api.post('/auth/verify-email', null, {

                params: {
                    email: formData.memEmail,

                    verificationCode: emailVerificationCode
                }
            });
            setIsEmailVerified(true);
            alert("이메일이 성공적으로 인증되었습니다.");
        }
        catch(error){
            alert("이메일 인증에 실패했습니다.");
        }
    };

    const fake = () => {
        alert("현재 개인정보를 수집하고 있지 않습니다🙂 안심하고 테스트 해보세요.");
    };

    const allAgreeHandler = (checked) => {
        setIsAllChecked(!isAllChecked);
        if (checked) {
            setCheckedItems([...checkedItems, "provision", "privacy"]);
        } else if (
            (!checked && checkedItems.includes("provision")) ||
            (!checked && checkedItems.includes("privacy"))
        ) {
            setCheckedItems([]);
        }
    };

    const agreeHandler = (checked, value) => {
        if (checked) {
            setCheckedItems([...checkedItems, value]);
        } else if (!checked && checkedItems.includes(value)) {
            setCheckedItems(checkedItems.filter((el) => el !== value));
        }
    };

    useEffect(() => {
        if (checkedItems.length >= 2) {
            setAgreeToTerms(true);
        } else {
            setAgreeToTerms(false);
        }
    }, [checkedItems]);

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
            const response = await api.post('/auth/signup', formDataToSend);
            alert("회원가입이 완료되었습니다.");
            navigate('/Login');
        } catch (error) {
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
            navigate('/SignUp')
        }
    };

    return (
        <WrapLogin>
            <HeadBannerGroup />
            <ReauthPhone onSubmit={handleSubmit}>
                <LoginWrap>


                    <LoginSection>
                        <div className="step-bar">
                            <span className="gradation-blue"></span>
                        </div>
                        <LoginTitle>회원가입
                            <LoginSubtitle>아이디와 이메일로 간편하게 무빙을 시작하세요!</LoginSubtitle>
                        </LoginTitle>





                        {/*아이디*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 아이디
                            </FormBlockHead>
                            <FormBlockBody>
                                <InputTextSizeW>
                                    <EmailsInput
                                        id="id"
                                        type="text"
                                        name="memId"
                                        value={formData.memId}
                                        placeholder="아이디를 입력해주세요."
                                        required
                                        onChange={handleChange}
                                    // onBlur={() => emailCheck()}
                                    />
                                    <EmailsButton
                                        type="button"
                                        onClick={checkIdAvailability}
                                    >중복 확인</EmailsButton>
                                </InputTextSizeW>


                            </FormBlockBody>
                        </FormBlock>


                        {/*비밀번호*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 비밀번호
                            </FormBlockHead>
                            <FormBlockBody>
                                <InputTextSizeW>
                                    <EmailInput
                                        id="password"
                                        type="password"
                                        name="memPassword"
                                        value={formData.memPassword}
                                        placeholder="비밀번호 (영문+숫자+특수문자 8자 이상)"
                                        required
                                        onChange={handleChange}
                                    />
                                </InputTextSizeW>
                                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                            </FormBlockBody>
                            <FormBlockBody>
                                <InputTextSizeW>
                                    <EmailInput
                                        type="password"
                                        name="memPasswordCheck"
                                        value={formData.memPasswordCheck}
                                        onChange={handleChange}
                                        placeholder="비밀번호 확인" required />
                                </InputTextSizeW>
                            </FormBlockBody>
                        </FormBlock>


                        {/*이름*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 이름
                            </FormBlockHead>
                            <FormBlockBody>
                                <InputTextSizeWTypeL>
                                    <EmailInput
                                        id="memName"
                                        name="memName"
                                        value={formData.memName}
                                        type="text"
                                        placeholder="이름을 입력해 주세요"
                                        onChange={handleChange}
                                        required
                                    />
                                </InputTextSizeWTypeL>
                            </FormBlockBody>
                        </FormBlock>


                        {/*전화번호*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 전화번호  (＊하이픈 제외 입력)
                            </FormBlockHead>
                            <FormBlockBody>
                                <UiInputBtnCombo>
                                    <InputTextSizeWTypeL>
                                        <PhoneInput type="hidden" required />
                                        <PhoneInput
                                            type="tel"
                                            placeholder="010-1234-5678"
                                            name="memTel"
                                            value={formData.memTel}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputTextSizeWTypeL>
                                </UiInputBtnCombo>
                            </FormBlockBody>
                        </FormBlock>


                        {/*★★★★여기부터!!!!!!!!!!!!!!!!!!!*/}
                        {/*이메일 인증*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 이메일
                            </FormBlockHead>
                            <FormBlockBody>
                                <UiInputBtnCombo>
                                    <InputTextSizeWTypeL>
                                        <EmailsInput type="hidden" required />
                                        <EmailsInput
                                            type="email"
                                            name="memEmail"
                                            placeholder="이메일을 입력해주세요"
                                            onChange={handleChange}
                                            value={formData.memEmail}
                                            required
                                        />
                                        <EmailsButton
                                            type="button"
                                            onClick={sendVerificationEmail}
                                        >
                                            이메일 전송
                                        </EmailsButton>

                                    </InputTextSizeWTypeL>
                                </UiInputBtnCombo>
                            </FormBlockBody>
                        </FormBlock>


                        {/*이메일 인증*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 인증코드
                            </FormBlockHead>
                            <FormBlockBody>
                                <UiInputBtnCombo>
                                    <InputTextSizeWTypeL>
                                        <EmailsInput type="hidden" required />
                                        <EmailsInput
                                            type="text"
                                            placeholder="이메일을 확인해주세요"
                                            value={emailVerificationCode}
                                            onChange={(e) => setEmailVerificationCode(e.target.value)}
                                            data-auth=""
                                            required
                                        />
                                        <EmailsButton
                                            type="button"
                                            onClick={verifyEmail}
                                        >
                                            인증코드
                                        </EmailsButton>
                                    </InputTextSizeWTypeL>
                                </UiInputBtnCombo>
                            </FormBlockBody>
                        </FormBlock>


                        {/*생년월일*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 생년월일
                            </FormBlockHead>
                            <FormBlockBody>
                                <UiInputBtnCombo>
                                    <InputTextSizeWTypeL>
                                        <EmailInput type="hidden" required />
                                        <EmailInput
                                            type="date"
                                            data-auth=""
                                            name="memBirthdate"
                                            value={formData.memBirthdate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputTextSizeWTypeL>
                                </UiInputBtnCombo>
                            </FormBlockBody>
                        </FormBlock>



                        {/*성별*/}
                        <FormBlock>
                            <FormBlockHead>
                                <AsteriskRed>*</AsteriskRed> 성별
                            </FormBlockHead>

                            <FormBlockBody>
                                {/*  성별 옵션 변경  */}
                                <CustomSelect
                                    name="memGender"
                                    value={formData.memGender}
                                    // data-auth=""
                                    onChange={handleChange}
                                    required>

                                    <CustomOption value="남성" defaultValue={"남성"}>남성</CustomOption>
                                    <CustomOption value="여성">여성</CustomOption>

                                </CustomSelect>
                            </FormBlockBody>
                        </FormBlock>



                        {/*모두 동의 합니다*/}
                        <FormBlockCheckAllWrap>
                            <Terms>
                                <TermsHead>
                                    <InputCheckBox>
                                        <input
                                            type="checkbox"
                                            value="agree"
                                            onChange={(e) => {
                                                allAgreeHandler(e.currentTarget.checked);
                                            }}
                                            checked={isAllChecked}
                                        />
                                    </InputCheckBox>
                                    <TermsLabel onClick={fake}>모두 동의합니다.</TermsLabel>
                                </TermsHead>

                                <TermsBody>
                                    <TermsItem>
                                        <InputCheckBox>

                                            <input
                                                type="checkbox"
                                                value="provision"
                                                onChange={(e) => {
                                                    agreeHandler(e.currentTarget.checked, e.target.value);
                                                }}
                                                checked={
                                                    checkedItems.includes("provision") ? true : false
                                                }
                                            />
                                        </InputCheckBox>
                                        <Terms1Label>만 14세 이상입니다.</Terms1Label>
                                    </TermsItem>

                                    {/*  */}

                                    <TermsItem>
                                        <InputCheckBox>

                                            <input
                                                type="checkbox"
                                                value="privacy"
                                                onChange={(e) => {
                                                    agreeHandler(e.currentTarget.checked, e.target.value);
                                                }}
                                                checked={
                                                    checkedItems.includes("privacy") ? true : false
                                                }
                                            />
                                        </InputCheckBox>
                                        <Terms2A onClick={fake}>이용약관 필수 동의</Terms2A>
                                    </TermsItem>
                                    {/*  */}
                                </TermsBody>
                            </Terms>
                            <Terms1Error />
                            <TermsError />
                        </FormBlockCheckAllWrap>



                        {/*회원가입 버튼*/}
                        <FormBlockSubmit>
                            <FormBlockBody>
                                <BtnLogin
                                    type="submit"

                                >
                                    가입하기
                                </BtnLogin>
                            </FormBlockBody>
                        </FormBlockSubmit>


                        {/*회원가입 속 로그인하러 가기*/}
                        <AdditionTxt>
                            이미 가입하셨다면&nbsp;&nbsp;<Link to="/login">로그인</Link>
                        </AdditionTxt>

                    </LoginSection>
                </LoginWrap>
            </ReauthPhone>
        </WrapLogin>
    );
}

const AdditionTxt = styled.button`
    margin-top: 30px;
    color: #666;
    font-size: 14px;

    a {
        text-decoration: underline;
    }
`;

const AuthBtn = styled.button`
  display: inline-block;
  vertical-align: middle;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  font-size: 10px;
  text-align: center;
  white-space: nowrap;
  line-height: 1.4;
  background: rgba(11, 11, 13, 0.8);
  color: #a5a5a5;
  border: 1px solid #ddd !important;
  cursor: default !important;
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  position: absolute;
  top: 0;
  right: 0;
  position: absolute;
  width: 100px;
`;

const BtnLogin = styled.button`
  border-radius: 2px;
  text-align: center;
  white-space: nowrap;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  color: #fff;
  background: #1351f9;
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
`;

const FormBlockSubmit = styled.div`
  text-align: left;
  margin: 20px 0 0;
`;

const TermsError = styled.span`
  display: none;
  cursor: default !important;
  color: #ff27a3;
  margin: 10px 0 0;
`;

const Terms1Error = styled.span`
  color: #ff27a3;
  margin: 10px 0 0;
  display: block !important;
  cursor: default !important;
`;
const Terms2A = styled.a`
  text-decoration: underline;
  overflow: hidden;
  display: block;
  font-size: 14px;
    color: #a5a5a5;
    margin-top: 10px;
`;

const Terms1Label = styled.label`
  overflow: hidden;
  display: block;
  font-size: 14px;
    color: #a5a5a5;
`;

const Terms1 = styled.input`
  // -webkit-appearance: none;
  background: #ff27a3;
  display: inline-block;
  position: relative;
  height: 18px;
  width: 18px;
  vertical-align: middle;
  box-sizing: border-box;
  border: 0;
  margin: 0;
    outline: none;

  &:before {
    // content: ${(props) => (props.checked ? console.log("✓") : "")};
    cursor: pointer;
    // content: ${(props) => (props.checked ? console.log("✓") : "")};
    display: inline-block;
    line-height: 16px;
    width: 16px;
    height: 16px;
    background: #fff;
    position: absolute;
    top: 0px;
    left: 0px;
    border: 1px solid #acacac;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    text-align: center;
      outline: none;
   
  }
`;

const TermsItem = styled.div`
  margin-top: 5px;
`;

const TermsLabel = styled.label`
  overflow: hidden;
  display: block;
  font-size: 14px;
    color: #a5a5a5;
`;

const BpCheckAll = styled.input`
  -webkit-appearance: none;
  background: transparent;
  display: inline-block;
  position: relative;
  height: 18px;
  width: 18px;
  vertical-align: middle;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 0;
  margin: 0;
    outline: none;

  &:before {
    font-size: 16px;
    font-style: normal;
    content: "✓";
    border: 1px solid #fff;
    background: #f1c333 ;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    line-height: 16px;
    width: 16px;
    height: 16px;
    position: absolute;
    top: 0px;
    left: 0px;
    border-radius: 2px;
    text-align: center;
      outline: none;
  }
`;

const InputCheckBox = styled.div`
  float: left;
  margin-right: 10px;
  display: inline-block;
`;

const TermsBody = styled.div`
    padding-bottom: 20px;
    //border-bottom: 1px solid #333;
`;

const TermsHead = styled.div`
  //border-bottom: 1px solid #333;
  padding: 5px 0;
    
`;

const Terms = styled.div`
  text-align: left;
  margin: 20px 0 0;
`;

const FormBlockCheckAllWrap = styled.div`
  text-align: left;
  margin: 20px 0 0;
`;

const UiInputBtnCombo = styled.div`
  position: relative;
`;

// 기타 사이즈
const EmailsInput = styled.input`
    font-size: 14px;
    height: 48px;
    background: #fff;
    line-height: 16px;
    border: 1px solid #acacac;
    width: 75%;
    box-sizing: border-box;
    padding: 2px 8px;
    border-radius: 2px;
    appearance: none;
    outline: none;
    margin-right: 15px;
    `;

//인증버튼
// const Button= styled.button`
//     width: 100px;
//     margin-top: 22px;
//     height: 40px;
//     margin-right: 20px;
//     border-radius: 10px;
//     text-align: center;
//     `;


//기본 인 풋 박스
const EmailInput = styled.input`
  font-size: 14px;
  height: 48px;
  background: #fff;
  line-height: 16px;
  border: 1px solid #acacac;
  width: 100%;
  box-sizing: border-box;
  padding: 2px 8px;
  border-radius: 2px;
  appearance: none;
    outline: none;

`;

//전화번호 입력
const PhoneInput = styled.input`
  font-size: 14px;
  height: 48px;
  background: #fff;
  line-height: 16px;
  border: 1px solid #acacac;
  width: 100%;
  box-sizing: border-box;
  padding: 2px 8px;
  border-radius: 2px;
  appearance: none;
    outline: none;
`;


// 전체 인증 버튼 감싸는 박스
const InputTextSizeWTypeL = styled.div`
  box-sizing: border-box;
  vertical-align: middle;
  height: 48px;
  display: block;
  width: 100%;
  margin-top: 10px;
  text-align: left;
    
`;


const EmailsButton = styled.button`
    width: 100px;
    height: 50px;
    //margin-right: 20px;
    text-align: center;
    //background-color: #1351f9;
    // background-color: transparent !important;
    border: solid 1px #f4f4f4 !important;
    color: #f4f4f4 !important;
    /* border: 1px solid red; */

    &:hover{
        background-color: #1351f9;
        color: white;
    }
    
    &:active{
        border: solid 1px #ff27a3;
        color: #ff27a3;
    }
`;


const FormError = styled.span`
  color: #ff27a3;
  margin: 10px 0 0;
  display: block;
  cursor: default !important;
    font-size: 14px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 800;
`;

// 사용자 작성 구간
const InputTextSizeW = styled.div`
    
  &.formError {
    cursor: default !important;
  }
  display: block;
  width: 100%;
  margin-top: 10px;
  text-align: left;
  vertical-align: middle;
  box-sizing: border-box;
    outline: none;
    
`;

const FormBlockBody = styled.div`
  text-align: left;
`;

// 성별 박스
const CustomSelect = styled.select`
    display: block;
    width: 100%;
    margin-top: 10px;
    text-align: left;
    vertical-align: middle;
    box-sizing: border-box;
    outline: none;
    height: 48px;
`;


const CustomOption = styled.option`
    height: 48px;
    outline: none;
    cursor:pointer;
    
`;


const AsteriskRed = styled.em`
  color: #ff27a3;
  font-size: 18px;
  display: inline-block;
`;

// 모든 폼 폰트 사이즈
const FormBlockHead = styled.label`
  font-size: 14px;
    color: #a5a5a5;
    line-height: 14px;
    font-family: 'SUIT-Regular' !important;
    font-weight: 200;
`;


const FormBlock = styled.div`
  text-align: left;
  margin: 20px 0 0;
    outline: none;
`;
const Title = styled.h3``;
const IsActive = styled.li``;

const SignupStep = styled.div`
  text-align: center;
  margin: 45px 0 20px;

  ${Title} {
    font-size: 18px;
    font-weight: normal;
  }

  &.wrap {
    text-align: center;
    margin: 45px 0 20px;

    ${IsActive} {
      color: #fff;
      border-color: #1351f9;
      background: #1351f9;
    }

    ul {
      display: inline-block;
      position: relative;
      border-top: 1px solid #aaa;
    }

    li {
      position: relative;
      top: -15px;
      z-index: 10;
      background: #fff;
      color: #000;
      border: 1px solid #999;
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      -webkit-border-radius: 20px;
      border-radius: 20px;
    }

    li + li {
      margin-left: 50px;
    }
  }
`;

// 회원가입 타이틀 문구
const LoginTitle = styled.h2`
    color: #fff;
    font-size: 32px;
    line-height:  32px;
  text-align: center;
  position: relative;
  top: -10px;
  display: inline-block;
  padding: 0 10px;
    
`;

const LoginSubtitle = styled.div`
color: #a3a3a3;
font-size: 1rem;
font-weight: normal;
word-break: keep-all;
margin-top: 10px;

`

//회원가입 시작
const LoginSection = styled.section`
  text-align: center;
  //margin-top: 30px;
  padding-bottom: 20px;
    
    
    .step-bar{
        width: 100%;
        height: 5px;
        background: #2f2f2f;
        position: absolute;
        top: 0;
        left: 0;
    }
    .gradation-blue{
        width: 25%;
        height: 5px;
        display: block;
        text-indent: -9999px;
        background-color: #1351f9;
    }
`;


const SpIcon = styled.span`
  height: 0;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  font-size: 0;
  line-height: 0;
  letter-spacing: 0;
  background-position: -91px -488px;
  width: 100px;
  padding-top: 40px;
`;

const LogoA = styled.div`
  display: block;
`;

const LoginLogo = styled.div`
  padding-top: 40px;
  text-align: center;
  padding: 40px 0 0;
`;

// 로그인 전체 박스
const LoginWrap = styled.div`
  //min-height: 100%;
    background: rgba(11, 11, 13,0.8);
   
    
`;

const ReauthPhone = styled.form`
  //width: 384px;
  display: block;
    //max-width: 41.667rem;
    //margin: 4.167rem auto 0;
`;

const HeadBannerGroup = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`;

// 전체 박스
const WrapLogin = styled.div`
  //padding: 1px 0 50px;
    width: 560px;
    position: relative;
    margin: 80px auto;
  //min-height: 100%;
    padding: 40px 40px;
  background:  rgba(11, 11, 13, 0.8);
`;


const ErrorMessage = styled.div`
color: #a5a5a5;


`


export default SignUp;