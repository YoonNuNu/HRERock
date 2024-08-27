import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminMovieUploadModifyPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();
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
    const [isLoading, setIsLoading] = useState(true);

    // 자동완성을 위한 상태
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

    const observer = useRef();
    const lastSuggestionElementRef = useCallback((type) => (node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore[type]) {
                setPage(prevPage => ({...prevPage, [type]: prevPage[type] + 1}));
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    const fetchMovieData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/admin/movie/${movieId}`);
            console.log("Fetched movie data:", response.data); // API 응답 로그
            setMovieData(prevData => {
                const data = {
                    movieTitle: response.data.movieTitle, // 빈 문자열로 기본값 설정
                    movieDirectors: response.data.movieDirectors || [],
                    movieActors: response.data.movieActors || [],
                    movieGenres: response.data.movieGenres || [],
                    runTime: response.data.runTime || '', // runTime 추가
                    movieDescription: response.data.movieDescription || '', // movieDescription 추가
                    movieRating: response.data.movieRating || 'ratingTrue', // movieRating 추가
                    openYear: response.data.openYear // null 체크 추가
                };
                console.log("Updated movie data:", data); // 업데이트된 영화 데이터 로그
                return data;
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

    useEffect(() => {
        if (inputValues.director) fetchAutoCompleteData('director', inputValues.director, page.director);
        if (inputValues.actor) fetchAutoCompleteData('actor', inputValues.actor, page.actor);
        if (inputValues.genre) fetchAutoCompleteData('genre', inputValues.genre, page.genre);
    }, [inputValues, page]);

    useEffect(() => {
        console.log("Movie Data:", movieData); // 영화 데이터 확인
    }, [movieData]);

    const fetchAutoCompleteData = async (type, value, pageNum) => {
        if (!value.trim()) return;
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
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['director', 'actor', 'genre'].includes(name)) {
            setInputValues(prevValues => ({...prevValues, [name]: value}));
            setPage(prevPage => ({...prevPage, [name]: 0}));
            setAutoCompleteData(prevData => ({...prevData, [name]: []}));
            setShowSuggestions(prevShow => ({...prevShow, [name]: !!value.trim()}));
        } else {
            setMovieData(prevData => {
                const updatedData = { ...prevData, [name]: value };
                console.log(`Updated ${name}:`, updatedData[name]); // 각 필드 업데이트 로그
                return updatedData;
            });
        }
    };

    const handleSuggestionClick = (type, item) => {
        setInputValues(prevValues => ({...prevValues, [type]: ''}));
        setMovieData(prevData => ({
            ...prevData,
            [`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`]: [
                ...prevData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`],
                {[`${type}Id`]: item[`${type}Id`], [`${type}Name`]: item[`${type}Name`]}
            ]
        }));
        setShowSuggestions(prevShow => ({...prevShow, [type]: false}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...movieData,
                movieId: movieId // URL에서 가져온 movieId를 포함
            };
            console.log("Submitting data:", dataToSubmit);
            const response = await axios.put(`/admin/movie/${movieId}/updateFirst`, dataToSubmit);
            console.log("Movie updated successfully:", response.data);
            navigate(`/admin/movie/${movieId}/modify2`, { state: { movieData: response.data } });
        } catch (error) {
            console.error('Error updating movie:', error);
            console.error('Error response:', error.response?.data);
            alert('영화 정보 수정에 실패했습니다.');
        }
    };

    const renderSelectedItems = (type) => {
        const items = movieData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`];
        return items.map((item, index) => (
            <div key={index}>
                {item[`${type}Name`]}
                <button onClick={() => removeItem(type, index)}>X</button>
            </div>
        ));
    };

    const textareaStyle = {
        color: 'black',  // 텍스트 색상을 검정색으로 설정
        backgroundColor: 'white',  // 배경색을 흰색으로 설정
        border: '1px solid #ccc',  // 테두리 추가
        padding: '5px',  // 내부 여백 추가
        width: '100%',  // 너비를 100%로 설정
        minHeight: '100px',  // 최소 높이 설정
    };

    const removeItem = (type, index) => {
        setMovieData(prevData => ({
            ...prevData,
            [`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`]: prevData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`].filter((_, i) => i !== index)
        }));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
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
                                value={movieData.movieTitle}  // 기본값 추가
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </label>

                    {['director', 'actor', 'genre'].map((type) => (
                        <label key={type}>
                            <div>{type.charAt(0).toUpperCase() + type.slice(1)}:</div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name={type}
                                    className='MovieUploadInput'
                                    value={inputValues[type]}
                                    onChange={handleInputChange}
                                    onFocus={() => setShowSuggestions(prev => ({...prev, [type]: true}))}
                                />
                                {showSuggestions[type] && autoCompleteData[type] && autoCompleteData[type].length > 0 && (
                                    <ul className="suggestions-list" style={{
                                        position: 'absolute',
                                        zIndex: 1000,
                                        backgroundColor: 'white',
                                        border: '1px solid #ddd'
                                    }}>
                                        {autoCompleteData[type].map((item, index) => (
                                            <li
                                                key={item[`${type}Id`]}
                                                onClick={() => handleSuggestionClick(type, item)}
                                                ref={index === autoCompleteData[type].length - 1 ? lastSuggestionElementRef(type) : null}
                                            >
                                                {item[`${type}Name`]}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {renderSelectedItems(type)}
                        </label>
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
                                style={textareaStyle}  // 스타일 적용
                                value={movieData.movieDescription}  // 기본값 추가
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
                                value={movieData.openYear} // null 또는 undefined인 경우 빈 문자열로 설정
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
        </div>
    );
}

export default AdminMovieUploadModifyPage;
