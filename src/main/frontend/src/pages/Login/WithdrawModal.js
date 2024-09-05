import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';

export default function WithdrawModal({ onClose, onConfirmWithdraw }) {

    const navigate = useNavigate();

    return (
        <>

            <ModalPage>
                <ModalPageBox>
                    <WithdrawAnnounce>
                        정말로 탈퇴하시겠습니까?
                    </WithdrawAnnounce>

                    <div>
                        <WithdrawYes  onClick={async () => {
                            await onConfirmWithdraw();
                            onClose();
                            navigate("/");
                        }}>
                            탈퇴하겠습니다
                        </WithdrawYes>
                    </div>
                    <WithdrawExit
                        onClick={onClose}
                    >
                        X
                    </WithdrawExit>

                </ModalPageBox>
            </ModalPage>
        </>
    );
}

// 모달창 배경
const ModalPage = styled.div`
    position: absolute;
    background-color: #40404080;
    width: 100vw;
    min-width: 1024px;
    height: 200%;
    text-align: center;
    display: flex;
    align-items: center;
    z-index: 99999;
    top: 0%;
    left: 0%;



    // border: 1px solid red;
`

// 모달창 내 창
const ModalPageBox = styled.div`

    width: 50%;
    height: 500px;
    background-color: #fff;
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    top: -17%;
    left: 25%;

    // border: 2px dashed red;

`

// 모달창 안내 문구
const WithdrawAnnounce =  styled.div`
    margin-top: 100px;
    font-size: 2rem;

`

// 모달창 확인 버튼
const WithdrawYes = styled.button`

    width: 200px;
    height: 50px;
    border: 2px solid #0d6efd;
    border-radius: 12px;
    background: #ffffff;

    margin-top: 150px;

    &:hover{
        background: red;
        color: white;
        border: 2px solid red;
    }
`

// 모달창 닫기 버튼
const WithdrawExit = styled.div`

    width: 40px;
    height: 40px;
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    border-radius: 50%;
    border: 2px solid #999999;

    &:hover{
        color: red;
        cursor: pointer;
        border: 2px solid red;
    }


`