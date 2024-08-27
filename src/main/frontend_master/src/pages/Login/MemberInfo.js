import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { Button, FormSelect } from "react-bootstrap";
// import SelectorEngine from "bootstrap/js/src/dom/selector-engine";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios"
// import SideBar from "./SideBar";



// 회원정보설정
function MemberInfo() {

    const navigate = useNavigate();
    const [telNumber, setTelNumber] = useState();

    const [memberInfo, setMemberInfo] = useState({
        memName: '',
        memId: '',
        memEmail: '',
        memTel: '',
        memBirth: '',
        memGender: '',

    });

    const [newInfo, setNewInfo] = useState({
        memNewEmail: '',
        memNewTel: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [editField, setEditField] = useState(null);


    const fetchMemberInfo = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                navigate('/login');
                return;
            }

            const response = await axios.get('/auth/memberinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                console.log('Member info received:', response.data);
                setMemberInfo(response.data);
                setNewInfo({
                    memNewEmail: response.data.memEmail,
                    memNewTel: response.data.memTel,
                });
            }
            else {
                throw new Error('Failed to fetch user info');
            }
        }
        catch (error) {
            console.error('Error fetching user info:', error);
            alert('사용자 정보를 불러오는데 실패했습니다.')
            navigate('/login');

        }
        finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        fetchMemberInfo();
    }, []);


    const formatTelNumber = (value) => {
        const cleanText = ('' + value).replace(/\D/g, '');
        if (cleanText.length = 11) {
            return `${cleanText.slice(0, 3)}-${cleanText.slice(3, 7)}-${cleanText.slice(7, 11)}`;
        } 
        else {
            alert('연락처는 3자리-4자리-4자리 형식이어야 합니다');
            // return;
        }
    };

    const handleEdit = (field) => {
        setEditField(field);
    }

    const handleSubmit = async (field) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.put('/auth/update', {
                [field]: newInfo[field]
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                alert(`${field === 'memNewEmail' ? '이메일' : '연락처'}가 성공적으로 수정되었습니다.`);
                setEditField(null);
                fetchMemberInfo();  // 수정된 정보를 다시 불러오기
            }
            else {
                const errorData = await response.json();
                throw new Error(errorData.message || '정보 수정이 실패했습니다.');
            }
        }
        catch (error) {
            console.error('Error updating user info:', error);
            alert(error.message);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        // 전화번호 필드일 때만 포맷 적용
        // const formattedValue = name === 'memNewTel' ? formatTelNumber(value) : value;
        // setTelNumber(formattedValue)
        setNewInfo(prevState => ({
            ...prevState,
            [name]: value,
        }))
    };

    if (isLoading) {
        return (
            <div>
                Loading ...
            </div>
        );
    }



    return (
        <>
            <WrapLogin>
                <HeadBannerGroup />
                <ReauthPhone>
                    <LoginWrap>
                        <LoginLogo>
                            <h1>
                                {/* <LogoA href="/">
                <SpIcon />
              </LogoA> */}
                            </h1>
                        </LoginLogo>

                        <LoginSection>
                            {/*<div className="step-bar">*/}
                            {/*    <span className="gradation-blue"></span>*/}
                            {/*</div>*/}
                            <LoginTitle>회원정보 수정
                                <h5>고객님의 회원정보는 사이트에서 통합 관리하고 있습니다.</h5>
                            </LoginTitle>


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
                                            value={memberInfo.memName}
                                            type="text"
                                            disabled="disabled"
                                            required
                                        />
                                    </InputTextSizeWTypeL>
                                </FormBlockBody>
                            </FormBlock>


                            {/*아이디*/}
                            <FormBlock>
                                <FormBlockHead>
                                    <AsteriskRed>*</AsteriskRed> 아이디
                                </FormBlockHead>
                                <FormBlockBody>
                                    <InputTextSizeW>
                                        <EmailInput
                                            id="memId"
                                            name="memId"
                                            type="text"
                                            value={memberInfo.memId}
                                            disabled="disabled"
                                            required
                                        />
                                    </InputTextSizeW>
                                    {/* <FormError>{checkedEmail}</FormError> */}
                                </FormBlockBody>
                            </FormBlock>


                            {/*비밀번호*/}
                            <FormBlock>
                                <FormBlockHead>
                                    <AsteriskRed>*</AsteriskRed> 비밀번호 변경
                                </FormBlockHead>
                                <FormBlockBody>
                                    <UiInputBtnCombo>
                                        <InputTextSizeWTypeL>
                                            <EmailsInput type="hidden" required />
                                            <EmailsInput
                                                type="password"
                                                // value={password}
                                                placeholder="비밀번호 변경은 '비밀번호 변경' 버튼을 통해서 변경해주세요"
                                                required
                                                readOnly
                                            />

                                            <EmailsButton
                                                type="button"
                                                onClick={() => navigate('/user/changePassword')}
                                            >
                                                비밀번호 변경
                                            </EmailsButton>

                                        </InputTextSizeWTypeL>
                                    </UiInputBtnCombo>
                                </FormBlockBody>
                            </FormBlock>





                            {/*전화번호*/}
                            <FormBlock>
                                <FormBlockHead>
                                    <AsteriskRed>*</AsteriskRed> 전화번호 변경
                                </FormBlockHead>
                                <FormBlockBody>
                                    <UiInputBtnCombo>
                                        <InputTextSizeWTypeL>
                                            <PhoneInput type="hidden" required />
                                            <PhoneInput
                                                type="tel"
                                                placeholder="010-1234-5678"
                                                name="memNewTel"
                                                value={editField === 'memNewTel' ? newInfo.memNewTel : memberInfo.memTel}
                                                onChange={handleChange}
                                                readOnly={editField !== 'memNewTel'}
                                                required
                                            />
                                            {editField === 'memNewTel' ? (
                                                <EmailsButton
                                                    type="button"
                                                    onClick={() => handleSubmit('memNewTel')}
                                                >
                                                    전화번호 저장
                                                </EmailsButton>
                                            ) : (
                                                <EmailsButton
                                                    onClick={() => handleEdit('memNewTel')}
                                                >
                                                    전화번호 수정
                                                </EmailsButton>
                                            )}

                                        </InputTextSizeWTypeL>
                                    </UiInputBtnCombo>
                                </FormBlockBody>
                            </FormBlock>



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
                                                placeholder="수정된 이메일을 입력해주세요."
                                                data-auth=""
                                                name="memNewEmail"
                                                value={editField === 'memNewEmail' ? newInfo.memNewEmail : memberInfo.memEmail}
                                                required
                                                readOnly={editField !== 'memNewEmail'}
                                                onChange={handleChange}
                                            />
                                            {editField === "memNewEmail" ? (
                                                <EmailsButton type="button" onClick={() => { handleSubmit('memNewEmail') }}>
                                                    이메일 저장
                                                </EmailsButton>
                                            ) : (
                                                <EmailsButton type="button" onClick={() => { handleEdit('memNewEmail') }}>
                                                    이메일 수정
                                                </EmailsButton>
                                            )}
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
                                            <EmailInput type="hidden" disabled />
                                            <EmailInput
                                                readOnly
                                                type="text"
                                                name="memBirth"
                                                value={memberInfo.memBirth}
                                                disabled
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
                                    <CustomSelect name="memGender"
                                        value={memberInfo.memGender}
                                        disabled="disabled"
                                        required>
                                    </CustomSelect>
                                </FormBlockBody>
                            </FormBlock>



                            {/*회원가입 버튼*/}
                            {/* <FormBlockSubmit>
                            <FormBlockBody>
                                <BtnLogin
                                    type="submit"
                                    onClick={() => {
                                        onSubmit();
                                    }}
                                >
                                    개인정보 수정
                                </BtnLogin>
                            </FormBlockBody>
                        </FormBlockSubmit> */}


                        </LoginSection>
                    </LoginWrap>
                </ReauthPhone>
            </WrapLogin>

        </>
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
  //margin: 20px 0 0;
    margin-top: 40px;
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
    background: #f1c333	;
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

    &:disabled {
        background-color: #a6a6a6;
        cursor: none;
    }
`;

//전화번호 입력
const PhoneInput = styled.input`
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
    font-size: 14px;
    //margin-right: 20px;
    text-align: center;
    //background-color: #1351f9;
    background-color: transparent !important;
    border: solid 1px #f4f4f4 !important;
    color: #f4f4f4 !important;
    /* border: 1px solid red; */

    &:hover{
        border: solid 1px #1351f9;
        color: #1351f9;
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
    width: 560px;
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
    
    &:disabled {
        background-color: #a6a6a6;
        cursor: none;
    }
`;


const CustomOption = styled.option`
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
    margin-top: 20px;
    
    h5{
        color: #a3a3a3;
        font-size: 1rem;
        font-weight: normal;
        word-break: keep-all;
        margin-top: 10px;
    }
`;


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
    margin: 0 auto;
   display: flex;
    justify-content: center;
    
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
    width: 852px;
    //position: relative;
    margin: 80px auto;
  //min-height: 100%;
    padding: 40px 40px;
  background:  rgba(11, 11, 13, 0.8);
margin-top: 120px;
`;

export default MemberInfo;
