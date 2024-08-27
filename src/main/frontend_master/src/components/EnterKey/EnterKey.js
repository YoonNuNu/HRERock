import React, { useState } from 'react';

// 엔터키 기능
export default function(){
    const [inputText, setInputText] = useState("");
    const activeButton = () => {
        alert(`${inputText} 입력 완료`);
    }

}