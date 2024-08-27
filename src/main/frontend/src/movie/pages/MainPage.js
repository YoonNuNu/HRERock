import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// component
import UpdatedMoviesWithTrailers from '../components/UpdatedMoviesWithTrailers';
import IMDBScoreRanking from "../components/IMDBScoreRanking";
import ContinueWatching from '../components/ContinueWatching';
import RecentWatched from '../components/RecentWatched';
import UpdatedMovie from '../components/UpdatedMovie';


// css
import "../../common/css/MainPage.css";


function MainPage() {

    const initializedRef = useRef(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMemberInfo();
    }, []);

    const fetchMemberInfo = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                navigate('/login');
                return;
            }

            const response = await fetch('/auth/memberinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMemberInfo(data);
                // console.log('Member info:', data);
            } else {
                throw new Error('Failed to fetch user info');
            }
        } catch (error) {
            // console.error('Error fetching user info:', error);
            setError('사용자 정보를 불러오는데 실패했습니다.');
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };




    // useEffect(() => {
    //     if (!initializedRef.current) {
    //
    //         initializedRef.current = true;
    //
    //         const urlParams = new URLSearchParams(window.location.search);
    //
    //         const token = urlParams.get('token');
    //
    //         const loginMethod = urlParams.get('loginMethod');
    //
    //         if (token && loginMethod) {
    //             localStorage.setItem('accessToken', token);
    //
    //             localStorage.setItem('loginMethod', loginMethod);
    //
    //             window.history.replaceState({}, document.title, "/"); // URL 클리닝
    //
    //         }
    //
    //         fetchMemberInfo();
    //     }
    // }, []);

    // async function fetchMemberInfo() {
    //
    //     const accessToken = localStorage.getItem('accessToken');
    //
    //     try {
    //         const response = await fetch('/auth/memberinfo', {
    //
    //             method: 'GET',
    //
    //             headers: {
    //                 'Authorization': 'Bearer ' + accessToken
    //             }
    //
    //         });
    //
    //     } catch (error) {
    //         console.error('Error fetching member info:', error);
    //
    //         document.getElementById('member-info').innerText = '오류가 발생했습니다.';
    //     }
    // }

    // async function fetchMemberInfo() {
    //     const accessToken = localStorage.getItem('accessToken');
    //
    //     try {
    //         const response = await fetch('/auth/memberinfo', {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': 'Bearer ' + accessToken
    //             }
    //         });
    //
    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 console.error('Unauthorized access. Token might be invalid or expired.');
    //                 // 여기서 로그아웃 처리나 토큰 갱신 로직을 추가할 수 있습니다.
    //                 return;
    //             }
    //             throw new Error('Server responded with status: ' + response.status);
    //         }
    //
    //         const data = await response.json();
    //         console.log('Member info:', data);
    //         // 여기서 받아온 데이터를 화면에 표시하거나 상태를 업데이트할 수 있습니다.
    //         document.getElementById('member-info').innerText = JSON.stringify(data);
    //
    //     } catch (error) {
    //         console.error('Error fetching member info:', error);
    //         document.getElementById('member-info').innerText = '오류가 발생했습니다: ' + error.message;
    //     }
    // }

    const handleMovieClick = async (movieId) => {
        const token = localStorage.getItem('accessToken');
        if(!token) {
            alert("접근권한이 없습니다.");
            navigate('/login');
        } else {
            try {
                await axios.get(`/movie/${movieId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                navigate(`/user/MoviePage/${movieId}`);
            } catch (error) {
                if (error.response) {
                    switch (error.response.data.errCode) {
                        case "ERR_UNAUTHORIZED":
                            alert("접근 권한이 없습니다.");
                            navigate('/login');
                            break;

                        case "ERR_R_RATED_MOVIE":
                            alert("청소년 관람 불가 등급의 영화입니다.");
                            break;

                        case "ERR_MOVIE_NOT_FOUND":
                            alert("영화를 찾을 수 없습니다.");
                            break;

                        default:
                            alert("영화 정보를 불러오는 데 실패했습니다.")
                    }
                } else {
                    alert("서버와의 연결에 실패했습니다.");
                }
            }
        }

    }








    return (

        <>

            {/* <!-- ============================ 영화 랭킹 ============================= --> */}
            <div className="ranking">
                < UpdatedMoviesWithTrailers />
            </div>
            {/* <!-- ============================ 영화 이어보기 ============================= --> */}
            <div className="star_recommend">
                <div className="MainPageListHead">
                    <h2>영화 이어보기</h2>
                </div>
                < ContinueWatching />
            </div>
            {/* <!-- ============================ 랭킹(리뷰 -> 평점) ============================= --> */}
            <div className="review_recommend">
                <div className="MainPageListHead" >
                    <h2>
                        영화시청목록
                    </h2>
                </div>
                <RecentWatched />
            </div>
            {/* <!-- ============================ 영화 랭킹 ============================= --> */}
            <div className="star_recommend">
                <div className="MainPageListHead">
                    <h2>영화 인기 순위</h2>
                </div>
                < IMDBScoreRanking />
            </div>
            {/* <!-- ============================ 영화 시청목록 ============================= --> */}
            <div className="movie_upload">
                <div className="MainPageListHead" >
                    <h2>
                        최신 업로드된 영화
                    </h2>
                </div>
                <UpdatedMovie />
            </div>
            {/* <!-- ============================ 평점 추천 ============================= --> */}









        </>






    );
}

























export default MainPage;