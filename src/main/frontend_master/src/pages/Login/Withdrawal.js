import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {Button, FormSelect} from "react-bootstrap";
import SelectorEngine from "bootstrap/js/src/dom/selector-engine";
import { useNavigate } from 'react-router-dom';

import "./css/WithdrawModal.css";



// 회원탈퇴 ========================================
function Withdrawal({ onClose, onConfirmWithdraw }) {



    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

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

//onSubmit
    const handleWithdraw = async () => {
        try {
            await onConfirmWithdraw();
            alert('회원 탈퇴가 완료되었습니다.');
            navigate("/");
        } catch (error) {
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        }
    };



    //패스워드
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    let body = {
        username: username,
        password: password,
    };


    //findPasswordForm
    const [findPasswordForm, setFindPasswordForm] = useState({
        memId: '', memEmail: ''
    });
    const handleFindPasswordChange = (e) => {
        setFindPasswordForm({ ...findPasswordForm, [e.target.name]: e.target.value });
    };


    //약관동의
    const fake = () => {
        alert("정말로 탈퇴하겠습니까?");
    };
    useEffect(() => {
        if (checkedItems.length >= 2) {
            setIsAllChecked(true);
        } else {
            setIsAllChecked(false);
        }
    }, [checkedItems]);




    //네비
    const navigate = useNavigate();




    //HTML -----------------------------------------------
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
                                        <EmailsInput type="hidden" required/>
                                        <EmailsInput
                                            type="password"
                                            value={password}
                                            placeholder="비밀번호"
                                            required
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                            }}
                                        />
                                    </InputTextSizeWTypeL>


                                    {/* 회원 탈퇴 약관 동의*/}
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
                                                <TermsLabel onClick={fake}>회원 탈퇴 약관 동의</TermsLabel>
                                            </TermsHead>
                                        </Terms>
                                    </FormBlockCheckAllWrap>



                                    {/*회원탈퇴 버튼*/}
                                    <FormBlockSubmit>
                                        <FormBlockBody>
                                            <BtnLogin
                                                type="submit"
                                                onClick={handleWithdraw}
                                            >탈퇴하기
                                            </BtnLogin>
                                        </FormBlockBody>
                                    </FormBlockSubmit>


                                </UiInputBtnCombo>
                            </FormBlockBody>
                        </FormBlock>


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
    text-align: center;
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
  margin-right: 5px;
  display: inline-block;
    width: 18px;
    height: 18px;
    
`;

const TermsBody = styled.div`
    padding-bottom: 20px;
    //border-bottom: 1px solid #333;
`;

//회원탈퇴 약관 동의
const TermsHead = styled.div`
    display: flex;
    margin-top: 0px;
    //border-bottom: 1px solid #333;
    padding-top: 10px;
    padding-bottom: 10px;
    /* padding: 0px 0; */
    /* font-size: 18px; */
    justify-content: left;
    //text-indent: 10px;
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
const EmailsInput= styled.input`
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

export default Withdrawal;
