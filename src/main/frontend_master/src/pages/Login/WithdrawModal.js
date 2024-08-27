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
                    <br />
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

const ModalPage = styled.div`
    position: absolute;
    background-color: #50505080;
    width: 100%;
    height: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    z-index: 10;

`
const ModalPageBox = styled.div`

    width: 50%;
    height: 50%;
    background-color: #dbdbdb;
    position: relative;
    display: flex;
    flex-direction: column;

`

const WithdrawAnnounce =  styled.div`
    margin-top: 20px;

`

const WithdrawYes = styled.button`


`

const WithdrawExit = styled.div`

    width: 30px;
    height: 37px;
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;

    &:hover{
        color: red;
    }


`