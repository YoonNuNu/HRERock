import React from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
// import * as S from './style';
import Router from "../../Router";
import styled from "styled-components";
import profile from "./images/profile.svg";

import home from "./images/home.svg";
import pencil from "./images/pencil.svg";
import people from "./images/people.svg";
import movie from "./images/movie.svg";
import gear from "./images/gear.svg";




// SideBar
const SideBar = () => {

    const pathName = useLocation().pathname;

    const activeStyle = {
        color: '#1351f9', fontWeight: 700,
    };

    return (
            <MenuWrap>
                <Side>
                    <div className="side">
                        <p className="side_span">Admin Dashboard</p>
                        관리자 페이지
                    </div>
                </Side>

                <SideWrap>
                    {/*<Profile src={profile}></Profile>*/}

                    <Menu>
                        <Img src={home}></Img>
                        <NavLink className="a" style={({isActive}) => (isActive ? activeStyle : {})} to='/login'>
                            Home
                        </NavLink>
                    </Menu>

                    <Menu>
                        <Img src={pencil}></Img>
                        <NavLink className="a" style={({isActive}) => (isActive ? activeStyle : {})} to='/admin/AdminNoticeList'>
                            Notice
                        </NavLink>
                    </Menu>

                    <Menu>
                        <Img src={people}></Img>
                        <NavLink className="a" style={({isActive}) => (isActive ? activeStyle : {})} to='/admin/memberList'>
                            MmberList
                        </NavLink>
                    </Menu>

                    <Menu>
                        <Img src={movie}></Img>
                        <NavLink className="a" style={({isActive}) => (isActive ? activeStyle : {})} to='/admin/movieList'>
                            Movie Manage
                        </NavLink>
                    </Menu>

                    <Menu>
                        <Img src={gear}></Img>
                        <Link className="a" to='/login'>Logout</Link>
                    </Menu>
                </SideWrap>
            </MenuWrap>
    );
};
export default SideBar;



const Img = styled.img`
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
    margin-right: 8px;
`;


//전체 박스
const MenuWrap = styled.div`
    float: left;
    width: 240px;
    height: 100vh;
    //position: fixed;
    //margin-top: 180px;
    z-index: 999999999;
`;


// 마이페이지- 헤더
const Side = styled.div`
    width: 240px;
    height: 90px;
    //border-top-left-radius: 20px;
    //border-top-right-radius: 20px;
    position: absolute;
    //margin-top: 40px;
    //margin-left: 40px;
    background-color: #1351f9;
    padding: 20px 0px;
    z-index: 999999;

    .side_span {
        color: #fff;
        font-family: 'SUIT-Regular' !important;
        text-align: left;
        font-weight: 300;
        font-size: 12px;
    }

    .side {
        margin: 0;
        font-family: 'SUIT-Regular' !important;
        font-size: 26px;
        font-weight: 300;
        //border-bottom: 3px solid #333;
        padding: 0 25px;
        font-weight: 300;
        color: #fff;
        text-align: left;
    }
`;


// 마이페이지- 바디
const SideWrap = styled.div`
    width: 240px;
    height: 100vh;
    padding-top: 120px;
    padding-bottom: 40px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: rgb(11, 11, 13);
    //background-color: #353535;
    margin-top: 20px;

    display: flex;
    flex-direction: column;
    //align-items: center;
    padding-top: 8em;
    
    //margin-left: 40px;
    z-index: 999999999;

`;


// 마이페이지- 프로필(사진)
const Profile = styled.img`
    width: 50%;
    opacity: 0.8;
    margin-bottom: 20px;
    margin-top: 40px;
    padding: 40px 0px;
`;


// 마이페이지- 바디(메뉴)
const Menu = styled.a`
   
    width: 240px;

    //margin: 0 auto;
    //margin-top: 30px;
    
    display: flex;
    //flex-direction: column;
    //align-items: flex-start;
    align-items: center;
    border-bottom: 1px solid rgba(107,118,132,0.2);
   padding: 5px 20px;
    
    
    .a{
        width: 150px;
        color: #fff;
        font-family: 'SUIT-Regular' !important;
        font-weight: 500;
        font-size: 16px;
        line-height: 50px;
        cursor: pointer;
        text-align: left;
    }
    
    .a:hover{
        color: #6B7684;
        //border-bottom: 2px solid #1351f9;
    }
    .a:focus{
        color: #1351f9;
        //border-bottom: 2px solid #1351f9;
    }
`;





