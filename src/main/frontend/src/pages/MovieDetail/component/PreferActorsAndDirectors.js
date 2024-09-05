import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {Link} from "react-router-dom";

const PreferActorsAndDirectors = ({ memNum }) => {
    const [actorsData, setActorsData] = useState([]);
    const [directorsData, setDirectorsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPreferredData = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('인증 토큰이 없습니다.');
            return;
        }

        try {
            const listTypes = ['personal_actors', 'personal_directors'];
            const requests = listTypes.map(type =>
                axios.get(`/user/personal/${memNum}/${type}-list`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );

            const [actorsResponse, directorsResponse] = await Promise.all(requests);

            setActorsData(actorsResponse.data);
            setDirectorsData(directorsResponse.data);
        } catch (error) {
            console.error('선호 배우/감독 데이터를 불러오는 중 오류 발생:', error);
            setError('데이터를 불러오는데 실패했습니다.');
        }
    }, [memNum]);

    useEffect(() => {
        fetchPreferredData();
    }, [fetchPreferredData]);
    //
    // if (loading) return <p>로딩 중...</p>;
    // if (error) return <p>{error}</p>;


    return (
        <>
            {/* 감독 리스트 */}
            <DetailContext>
                <ul className="DetailContext">
                    {/*감독리스트*/}
                    <DetailContextBox>
                        {directorsData.map((director, index) => (
                            <React.Fragment key={index}>
                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${director.director_name}`} target="_blank" >
                                    <Poster src={director.photo_url} alt={director.director_name} />
                                </Link>
                                <DetailContext>{director.director_name}</DetailContext>
                            </React.Fragment>
                        ))}
                    </DetailContextBox>

                    {/*배우리스트*/}
                    <DetailContextBox>
                        {actorsData.map((actor, index) => (
                            <React.Fragment key={index}>
                                <Link to={`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${actor.actor_name}`} target="_blank" >
                                    <Poster src={actor.photo_url} alt={actor.actor_name} />
                                </Link>
                                <DetailContext>{actor.actor_name}</DetailContext>
                            </React.Fragment>
                        ))}
                    </DetailContextBox>
                </ul>
            </DetailContext>
        </>
    );
};

export default PreferActorsAndDirectors;

// 감독/영화배우/장르 ----------------------------------------------
//데이터-연습용
const Detail_LIST = [
    {id: 1, title: '상위 감독 리스트'}, {id: 2, title: '상위 배우 리스트'}];


//포스터 + 리스트 박스
const DetailContextBox = styled.div`
    float: left;
    //width: 600px;
    display: flex;
    align-items: center;
    //border-bottom: 1px solid rgb(33, 33, 33);
    //border-bottom: 1px solid rgb(33, 33, 33);
    height: 90px;
`;


//감독 포스터(이미지)
const Poster = styled.img`
    float: left;
    width: 50px;
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 80%;
    margin-bottom: 20px;
    margin-top: 25px;
    object-fit: cover;
`;

//부모박스
const DetailBox = styled.div`
    width: 1024px;
    margin: 0 auto;
    margin-bottom: 80px;
    border-radius: 8px;
    background-color: rgb(11, 11, 13) !important;
    border: 1px solid rgb(25, 31, 40);
    display: flex;
    padding: 10px 40px;
`;

//텍스트
const Txt = styled.div`
    width: 200px;
    height: 50px;
    padding: 10px 0;
    text-align: left;
    margin-top: 20px;

    width: 1024px;
    margin: 0 auto;
    margin-bottom: 20px;
    display: flex;
    border-top: 1px solid rgb(33, 33, 33);
    border-bottom: 1px solid rgb(33, 33, 33);
    //border-radius: 8px;
    //background-color: rgb(11, 11, 13) !important;
    //border: 1px solid rgb(25, 31, 40);
    
    
    .txt{
        font-size: 18px;
        line-height: 86px;
        color: #fff;
        font-weight: 400;
        vertical-align: middle;
        display: flex;
        align-items: center;
        margin-left: 20px;
        padding: 0 30px;
    }
`;
const DetailTitles = styled.div`
    width: 160px;
    height: 90px;
`;

//제목: 리스트
const DetailTitle = styled.li`
    color: #fff;
    opacity: 0.64;
    font-size: 16px;
    text-align: left;
    text-indent: 15px;
    list-style: none;
    display: flex;
    align-items: center;
    width: 160px;
    height: 90px;
`;

//내용
const DetailContext = styled.li`
    width: 50px;
    font-size: 12px;
    font-weight: 300;
    text-overflow: hidden;
    color: #fff;
    //line-height: 96px;
    text-align: left;
    list-style: none;
    //text-indent: 10px;
    margin-right: 20px;
    margin-left: 20px;
`;






// ----------------------------------------------
//전체 박스
const WrapBody = styled.div`
    width: 100%;
    //height: 100vh;
    margin: 0 auto;
`;

const TopContainer = styled.div`
    width: 100%;
    grid-template-columns: 10rem minmax(auto, 100%) min-content;
    column-gap: 2rem;
    padding: 20px 40px;
    background-color: rgb(11, 11, 13) !important;
    border: 1px solid rgb(25, 31, 40);
    margin-bottom: 40px;
`;


// 프로필 감싸는 박스
const Section = styled.div`
    width: 1024px;
    display: flex;
    align-items: center;
`;

// 프로필 박스
const ProfileBoxContainer = styled.div`
    width: 1024px;
    //display: flex;
    margin-top: 20px;
    
`;


//나의 이용권-글씨
const TitleSub = styled.div`
    width: 600px;
    font-size: 14px;
    padding: 20px 20px;
    color: #a3a3a3;
    background-color: rgba(0, 0, 0, 1);
    border-radius: 12px;
    font-family: 'SUIT-Regular' !important;
    text-align: left;
    font-weight: 500;
    margin-bottom: 20px;
`;


// 프로필
const TopImg = styled.img`
    width: 160px;
    height: 160px;
    margin-right: 30px;
`;


//오른쪽- 전체 박스
const TitelBox = styled.div`
    width: 800px;
    color: #fff;
    font-family: 'SUIT-Regular';
    font-size: 20px;
    text-align: left;
    font-weight: 100;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    z-index: 1;
    margin-bottom: 10px;
    text-indent: 10px;

    .names {
        color: #ffa000;
        font-weight: 600;
    }
`;




//A.그래프 박스 스타일 -----------------------------------
//그래프 전체 박스 - 그래프 자리
const Wrap = styled.div`
    //사이즈
    width: 1024px;
    margin: 0 auto;
    //padding-top: 40px;
    //padding-bottom: 40px;
    margin-bottom: 25px;
    border-radius: 8px;
    //디자인
    //background-color: rgba(255, 255, 255, 0.1);
    background-color: #fff;
    display: flex;
`;


//그래프 제목
const Box = styled.div`
    font-size: 20px;
    text-align: center;
    color: #000;
    font-weight: 600;
    display: flex;
    justify-content: center;
    border-bottom: 5px solid #f4f4f4;
    margin: 0 auto;
    padding-top: 40px;
    padding-bottom: 12px;
    margin-bottom: 20px;
`;


//그래프 박스
const GraphBox = styled.div`
    //width: 420px;
    margin: 0 auto;
    //디자인
    border-radius: 80px;
    //이미지

    img {
        width: 250px;
    }
`;

//그래프 타이틀
const GrapTitle = styled.div`
    margin: 0 auto;
    width: 1024px;
    
    font-size: 20px;
    line-height: 86px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
`;


//B.바디 -----------------------------------
// 검색창 전체 폼
const FormBox = styled.form`
    width: 200px;
    margin-left: 20px;
    display: flex;
    align-items: center;
`;

//Select
const Select = styled.select`
    width: 100px;
    height: 30px;
    outline: none;
    font-size: 16px;
    text-align: left;
    color: #000;
    //border: none;
    background-color: #fff;
    border-bottom: 1px solid rgb(176, 184, 193);
    margin-right: 20px;
`;

//옵션
const Option = styled.option`
    //background-color: transparent;
    border: none;
`;


//1.추천 바디 박스
const RecommendConstainer = styled.div`
    width: 1044px;
    margin: 0 auto;
`;

//2.타이틀 박스
// const SectionANav = styled.div`
//     font-family: 'SUIT-Regular';
//     font-size: 22px;
//     line-height: 36px;
//     color: #fff;
//     font-weight: 400;
//     text-align: left;
//
//     margin-top: 40px;
//     margin-bottom: 40px;
//     margin-left: 3rem;
//     z-index: 1;
//     padding-top: 5rem;
// `;

//포스터 감싸는 전체 박스
const SectionContainer = styled.div`
    width: 1044px;
    display: flex;
    flex-direction: row;
    gap: 30px;
    margin-bottom: 80px;
`;

//★★연습용- 이미지
//타이틀+이미지+하단내용= 감싸는 박스
const SectionA = styled.div`
    width: 240px;
    overflow: hidden;


    span {
        overflow: hidden;
        width: 240px;
        padding-top: 20px;
        color: #a5a5a5;
        font-size: 14px;
        display: table-cell;
        vertical-align: top;
    }

    img {
        width: 240px;
        height: 360px;
        border-radius: 12px;
        will-change: transform;
        background-color: #252525;
        overflow: hidden;

        //호버시,

        &:hover {
            width: 240px;
            height: 360px;
            border-radius: 12px;
            transform: scale(1.1);
            transition: all 0.2s linear;
            overflow: hidden;

        }
    }
`;

//01.타이틀: 에피소드
const SectionTop = styled.div`
    width: 1044px;
    display: flex;
`;
const SectionTitle = styled.div`
    font-size: 20px;
    line-height: 86px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
    //margin-top: 140px;
`;

//오른쪽 더보기 버튼
const SectionR = styled.div`
    float: right;

    .button {
        font-size: 16px;
        line-height: 24px;
        color: #a5a5a5;
        padding: 5px 5px 5px 0;
        margin-bottom: 10px;
    }

    .bullet {
        width: 20px;
        margin: 4px 10px;
    }

    &:hover {
        font-weight: 600;
        color: #fff;
    }

`;
//3.바디 감싸는 박스
const Container = styled.div`
    width: 1024px;
    margin: 0 auto;
    margin-bottom: 40px;
    
 
`;



// const ImgBox = styled.div`
//     width: 1044px;
//     margin: 0 auto;
//     margin-bottom: 40px;
//
//     display: flex;
// `;
//

const Img = styled.div`
    width: 240px;
    height: 360px;
    border-radius: 12px;
    will-change: transform;
    display: flex;

    img {
        width: 240px;
        height: 360px;
        border-radius: 12px;
        will-change: transform;
        background-color: #252525;
        overflow: hidden;
    }
`;


//4.이미지 감싸는 박스
// const SectionA = styled.div`
//     width: 1044px;
//     margin: 0 auto;
//     position: relative;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//     margin-top: 2rem;
//
// `;


//C.그래프 데이터 -----------------------------------
//그래프1
const CHARMING_DATA_LIST = [{id: 1, title: '감독연출'}, {id: 2, title: '스토리'}, {id: 3, title: '영상미'}, {
    id: 4,
    title: '배우연기'
}, {id: 5, title: 'OST'},];
//그래프2
const EMOTIOMAL_DATA_LIST = [{id: 1, title: '스트레스 해소'}, {id: 2, title: '무서움'}, {id: 3, title: '현실감'}, {
    id: 4,
    title: '몰입감'
}, {id: 5, title: '긴장감'},];
