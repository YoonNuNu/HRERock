import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AddActorModal from './AddActorModal';
import AddDirectorModal from './AddDirectorModal';

import SideBar from './SideBar';
import home from "./images/home.svg";
import ChatBot from '../../components/ChatBot/ChatBot';
import styled from 'styled-components';


function AdminMovieUploadModifyPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [hasPermission, setHasPermission] = useState(false);

    const [movieData, setMovieData] = useState({
        movieTitle: '',
        movieDirectors: [],
        movieActors: [],
        movieGenres: [],
        runTime: '',
        movieDescription: '',
        movieRating: 'ratingTrue',
        openYear: ''
    });

    const [isActorModalOpen, setIsActorModalOpen] = useState(false);
    const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    const fetchMovieData = useCallback(async () => {
        try {
            checkPermission();
            setIsLoading(true);
            const response = await axios.get(`/admin/movie/${movieId}`);
            setMovieData({
                movieTitle: response.data.movieTitle || '',
                movieDirectors: response.data.movieDirectors || [],
                movieActors: response.data.movieActors || [],
                movieGenres: response.data.movieGenres || [],
                runTime: response.data.runTime || '',
                movieDescription: response.data.movieDescription || '',
                movieRating: response.data.movieRating === '청소년 관람 가능' ? 'ratingTrue' : 'ratingFalse',
                openYear: response.data.openYear || ''
            });
        } catch (error) {
            console.error('Error fetching movie data:', error);
            alert('영화 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [movieId]);

    useEffect(() => {
        fetchMovieData();
    }, [fetchMovieData]);

    const fetchAutoCompleteData = useCallback(async (type, value) => {
        if (!value.trim()) {
            setShowSuggestions(prevShow => ({ ...prevShow, [type]: false }));
            setAutoCompleteData(prevData => ({ ...prevData, [type]: [] }));
            return;
        }
        try {
            const response = await axios.get(`/admin/${type}s/search`, {
                params: { query: value }
            });
            setAutoCompleteData(prevData => ({
                ...prevData,
                [type]: response.data.content
            }));
            setShowSuggestions(prevShow => ({
                ...prevShow,
                [type]: true
            }));
        } catch (error) {
            console.error(`Error fetching ${type} data:`, error);
        }
    }, []);

    // 로그인 확인, 권한 확인
    const checkPermission = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('/auth/memberinfo', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const role = response.data.memRole;
            if (role === 'ADMIN') {
                setHasPermission(true);
            } else {
                alert("관리자만 볼 수 있는 페이지입니다.");
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            alert("오류가 발생했습니다. 다시 로그인해주세요.");
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // 자동완성 필드일 경우
        if (['director', 'actor', 'genre'].includes(name)) {
            setInputValues(prevValues => ({ ...prevValues, [name]: value }));
            setAutoCompleteData(prevData => ({ ...prevData, [name]: [] }));
            if (value.trim()) {
                fetchAutoCompleteData(name, value);
            } else {
                setShowSuggestions(prevShow => ({ ...prevShow, [name]: false }));
            }
        } else {
            // 일반 필드일 경우
            setMovieData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

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
        setShowSuggestions(prevShow => ({
            director: false,
            actor: false,
            genre: false,
            [type]: true
        }));
    }, []);

    const renderSelectedItems = (type) => {
        const items = movieData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`];
        return items.map((item, index) => (
            <div key={index}>
                {item[`${type}Name`]}
                <button onClick={(e) => removeItem(type, index, e)}>X</button>
            </div>
        ));
    };


    const removeItem = (type, index, event) => {
        // 이벤트 전파 중지
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setMovieData(prevData => {
            const updatedItems = [...prevData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`]];
            updatedItems.splice(index, 1);
            return {
                ...prevData,
                [`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`]: updatedItems
            };
        });
    };


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.input-container') && !e.target.closest('.suggestions-list')) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...movieData,
                movieId: movieId,
                movieRating: movieData.movieRating === 'ratingTrue' ? '청소년 관람 가능' : '청소년 관람 불가능'
            };
            const response = await axios.put(`/admin/movie/${movieId}/updateFirst`, dataToSubmit);
            navigate(`/admin/movie/${movieId}/modify2`, { state: { movieData: response.data } });
        } catch (error) {
            console.error('Error updating movie:', error);
            console.error('Error response:', error.response?.data);
            alert('영화 정보 수정에 실패했습니다.');
        }
    };

    const handleActorAdd = (newActor) => {
        setMovieData(prevData => ({
            ...prevData,
            movieActors: [
                ...prevData.movieActors,
                { actorId: newActor.actorId, actorName: newActor.actorName }
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
                { directorId: newDirector.directorId, directorName: newDirector.directorName }
            ]
        }));
        setAutoCompleteData(prevData => ({
            ...prevData,
            directors: [newDirector, ...prevData.directors]
        }));
    };

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
        top: '100%',
    };

    const suggestionItemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
    };

    const suggestionImageStyle = {
        width: '50px',
        height: '50px',
        marginRight: '10px',
        objectFit: 'cover',
        borderRadius: '50%',
    };

    const suggestionTextStyle = {
        display: 'flex',
        flexDirection: 'column',
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
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
                    <span>Admin {">"} 영화 관리 {">"} 영화 수정 - 영화 정보</span>
                </div>

                <div className='UploadBody'>
                    <div className="AdminUploadHead">
                        <h2>영화 수정 - 기본 정보</h2>
                    </div>
                    <div className="UploadInfo">
                        <form onSubmit={handleSubmit} className="UploadInfoForm">
                            <label>
                                <div>제목:</div>
                                <div>
                                    <input
                                        type="text"
                                        name="movieTitle"
                                        className='MovieUploadInput'
                                        value={movieData.movieTitle}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </label>

                            {['director', 'actor', 'genre'].map((type) => (
                                <>
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
                                                    type="button"
                                                    onClick={() => type === 'actor' ? setIsActorModalOpen(true) : setIsDirectorModalOpen(true)}
                                                >
                                                    {type === 'actor' ? '배우 추가' : '감독 추가'}
                                                </button>
                                            )}
                                            {showSuggestions[type] && autoCompleteData[type] && autoCompleteData[type].length > 0 && (
                                                <ul className="suggestions-list" style={suggestionListStyle}>
                                                    {autoCompleteData[type].map((item, index) => (
                                                        <li
                                                            key={item[`${type}Id`]}
                                                            onClick={() => handleSuggestionClick(type, item)}
                                                            style={suggestionItemStyle}
                                                        >
                                                            {item[`${type}Photo`] && item[`${type}Photo`][0] && (
                                                                <img
                                                                    src={item[`${type}Photo`][0].photoUrl}
                                                                    alt={item[`${type}Name`] || `${type} photo`}
                                                                    style={suggestionImageStyle}
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
                                    <textarea
                                        name="movieDescription"
                                        style={{ color: 'black', backgroundColor: 'white', border: '1px solid #ccc', padding: '5px', width: '50%', height: '200px', resize:'none'}}
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
                                <input type="submit" value="저장" className="MovieUploadBtn" />
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

export default AdminMovieUploadModifyPage;

const Wrap = styled.div`
    height: 1000px;
    background: #eee;


`