import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import {Button, FormSelect} from "react-bootstrap";
// import SelectorEngine from "bootstrap/js/src/dom/selector-engine";
import { useNavigate } from 'react-router-dom';
// import "./css/WithdrawModal.css";
import WithdrawModal from "./WithdrawModal";



// 회원탈퇴 ========================================
function WithdrawMember() {

    const [modal, setModal] = useState(false);
    const [memPassword, setMempassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const handlePasswordChange = (e) => {
        setMempassword(e.target.value);

    };

    // const [isAllChecked, setIsAllChecked] = useState(false);
    // const [checkedItems, setCheckedItems] = useState([]);

    // const allAgreeHandler = (checked) => {
    //     setIsAllChecked(!isAllChecked);
    //     if (checked) {
    //         setCheckedItems([...checkedItems, "provision", "privacy"]);
    //     } else if (
    //         (!checked && checkedItems.includes("provision")) ||
    //         (!checked && checkedItems.includes("privacy"))
    //     ) {
    //         setCheckedItems([]);
    //     }
    // };

    //비밀번호 확인
    const verifyPassword = async () => {
        try {
            const response = await axios.post('/auth/verify-password',
                { memPassword },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }

                });
            return response.data;
        }
        catch (error) {
            alert("비밀번호 확인 중 에러가 발생했습니다.");
            console.error("비밀번호 확인 오류:", error);
            return false;

        }
    }


    //onSubmit - 탈퇴 버튼 클릭 시
    const handleWithdraw = async (e) => {
        e.preventDefault()
        const isPasswordCorrcet = await verifyPassword();

        if (!isPasswordCorrcet) {
            setError("비밀번호가 올바르지 않습니다.");
            return;
        }

        setModal(true);
    };

    const confirmWithdraw = async () => {
        try {
            const response = await axios.delete('/auth/delete',
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

            localStorage.removeItem('accessToken');
            navigate("/");
            return response.data;
        }
        catch (error) {
            console.error('회원 탈퇴 오류:', error);
            throw error;

        }
    };


    //HTML -----------------------------------------------
    return (
        <>
            {modal && <WithdrawModal onClose={() => setModal(false)} onConfirmWithdraw={confirmWithdraw} />}
            <WrapLogin>
                <HeadBannerGroup />
                <ReauthPhone>
                    <LoginWrap>

                        <LoginSection>
                            <LoginTitle>회원탈퇴
                                <h5>현재 비밀번호가 일치하는 경우 탈퇴할 수 있습니다.</h5>
                            </LoginTitle>


                            {/*비밀번호*/}
                            <FormBlock>
                                <FormBlockHead>
                                    <AsteriskRed>*</AsteriskRed> 비밀번호
                                </FormBlockHead>
                                <FormBlockBody>
                                    <UiInputBtnCombo>
                                        <InputTextSizeWTypeL>

                                            <EmailsInput
                                                type="password"
                                                value={memPassword}
                                                placeholder="비밀번호"
                                                required
                                                onChange={handlePasswordChange}
                                            />
                                        </InputTextSizeWTypeL>

                                        <FormBlockSubmit>
                                            <FormBlockBody>
                                                <BtnLogin
                                                    type="button"
                                                    onClick={handleWithdraw}
                                                >탈퇴하기
                                                </BtnLogin>
                                            </FormBlockBody>
                                        </FormBlockSubmit>


                                    </UiInputBtnCombo>
                                </FormBlockBody>
                            </FormBlock>
                            <br />
                            <BtnLogin onClick={() => navigate("/")}>
                                돌아가기
                            </BtnLogin>

                        </LoginSection>
                    </LoginWrap>
                </ReauthPhone>
            </WrapLogin>

        </>
    );
}


//탈퇴하기 버튼
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
    margin-top: 20px;
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
    width: 100%;
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


const FormBlockBody = styled.div`
  text-align: left;
    width: 560px;
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
const LoginTitle = styled.div`
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

export default WithdrawMember;
