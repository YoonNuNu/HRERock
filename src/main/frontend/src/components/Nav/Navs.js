import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';


import logo from "./images/rock_w_logo.svg";
import searchIcon from './images/icon_search.png';
import loginIcon from './images/icon_login2.png';
import mypageIcon from './images/icon_mypage.png';
import useFetch from '../../Hooks/useFetch';
import search from './images/search.svg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile_1 from './images/Profile_1.svg';


function Navs() {

    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [loginOn, setLoginOn] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);

    const [ loading, error] = useFetch('');

    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const goToPage = path => {
        navigate(path);
    };


    // 로그아웃 버튼 시 로그 아웃
    const handleLogout = async () => {

        try {
            if (accessToken) {
                localStorage.removeItem('accessToken');
                setAccessToken(null);
                navigate('/login');
            }
        }
        catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
            alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }

    // 검색 창 변경 확인
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색 기능
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // 입력된 검색어를 쉼표로 구분하여 배열로 변환
        const terms = searchTerm.split(',').map(term => term.trim()).filter(term => term !== '');

        // URLSearchParams 객체 생성
        const params = new URLSearchParams();

        // 각 검색어를 파라미터에 추가 (최대 4개까지)
        if (terms.length > 0) params.append('movieTitle', terms[0]);
        if (terms.length > 1) params.append('movieDirectors', terms[1]);
        if (terms.length > 2) params.append('movieActors', terms[2]);
        if (terms.length > 3) params.append('genres', terms[3]);

        // 쿼리 파라미터를 포함한 URL 생성
        const url = `/user/MovieSearch?${params.toString()}`;
        console.log('검색 URL:', url); // 디버깅 용
        // url로 이동
        navigate(url);
    };


    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        window.addEventListener('scroll', updateScroll);
    }, []);

    // const handleSearchInput = e => setSearchInput(e.target.value);

    useEffect(() => {
        window.addEventListener('click', function (e) {
            if (e.target.contains !== searchWrapper) {
                setSearchInput('');
            }
        });
    }, []);

    const searchWrapper = useRef();

    // if (loading) return null;
    // if (error) return window.alert('통신에 실패하였습니다');


    //HTML
    return (
        <>
            <NavWrapper scrollposition={scrollPosition}>
                <MenuWrapper>
                    <LogoImg
                        alt="logo"
                        src={logo}
                        scrollposition={scrollPosition}
                        onClick={() => {
                            navigate(`/`);
                        }}
                    />

                    <MenuName
                        onClick={() => {
                            goToPage(`/`);
                        }}
                        scrollposition={scrollPosition}
                    >
                        홈
                    </MenuName>

                    <MenuName
                        onClick={() => {
                            goToPage('/user/Recommend');
                        }}
                        scrollposition={scrollPosition}
                    >
                        NEW!추천콘텐츠
                    </MenuName>

                    <MenuName
                        onClick={() => {
                            goToPage('/user/notice');
                        }}
                        scrollposition={scrollPosition}
                    >
                        공지사항
                    </MenuName>

                    <MenuName
                        onClick={() => {
                            goToPage('/user/mypage');
                        }}
                        scrollposition={scrollPosition}
                    >
                        마이페이지
                    </MenuName>

                    <MenuName
                        onClick={() => {
                            goToPage('/admin/movieList');
                        }}
                        scrollposition={scrollPosition}
                    >
                        관리자
                    </MenuName>
                </MenuWrapper>

                {/*  검색창 */}
                <SearchWrapper ref={searchWrapper}>
                    {/* {searchInput && (
               <RecommendSearch>
                  {filteredRecommendData.map(item => {
                     return (
                        <SearchedLink
                           onClick={() => {
                              navigate(`/movieDetail/${item.id}`);
                           }}
                           key={item.id}
                        >
                           {item.name}
                        </SearchedLink>
                     );
                  })}
               </RecommendSearch>
            )} */}
                    <form onSubmit={handleSearchSubmit}>
                        <SearchInput
                            placeholder="영화 이름 입력"
                            type="text"
                            name="searchTerm"
                            value={searchTerm}
                            onChange={handleSearchChange}

                            scrollposition={scrollPosition}
                        />
                        <SearchSubmitBtn>
                            <SearchIcon alt="serachIcon" src={search} />
                        </SearchSubmitBtn>
                    </form>
                </SearchWrapper>



                <IconWrapper>
                    <IconImg
                        onClick={() => handleLogout()}
                        alt="loginIcon"
                        src={loginIcon}
                        scrollposition={scrollPosition}
                    />

                    {/* <IconImg
            onClick={() => goToPage('/SignUp')}
            alt="mypageIcon"
            src={mypageIcon}
            scrollposition={scrollPosition}
         /> */}
                    {/*프로필 이미지 ==================================*/}
                    <IconImg
                        onClick={() => goToPage('/user/mypage')}
                        alt="Profile"
                        src={Profile_1}
                        scrollposition={scrollPosition}
                    />

                    {/*<IconImg*/}
                    {/*    onClick={() => goToPage('/mypage')}*/}
                    {/*    alt="Profile"*/}
                    {/*    src={Profile_2}*/}
                    {/*    scrollposition={scrollPosition}*/}
                    {/*/>*/}
                    {/*<IconImg*/}
                    {/*    onClick={() => goToPage('/mypage')}*/}
                    {/*    alt="Profile"*/}
                    {/*    src={Profile_3}*/}
                    {/*    scrollposition={scrollPosition}*/}
                    {/*/>*/}
                    {/*<IconImg*/}
                    {/*    onClick={() => goToPage('/mypage')}*/}
                    {/*    alt="Profile"*/}
                    {/*    src={Profile_4}*/}
                    {/*    scrollposition={scrollPosition}*/}
                    {/*/>*/}
                </IconWrapper>
            </NavWrapper>
        </>
    );

}




