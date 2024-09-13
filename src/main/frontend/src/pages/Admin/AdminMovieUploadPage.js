import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from './SideBar';

import "./css/AdminMovieUpload.css";
import home from "./images/home.svg";

import AddActorModal from './AddActorModal';
import AddDirectorModal from './AddDirectorModal';
import ChatBot from '../../components/ChatBot/ChatBot';
import styled from 'styled-components';


//  새 영화 1번째 페이지
function AdminMovieUploadPage() {
    const navigate = useNavigate();
    const [movieId, setMovieId] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');
    const [isActorModalOpen, setIsActorModalOpen] = useState(false);
    const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);

    // 관리자 권한 인증 확인
    const initializedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    // 영화 데이터 상태 관리
    const [movieData, setMovieData] = useState({
        movieDirectors: [],
        movieActors: [],
        movieGenres: [],
        runTime: '',
        movieDescription: '',
        movieRating: 'ratingTrue',
        openYear: ''
    });



    // 자동완성 데이터 관리
    const [autoCompleteData, setAutoCompleteData] = useState({
        directors: [],
        actors: [],
        genres: []
    });
    const [inputValues, setInputValues] = useState({
        director: '',
        actor: '',
        genre: ''
    });
    const [showSuggestions, setShowSuggestions] = useState({
        director: false,
        actor: false,
        genre: false
    });
    const [page, setPage] = useState({
        director: 0,
        actor: 0,
        genre: 0
    });
    const [hasMore, setHasMore] = useState({
        director: true,
        actor: true,
        genre: true
    });

    const [inputPosition, setInputPosition] = useState({ top: 0, left: 0, width: 0 });


    // 인증 로직
    const checkPermission = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('/auth/memberinfo', {
                headers: {'Authorization': 'Bearer ' + token}
            });
            const role = response.data.memRole;
            if (role === 'ADMIN') {
                setHasPermission(true);
            } else {
                alert("권한이 없습니다.");
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            alert("오류가 발생했습니다. 다시 로그인해주세요.");
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            checkPermission();
        }
    }, []);

    // 무한 스크롤을 위한 Intersection Observer 설정
    const observer = useRef();
    const lastSuggestionElementRef = useCallback((type) => (node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore[type]) {
                setPage(prevPage => {
                    const newPage = prevPage[type] + 1;
                    fetchAutoCompleteData(type, inputValues[type], newPage);
                    return {...prevPage, [type]: newPage};
                });
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore, inputValues]);

    // 자동완성 데이터 fetch 함수
    const fetchAutoCompleteData = useCallback(async (type, value, pageNum) => {
        if (!value.trim()) {
            setAutoCompleteData(prevData => ({...prevData, [type]: []}));
            setShowSuggestions(prevShow => ({...prevShow, [type]: false}));
            return;
        }
        try {
            const response = await axios.get(`/admin/${type}s/search`, {
                params: {query: value, page: pageNum, size: 10}
            });
            setAutoCompleteData(prevData => ({
                ...prevData,
                [type]: pageNum === 0
                    ? response.data.content
                    : [...prevData[type], ...response.data.content]
            }));
            setHasMore(prevHasMore => ({...prevHasMore, [type]: !response.data.last}));
            setShowSuggestions(prevShow => ({...prevShow, [type]: true}));
        } catch (error) {
            console.error(`Error fetching ${type} data:`, error);
        }
    }, []);

    // 입력 변경 핸들러
    const handleInputChange = useCallback((e) => {
        const {name, value} = e.target;
        if (name === 'movieTitle') {
            setMovieTitle(value);
        } else if (name === 'movieRating') {
            setMovieData(prevData => ({
                ...prevData,
                [name]: value
            }));
        } else {
            setInputValues(prevValues => ({...prevValues, [name]: value}));
            setMovieData(prevData => ({...prevData, [name]: value}));
            setPage(prevPage => ({...prevPage, [name]: 0}));
            fetchAutoCompleteData(name, value, 0);
        }
    }, [fetchAutoCompleteData]);

    // 자동완성 항목 선택 핸들러
    const handleSuggestionClick = (type, item) => {
        const existingItems = movieData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`];

        // 중복 확인
        const isDuplicate = existingItems.some(existingItem => existingItem[`${type}Id`] === item[`${type}Id`]);

        if (isDuplicate) {
            alert(`중복된 ${type === 'director' ? '감독' : type === 'actor' ? '배우' : '장르'}입니다.`);
            return; // 중복일 경우 추가하지 않음
        }

        // 중복이 아니면 추가
        setInputValues(prevValues => ({ ...prevValues, [type]: '' }));
        setMovieData(prevData => ({
            ...prevData,
            [`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`]: [
                ...prevData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`],
                { [`${type}Id`]: item[`${type}Id`], [`${type}Name`]: item[`${type}Name`] }
            ]
        }));
        setShowSuggestions(prevShow => ({ ...prevShow, [type]: false }));
        setAutoCompleteData(prevData => ({ ...prevData, [type]: [] }));
    };

    const handleInputFocus = useCallback((type) => {
        setShowSuggestions(prevShow => {
            const newShow = {...prevShow};
            Object.keys(newShow).forEach(key => {
                newShow[key] = key === type && !!inputValues[type].trim();
            });
            return newShow;
        });
    }, [inputValues]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.input-container')) {
                setShowSuggestions({
                    director: false,
                    actor: false,
                    genre: false
                });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 영화 제목 저장 핸들러
    const handleTitleSubmit = async (e) => {
        e.preventDefault();
        if (!movieTitle.trim()) {
            alert('영화 제목을 입력해주세요.');
            return;
        }
        try {
            const response = await axios.post('/admin/movie/list/addDetail1', {movieTitle});
            const newMovieId = response.data.movieId;
            setMovieId(newMovieId);
            setMovieData(prevData => ({
                ...prevData,
                movieTitle: movieTitle,
                movieDirectors: [],
                movieActors: [],
                movieGenres: [],
                runTime: '',
                movieDescription: '',
                openYear: ''
            }));
            alert(`영화 "${movieTitle}"이(가) 성공적으로 생성되었습니다. (영화 ID: ${newMovieId})\n다른 정보를 입력해 주세요.`);
        } catch (error) {
            console.error('Error submitting movie title:', error);
            if (error.response && error.response.status === 409) {
                const confirmCreate = window.confirm(`"${movieTitle}" 제목의 영화가 이미 존재합니다. 같은 제목으로 새 영화를 생성하시겠습니까?`);
                if (confirmCreate) {
                    try {
                        const retryResponse = await axios.post('/admin/movie/list/addDetail1', {
                            movieTitle,
                            allowDuplicate: true
                        });
                        const newMovieId = retryResponse.data.movieId;
                        setMovieId(newMovieId);
                        setMovieData(prevData => ({
                            ...prevData,
                            movieTitle: movieTitle,
                            movieDirectors: [],
                            movieActors: [],
                            movieGenres: [],
                            runTime: '',
                            movieDescription: '',
                            movieRating: 'ratingTrue',
                            openYear: ''
                        }));
                        alert(`영화 "${movieTitle}"이(가) 성공적으로 생성되었습니다. (영화 ID: ${newMovieId})\n다른 정보를 입력해 주세요.`);
                    } catch (retryError) {
                        console.error('Error retrying movie title submission:', retryError);
                        alert('영화 제목 저장 중 오류가 발생했습니다.');
                    }
                }
            } else {
                alert('영화 제목 저장 중 오류가 발생했습니다.');
            }
        }
    };

    // 전체 영화 데이터 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!movieId) {
            alert('먼저 영화 제목을 저장해주세요.');
            return;
        }
        try {
            const dataToSend = {
                movieId,
                movieTitle,
                movieDirectors: movieData.movieDirectors.length > 0 ? movieData.movieDirectors : null,
                movieActors: movieData.movieActors.length > 0 ? movieData.movieActors : null,
                movieGenres: movieData.movieGenres.length > 0 ? movieData.movieGenres : null,
                runTime: parseInt(movieData.runTime, 10) || 0,
                openYear: parseInt(movieData.openYear, 10) || 0,
                movieRating: movieData.movieRating === 'ratingTrue' ? '청소년 관람 가능' : '청소년 관람 불가능',
                movieDescription: movieData.movieDescription || null
            };
            const response = await axios.post('/admin/movie/list/addDetail2', dataToSend);
            if (response.data && response.data.movieId) {
                navigate("/admin/MovieUploadFile", {
                    state: {
                        movieId: response.data.movieId,
                        movieTitle: response.data.movieTitle
                    }
                });
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            alert('영화 정보 제출 중 오류가 발생했습니다. 콘솔을 확인해 주세요.');
        }
    };

    const renderSelectedItems = (type) => {
        const items = movieData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`];
        return items.map((item, index) => (
            <div className="manPoster" key={index}>
                {item[`${type}Name`]}
                <button onClick={() => removeItem(type, index)}>X</button>
            </div>
        ));
    };

    const removeItem = (type, index) => {
        setMovieData(prevData => ({
            ...prevData,
            [`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`]: prevData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`].filter((_, i) => i !== index)
        }));
    };

    const handleActorAdd = (newActor) => {
        setMovieData(prevData => ({
            ...prevData,
            movieActors: [
                ...prevData.movieActors,
                {actorId: newActor.actorId, actorName: newActor.actorName}
            ]
        }));
        setAutoCompleteData(prevData => ({
            ...prevData,
            actors: [newActor, ...prevData.actors]
        }));
    };

    const handleDirectorAdd = (newDirector) => {
        setMovieData(prevData => ({
            ...prevData,
            movieDirectors: [
                ...prevData.movieDirectors,
                {directorId: newDirector.directorId, directorName: newDirector.directorName}
            ]
        }));
        setAutoCompleteData(prevData => ({
            ...prevData,
            directors: [newDirector, ...prevData.directors]
        }));
    };

    // 스타일 관련 객체들
    const suggestionListStyle = {
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        maxHeight: '200px',
        overflowY: 'auto',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        width: '40%',
        top: "110%",
        // right: 200,

    };

    const suggestionItemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        fontsize: '100px',
    };


    const suggestionImageStyle = {
        width: '50px',
        height: '50px',
        marginRight: '10px',
        objectFit: 'cover',
        borderRadius: "50%",
    };

    const suggestionTextStyle = {
        display: 'flex',
        flexDirection: 'column',
        fontsize: '100px',
    };

    // 권한없을시 페이지 없음
    if (!hasPermission) {
        return null;
    }



    return (


        <>
            <Wrap>
                <SideBar />
                <div className="admin_head">
                    <img src={home} alt="Home" />
                    <h2>관리자페이지</h2>
                </div>
                <div className="admin_movie_head">
                    <span>Admin {">"} 영화 관리 {">"} 새 영화 업로드 - 영화 정보</span>
                </div>



                <div className='UploadBody'>
                    <div className="AdminUploadHead">
                        <h2>영화 업로드</h2>
                    </div>
                    <div className="UploadInfo">
                        <form onSubmit={handleTitleSubmit} className="UploadTitleForm">
                            <label htmlFor="" >
                                <div>제목:</div>
                                <div className='MovieTitleInputDiv'>
                                    <input
                                        type="text"
                                        name="movieTitle"
                                        value={movieTitle}
                                        onChange={handleInputChange}
                                        required
                                        className='MovieTitleInput'
                                    />
                                    <input type='submit' className='MovietitleSubmit' value={"제목 업로드"}/>
                                </div>
                            </label>
                        </form>

                        <form onSubmit={handleSubmit} className="UploadInfoForm">
                            {['director', 'actor', 'genre'].map((type) => (<>

                                    <label key={type}>
                                        <div>{type.charAt(0).toUpperCase() + type.slice(1)}:</div>
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                name={type}
                                                className='MovieUploadInput'
                                                value={inputValues[type]}
                                                onChange={handleInputChange}
                                                onFocus={() => handleInputFocus(type)}
                                            />

                                            {type !== 'genre' && (
                                                <button
                                                    className="addPerson"
                                                    type="button"
                                                    onClick={() => type === 'actor' ? setIsActorModalOpen(true) : setIsDirectorModalOpen(true)}
                                                >
                                                    {type === 'actor' ? '배우 추가' : '감독 추가'}
                                                </button>
                                            )}

                                            {/* 감독, 배우 자동 완성 창 */}
                                            {showSuggestions[type] && autoCompleteData[type] && autoCompleteData[type].length > 0 && (
                                                <ul className="suggestions-list" style={suggestionListStyle}>
                                                    {autoCompleteData[type].map((item, index) => (
                                                        <li
                                                            key={item[`${type}Id`]}
                                                            onClick={() => handleSuggestionClick(type, item)}
                                                            ref={index === autoCompleteData[type].length - 1 ? lastSuggestionElementRef(type) : null}
                                                            style={suggestionItemStyle}
                                                        >
                                                            {item[`${type}Photo`] && item[`${type}Photo`][0] && (
                                                                <img
                                                                    src={item[`${type}Photo`][0].photoUrl}
                                                                    alt={item[`${type}Name`] || `${type} photo`}
                                                                    style={suggestionImageStyle}
                                                                    onError={(e) => {
                                                                        console.error(`Failed to load image for ${item[`${type}Name`]}:`, e);
                                                                        e.target.src = 'path/to/fallback/image.jpg';
                                                                    }}
                                                                />
                                                            )}
                                                            <div style={suggestionTextStyle}>

                                                                <strong style={{ fontSize: '17px', fontWeight: 300 }}>
                                                                    {item[`${type}Name`] || '이름 없음'}
                                                                    {item[`${type}Birth`] && ` (${item[`${type}Birth`]})`}
                                                                </strong>

                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </label>
                                    <div className='manPosterDiv'>
                                        {/* 자동 완성 선택 후 이름 추가 */}
                                        {renderSelectedItems(type)}
                                    </div>
                                </>
                            ))}
                            <label>
                                <div>시간:</div>
                                <div>
                                    <input
                                        type="text"
                                        name="runTime"
                                        className='MovieUploadInput'
                                        value={movieData.runTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </label>
                            <label>
                                <div>줄거리:</div>
                                <div>
                                    <input
                                        type="text"
                                        name="movieDescription"
                                        className='MovieUploadInput'
                                        value={movieData.movieDescription}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </label>
                            <label>
                                <div>청소년 관람 여부:</div>
                                <div>
                                    <select
                                        name="movieRating"
                                        value={movieData.movieRating}
                                        onChange={handleInputChange}
                                    >
                                        <option value="ratingTrue">청소년 관람 가능</option>
                                        <option value="ratingFalse">청소년 관람 불가능</option>
                                    </select>
                                </div>
                            </label>
                            <label>
                                <div>제작년도:</div>
                                <div>
                                    <input
                                        type="text"
                                        name="openYear"
                                        className='MovieUploadInput'
                                        value={movieData.openYear}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </label>
                            <div>
                                <input type="submit" value="다음" className="MovieUploadBtn"/>
                            </div>
                        </form>
                    </div>
                    <AddActorModal
                        isOpen={isActorModalOpen}
                        onClose={() => setIsActorModalOpen(false)}
                        onAdd={handleActorAdd}
                    />
                    <AddDirectorModal
                        isOpen={isDirectorModalOpen}
                        onClose={() => setIsDirectorModalOpen(false)}
                        onAdd={handleDirectorAdd}
                    />
                </div>
            </Wrap>
            <ChatBot />
        </>
    );

}


export default AdminMovieUploadPage;

const Wrap = styled.div`
    height: 1000px;
    background: #eee;


`