import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import PersonalCharts from './component/PersonalCharts';
import PreferActorsAndDirectors from "./component/PreferActorsAndDirectors";
import PointsContent from './component/PointsContent';
import PointsCollab from './component/PointsCollab';
import MovieCollab from './component/MovieCollab';

// Images
import top from "../Login/images/top.png";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

const Recommend = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [memberInfo, setMemberInfo] = useState(null);
    const [filesToDelete, setFilesToDelete] = useState({
        images: [],
        json: []
    });

    // Fetch member info
    const fetchMemberInfo = useCallback(async (token) => {
        try {
            const response = await axios.get('/auth/memberinfo', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return {
                role: response.data.memRole,
                memName: response.data.memName,
                memNum: response.data.memNum
            };
        } catch (error) {
            console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            if (error.response && error.response.status === 401) {
                setError("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                setError("사용자 정보를 가져오는데 실패했습니다.");
            }
            throw error;
        }
    }, [navigate]);

    // File deletion functions
    const addFileToDelete = useCallback((fileName, fileType) => {
        setFilesToDelete(prev => ({
            ...prev,
            [fileType]: [...prev[fileType], fileName]
        }));
    }, []);

    const addFilesToDeleteList = useCallback((memNum) => {
        // Image files
        addFileToDelete(`personal_attraction_${memNum}.png`, 'images');
        addFileToDelete(`personal_emotion_${memNum}.png`, 'images');
        addFileToDelete(`personal_genres_${memNum}.png`, 'images');

        // JSON files
        addFileToDelete(`movie_collab_recommendations_${memNum}.json`, 'json');
        addFileToDelete(`personal_actors_${memNum}.json`, 'json');
        addFileToDelete(`personal_directors_${memNum}.json`, 'json');
        addFileToDelete(`points_collab_recommendations_${memNum}.json`, 'json');
        addFileToDelete(`points_content_recommendations_${memNum}.json`, 'json');
    }, [addFileToDelete]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && !memberInfo) {
            fetchMemberInfo(token)
                .then(info => {
                    setMemberInfo(info);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError('데이터를 불러오는데 실패했습니다.');
                });
        }

        // Clean up function to delete files on unmount
        return () => {
            if ((filesToDelete.images.length > 0 || filesToDelete.json.length > 0) && memberInfo) {
                const deleteFiles = async () => {
                    try {
                        const token = localStorage.getItem('accessToken');
                        // Delete image files
                        if (filesToDelete.images.length > 0) {
                            await axios.post(`/user/personal/${memberInfo.memNum}/delete`,
                                { fileNames: filesToDelete.images },
                                { headers: { 'Authorization': `Bearer ${token}` } }
                            );
                        }

                        // Delete JSON files
                        if (filesToDelete.json.length > 0) {
                            await axios.post(`/user/personal/${memberInfo.memNum}/delete`,
                                { fileNames: filesToDelete.json },
                                { headers: { 'Authorization': `Bearer ${token}` } }
                            );
                        }

                        console.log('임시 파일들이 성공적으로 삭제되었습니다.');
                    } catch (error) {
                        console.error('임시 파일 삭제 중 오류 발생:', error);
                    }
                };

                deleteFiles();
            }
        };
    }, [filesToDelete, memberInfo, fetchMemberInfo]);

    useEffect(() => {
        if (memberInfo && memberInfo.memNum) {
            addFilesToDeleteList(memberInfo.memNum);
        }
    }, [memberInfo, addFilesToDeleteList]);

    return (
        <WrapBody>
            {/* Top section */}
            <TopContainer>
                <Section>
                    <TopImg src={top} alt="Profile" />
                    <ProfileBoxContainer>
                        <TitelBox>
                            <span className="names">{memberInfo?.memName}</span>&nbsp;님&nbsp;만의 추천 리스트를 받아보세요.
                        </TitelBox>
                        <TitleSub>
                            재밌게 본 영화의 리뷰를 작성해보세요!
                            여러분의 취향과 비슷한 분들을 찾아서, 그분들이 좋아한 영화를 추천해 드릴게요!
                        </TitleSub>
                    </ProfileBoxContainer>
                </Section>
            </TopContainer>

            {/* Charts section */}
            <GrapTitle>{memberInfo?.memName} 회원님의 영화 취향 분석</GrapTitle>
            <Wrap>
                {memberInfo && <PersonalCharts memNum={memberInfo.memNum} />}
            </Wrap>

            {/* Movie info section */}
            <Txt><span className="txt">영화 정보</span></Txt>
            <DetailBox>
                <DetailTitle>
                    <ul className="DetailTitle">
                        <DetailTitles>
                            {Detail_LIST.map(category => (
                                <DetailTitle key={category.id}>
                                    {category.title}
                                </DetailTitle>
                            ))}
                        </DetailTitles>
                    </ul>
                </DetailTitle>
                {memberInfo && <PreferActorsAndDirectors memNum={memberInfo.memNum} />}
            </DetailBox>

            {/* Recommendation sections */}
            <RecommendContainer>
                <Container>
                    <SectionTop>
                        <SectionTitle>감정 Pick😃</SectionTitle>
                    </SectionTop>
                    {memberInfo && <PointsContent memNum={memberInfo.memNum} />}
                </Container>
            </RecommendContainer>

            <RecommendContainer>
                <Container>
                    <SectionTop>
                        <SectionTitle>취향 Pick😍</SectionTitle>
                    </SectionTop>
                    {memberInfo && <PointsCollab memNum={memberInfo.memNum} />}
                </Container>
            </RecommendContainer>

            <RecommendContainer>
                <Container>
                    <SectionTop>
                        <SectionTitle>선호 Pick😘</SectionTitle>
                    </SectionTop>
                    {memberInfo && <MovieCollab memNum={memberInfo.memNum} />}
                </Container>
            </RecommendContainer>
        </WrapBody>
    );
};

export default Recommend;

// Styled components (keeping the existing styles)
const WrapBody = styled.div`
    width: 100%;
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

const Section = styled.div`
    width: 1024px;
    display: flex;
    align-items: center;
`;

const ProfileBoxContainer = styled.div`
    width: 1024px;
    margin-top: 20px;
`;

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

const TopImg = styled.img`
    width: 160px;
    height: 160px;
    margin-right: 30px;
`;

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

const Wrap = styled.div`
    width: 1024px;
    margin: 0 auto;
    margin-bottom: 25px;
    border-radius: 8px;
    background-color: #fff;
    display: flex;
`;

const GrapTitle = styled.div`
    margin: 0 auto;
    width: 1024px;
    font-size: 20px;
    line-height: 86px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
`;

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

const Txt = styled.div`
    width: 1024px;
    margin: 0 auto;
    margin-bottom: 20px;
    display: flex;
    border-top: 1px solid rgb(33, 33, 33);
    border-bottom: 1px solid rgb(33, 33, 33);

    .txt {
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

const RecommendContainer = styled.div`
    position: relative;
    width: 100%;
`;

const Container = styled.div`
    width: 1024px;
    margin: 0 auto;
    margin-bottom: 40px;
`;

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
`;

// Data for detail list
const Detail_LIST = [
    {id: 1, title: '상위 감독 리스트'},
    {id: 2, title: '상위 배우 리스트'}
];