const NavWrapper = styled.div`
    display: flex;
    position: sticky;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    top: 0;
    width: 100vw;
    height: 80px;
    //
    background: rgba(225, 225, 255, 0.1);
    backdrop-filter: saturate(180%) blur(20px);
    //background-color: rgba(11, 11, 13,0.5);


    //스크롤 시 
    background: ${props => (props.scrollposition > 100 ? '#fff' : 'rgba(225, 225, 255, 0.1)')};
    transition: 0.2s ease-out;
    z-index: 100;
`;

const MenuWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 30px;
    gap: 30px;
`;

const LogoImg = styled.img`
    //width: 200px;
    width: 130px;
    cursor: pointer;

    filter: ${props =>
            props.scrollposition > 100 ? 'invert(100%)' : 'invert(0%)'};
`;


// 폰트 스타일
const MenuName = styled.span`

    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
    font-family: "Montserrat", sans-serif;

    display: block;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    margin-top: 5px;

    //스크롤시   
    color: ${props => (props.scrollposition > 100 ? 'black' : 'white')};


    &:hover {
        color: ${props => (props.scrollposition > 100 ? 'black' : '#02d6e8;')};
        transition: 0.3s;
        font-weight: 600;
    }
`;

const downFadeAnimation = keyframes`
    from {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: 0 0;
    }
    to {
        opacity: 1;
        transform: scaleY(1);
        transform-origin: 0 0;
    }`;

// 검색창 스타일
const SearchWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-inline-start: auto;
    margin-right: 30px;
`;


// 검색창 아래 하단
const RecommendSearch = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;

    padding: 20px;
    top: 40px;
    width: 600px;
    height: auto;

    background: rgba(11, 11, 13, 0.1);
    //border-bottom-radius: 20px;
    //  background: rgba(225, 225, 255, 0.2);
    //  backdrop-filter: blur(20px);
    filter: drop-shadow(10px 10px 4px rgba(11, 11, 13, 0.1));
    animation: ${downFadeAnimation} 0.4s ease-out;

    background: ${props =>
            props.scrollPosition > 100 ? 'rgba(11, 11, 13, 0.1)' : '#fff'};
`;


const SearchedLink = styled(Link)`
    margin-top: 20px;
    font-size: 15px;
    text-decoration: none;
    color: gray;
`;

const SearchInput = styled.input`
    width: ${props => (props.scrollposition > 100 ? '600px' : '300px')};
    height: 40px;
    border: 0px;
    border-radius: 30px;
    margin-right: 20px;
    padding-left: 20px;
    background: #e4e4e4;
    outline: none;
    transition: 0.3s ease-out;
    transition-delay: 0.1s;


    //  검색창 클릭했을 떄
    &:focus {
        width: 600px;
        font-size: 14px;
        font-weight: 500;
        color: ${props => (props.scrollposition > 100 ? '#000' : 'white')};

        background: ${props =>
                props.scrollPosition > 100 ? '#fff' : 'rgba(249, 249, 249, 0.1)'};
        transition: 0.3s ease-out;
    }
`;

//검색 버튼
const SearchSubmitBtn = styled.button`
    // border: 1px solid red;
    width: 10px;
    height: 30px;
`

const SearchIcon = styled.img`
    position: absolute;
    right: 40px;
    width: 20px;
    cursor: pointer;
`;

const IconImg = styled.img`
    width: 25px;
    cursor: pointer;
    filter: ${props =>
            props.scrollposition > 100 ? 'invert(0%)' : 'invert(100%)'};
`;

const IconWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 100px;
    gap: 30px;
`;
export default Navs;