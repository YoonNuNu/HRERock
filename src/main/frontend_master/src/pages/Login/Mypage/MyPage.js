import React, {useState,  useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";
import top from "../images/top.png";
import edit from "../images/edit.svg";
import play from "../images/play.svg";
import MemberInfo from "../MemberInfo";
import WithdrawMember from "../WithdrawMember";
import WatchHistory from "../WatchHistory";
import MyReview from "../MyReview";
import BookMark from "../BookMark";
import { api } from '../../../api/axios';




//MyPage header
const MyPage = () => {
    const navigate = useNavigate();
    //탭 폼
    const [currentTab, setTab] = useState(0);
    const [memberName, setMemberName] = useState('');
    // const api = axios.create({
    //     baseURL: "http://localhost:8080"
    // })

    const menuArr = [
        {name: '최근 시청 내역', content: <WatchHistory />},
        {name: '내가 찜한 리스트', content: <BookMark />},
        {name: '나의 작성 리뷰', content: <MyReview />},
        {name: '회원정보 수정', content: <MemberInfo />},
        {name: '회원탈퇴', content: <WithdrawMember />},
    ];

    const fetchMemberName = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('로그인이 필요합니다.');
                navigate('/login')
                return;
            }

            const response = await api.get('/auth/memberinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (response.status === 200) {
                const data = response.data;
                setMemberName(data.memName);
            } else {
                throw new Error('Failed to fetch user name');
            }
        } catch (error) {
            console.error("Mypage header user name error:", error);
            alert("회원 이름을 불러오는데 문제가 발생했습니다.");
        }
    };

    const selectMenuHandler = (index) => {
        setTab(index);
    };


    useEffect(() => {
        fetchMemberName();
    }, []);

    //HTML -----------------------------------
    return (
        <>
            <Wrap>
                {/*상단- 프로필*/}
                <TopContainer>
                    <Section>
                        <ProfileBoxContainer>
                            <TopImg src={top}></TopImg>

                            <TitelBox>
                                {/*홍길동*/}
                                {memberName} 님

                            </TitelBox>

                            <FormBlockBody>
                                <InputTextSizeW>
                                    <EmailsButton
                                        type="button"
                                        onClick={() => {

                                        }}
                                    >
                                        프로필 전환
                                    </EmailsButton>
                                </InputTextSizeW>
                            </FormBlockBody>
                        </ProfileBoxContainer>

                        <Titel>나의 이용권 &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;스탠다드 정기권
                            <img
                                className="play-img"
                                src={play}/>
                        </Titel>
                    </Section>
                </TopContainer>


                {/*바디- 탭구현*/}
                <WrapBody>
                    <TabMenu>
                        {menuArr.map((tap, index) => {
                            return (<div
                                key={index}
                                className={currentTab === index ? 'submenu focused' : 'submenu'}
                                onClick={() => selectMenuHandler(index)}
                            >
                                {tap.name}
                            </div>);
                        })}
                        <div>
                            <div>{menuArr[currentTab].content}</div>
                        </div>
                    </TabMenu>
                </WrapBody>
            </Wrap>
        </>);
}
export default MyPage;



// STYLE ------------
//전체 박스
const Wrap = styled.div`
    width: 100%;
    //height: 100vh;
    margin: 0 auto;
`;


//탭 전체 박스
const WrapBody = styled.div`
    //width: 1024px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    
   
`;

//탭메뉴
const TabMenu = styled.ul`
   
//background-color: red;
float: left;
list-style: none;
margin-bottom: 20px;
margin-top: 10px;
align-items: center;
color: #000;
font-weight: 300;
text-align: center;
font-size: 16px;

    .focused{
        color: #fff !important;
        border-bottom: 5px solid #1351f9 !important;
    }

.submenu {
    margin: 0 auto;
    padding: 10px;
    transition: 0.5s;
    //border: 1px solid rgba(255, 255, 255, 0.2);
    //border-bottom: 1px solid rgb(46, 46, 46);
    
    border-bottom: 5px solid #2f2f2f;
    
    outline: none;
    cursor: pointer;
    color: #a6a6a6;
    font-weight: 300;
    text-align: center;
    float: left;
    //padding: 40px;
    padding: 2.5rem 2.5rem;
    height: 20px;


    &:hover{
        color: #fff !important;
        border-bottom: 5px solid #1351f9 !important;
    }
    
    &:focus{
        outline: none;
        cursor: pointer;
        color: #fff !important;
        border-bottom: 5px solid #1351f9 !important;
        font-weight: 300;
        text-align: center;
        transition: 0.5s;
    }
}
`;









//전체 감싸는 프로필 박스
const TopContainer = styled.div`
    width: 100%;
    //height: 280px;
    //position: relative;
    grid-template-columns: 10rem minmax(auto, 100%) min-content;
    column-gap: 2rem;
    padding: 40px 40px;
    background-color: rgb(25, 25, 25);
`;


// 프로필 감싸는 박스
const Section = styled.div`
    width: 1024px;
    //margin: 0 auto;
    //display: flex;
    //justify-content: flex-start;
    //margin-top: 22px;
`;

// 프로필 박스
const ProfileBoxContainer = styled.div`
    //width: 600px;
    display: flex;
    align-items: flex-start;
    //gap: 30px;
    border-right: 1px solid #1b1b1b;
    align-items: center;
`;


//나의 이용권-글씨
const Titel = styled.div`

    width: 400px;
    margin-top: 10px;

    position: absolute;
    left: 11em;
    top: 11.5em;
    font-size: 20px;
    color: #a3a3a3;
    font-family: 'SUIT-Regular' !important;
    text-align: left;
    font-weight: 500;

    .play-img {
        float: left;
        margin-left: 10px;
        margin-right: 10px;

        //padding: 2px 2px;
        margin-bottom: 5px;
        text-align: center;
        line-height: 30px;
    }
`;


// 프로필
const TopImg = styled.img`
    width: 160px;
    margin-right: 30px;
`;

//홍길동 박스
const TitelBox = styled.div`
    width: 120px;
    color: #fff;
    font-family: 'SUIT-Regular' !important;
    font-size: 2rem;
    margin-bottom: 40px;
    text-align: left;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    z-index: 1;
    //margin-top: 65px;
    align-items: center;
    position: relative;
    margin-right: 20px;
    
    .profile-img {
        margin -left: 10px;
        1;
        40px;
        absolute;
        0;
        2px
        2px;
        margin -bottom: 5px;
    }

`;


//프로필 전환 버튼
const EmailsButton = styled.button`
    width: 100px;
    height: 45px;

    padding: 0.5rem 0.833rem;
    font-size: 12px;
    text-align: center;
    background-color: transparent !important;
    border: 1px solid rgb(77, 77, 77);
    opacity: 0.7;
    color: #f4f4f4;
    margin-top: 1.8rem;
    border-radius: 2px;
    //margin-left: 20px;
    float: left;


    &:hover {
        solid 1px # 1351 f9;
        color: # 1351 f9;
    }

    &:active {
        solid
        1px #ff27a3;

        #ff27a3
    ;
    }
`;

// 전체 폼 박스
const FormBlockBody = styled.div`
    text-align: left;
    outline: none;
    align-items: center;
    margin-bottom: 5em;

`;

// 사용자 작성 구간
const InputTextSizeW = styled.div`
    text-align: left;
    vertical-align: middle;
    box-sizing: border-box;
    outline: none;
`;
