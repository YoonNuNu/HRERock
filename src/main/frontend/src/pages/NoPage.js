import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function NoPage() {

    const navigate = useNavigate();

    const returnMain = () => {
        alert("존재하지 않는 페이지입니다. 다시 확인하여 접속해주세요");
        navigate("/");
    }

    useEffect(() => {
        returnMain();

    }, [])
}