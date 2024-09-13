import React, { useEffect, useState } from 'react';
import {
    DogImg, BirdImg, FishImg, CatImg, TurtleImg,
    profile1, profile2, profile3, profile4, profile5
} from './ProfileImg';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfileModal({updateProfileImage}) {
    // 변수 설정
    const [selectedImage, setSelectedImage] = useState(null);
    const [memberInfo, setMemberInfo] = useState({
        memProfile: '',
    });


    const handleImageSelect = (img) => {
        setSelectedImage(img);
    };

    // 회원 정보 불러오기
    const fetchMemberInfo = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('/auth/memberinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response && response.data) {
                setMemberInfo(response.data);
            }
        } catch (error) {
            console.error("회원 정보 가져오기 중 오류 발생:", error);
        }
    };

    // 프로필 사진 submit 관리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 선택한 이미지가 이전 이미지와 동일한지 확인
        if (selectedImage === memberInfo.memProfile) {
            alert("다른 이미지를 선택해주세요.");
            return; // 동일할 경우 submit을 막음
        }

        try {
            const accessToken = localStorage.getItem('accessToken');

            if (selectedImage) {
                const response = await axios.put('/auth/update', {
                    memNewProfile: selectedImage,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 200) {
                    updateProfileImage(selectedImage);
                    setMemberInfo((prevInfo) => ({
                        ...prevInfo,
                        memProfile: selectedImage
                    }));

                    // 프로필 업데이트 후 선택 상태를 초기화
                    setSelectedImage(null);
                    alert("프로필 이미지가 성공적으로 업데이트되었습니다.");
                } else {
                    alert("업데이트 실패: " + response.statusText);
                }
            } else {
                alert("이미지를 선택해주세요.");
            }
        } catch (error) {
            console.error("프로필 이미지 업데이트 중 오류 발생:", error);
            alert("프로필 이미지 업데이트 중 오류가 발생했습니다.");
        }
    };



    return (
        <ProfileModalWrap>
            <form onSubmit={handleSubmit}>
                <ImageSelectWrap>
                    {[profile1, profile2, profile3, profile4, profile5, DogImg, BirdImg, FishImg, CatImg, TurtleImg].map((img, index) => (
                        <ProfileImg
                            key={index}
                            src={img}
                            onClick={() => handleImageSelect(img)}
                            isSelected={selectedImage === img || (!selectedImage && memberInfo.memProfile === img)} // 선택된 이미지에 스타일 적용
                        />
                    ))}
                </ImageSelectWrap>
                <SubmitButton type="submit">변경 하기</SubmitButton>
            </form>
        </ProfileModalWrap>
    );
}


// 전체 모달 창
const ProfileModalWrap = styled.div`
    width: 600px;
    height: 200px;
    position: absolute;
    top: 100px;
    left: 530px;
    // border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;

    form{
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

// 프로필 사진 선택 창
const ImageSelectWrap = styled.div`
    width: 400px;
    height: 150px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    // border: 1px solid blue;
    margin-right: 10px;
`;

// 이미지 css
const ProfileImg = styled.img`
    width: 70px;
    height: 70px;
    cursor: pointer;

    // 선택되면 border변경
    border: ${(props) => (props.isSelected ? '3px solid white' : 'none')};

    border-radius: 5px;
    &:hover {
        border: 3px solid #ccc;
    }
`;

// 프로필 변경 버튼
const SubmitButton = styled.button`
    width: 100px;
    height: 40px;
    background-color: #1351f9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 15px;

    // 커서 올릴 시
    &:hover {
        background-color: #007bff;
    }
`;
