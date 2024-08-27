import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminMovieUploadPage() {
    const navigate = useNavigate();
    const [movieId, setMovieId] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');

    //관리자 권한 인증 확인
    const initializedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);


    //인증
    const checkPermission = async () => {
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

    const [movieData, setMovieData] = useState({
        movieDirectors: [],
        movieActors: [],
        movieGenres: [],
        runTime: '',
        movieDescription: '',
        movieRating: 'ratingTrue',
        openYear: ''
    });

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

    useEffect(() => {
        if (inputValues.director) fetchAutoCompleteData('director', inputValues.director, page.director);
        if (inputValues.actor) fetchAutoCompleteData('actor', inputValues.actor, page.actor);
        if (inputValues.genre) fetchAutoCompleteData('genre', inputValues.genre, page.genre);
    }, [inputValues, page]);

    const fetchAutoCompleteData = async (type, value, pageNum) => {
        if (!value.trim()) return;
        try {
            console.log(`Fetching ${type} data for query: "${value}", page: ${pageNum}`);
            const response = await axios.get(`/admin/${type}s/search`, {
                params: {query: value, page: pageNum, size: 10}
            });
            console.log(`${type} search response:`, response.data);
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
        const {name, value} = e.target;
        if (name === 'movieTitle') {
            setMovieTitle(value);
        } else {
            setInputValues(prevValues => ({...prevValues, [name]: value}));
            setMovieData(prevData => ({...prevData, [name]: value}));
            setPage(prevPage => ({...prevPage, [name]: 0}));
            setAutoCompleteData(prevData => ({...prevData, [name]: []}));
            setShowSuggestions(prevShow => ({...prevShow, [name]: !!value.trim()}));
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

    const handleTitleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/movie/list/addDetail1', {movieTitle});
            setMovieId(response.data.movieId);
            setMovieData(prevData => ({...prevData, movieTitle: movieTitle}));
            alert('영화 제목이 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('Error submitting movie title:', error);
            alert('영화 제목 저장 중 오류가 발생했습니다.');
        }
    };

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
                movieRating: movieData.movieRating || null,
                movieDescription: movieData.movieDescription || null
            };

            console.log('Sending data to server:', JSON.stringify(dataToSend));

            const response = await axios.post('/admin/movie/list/addDetail2', dataToSend);
            console.log('Server response:', response.data);

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
            console.error('Error submitting movie data:', error.response?.data || error.message);
            alert('영화 정보 제출 중 오류가 발생했습니다. 콘솔을 확인해 주세요.');
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

    const removeItem = (type, index) => {
        setMovieData(prevData => ({
            ...prevData,
            [`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`]: prevData[`movie${type.charAt(0).toUpperCase() + type.slice(1)}s`].filter((_, i) => i !== index)
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
        width: '20%'
    };

    return (
        <div className='UploadBody'>
            <div className="AdminUploadHead">
                <h2>영화 업로드</h2>
            </div>
            <div className="UploadInfo">
                <form onSubmit={handleTitleSubmit} className="UploadTitleForm">
                    <label htmlFor="" className="label">
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
                                    <ul className="suggestions-list" style={suggestionListStyle}>
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
                            <input type="text" name="runTime" className='MovieUploadInput' value={movieData.runTime}
                                   onChange={handleInputChange}
                                   required/>
                        </div>
                    </label>
                    <label>
                        <div>줄거리:</div>
                        <div>
                            <input type="text" name="movieDescription" className='MovieUploadInput'
                                   value={movieData.movieDescription}
                                   onChange={handleInputChange} required/>
                        </div>
                    </label>
                    <label>
                        <div>청소년 관람 여부:</div>
                        <div>
                            <select name="movieRating" value={movieData.movieRating} onChange={handleInputChange}>
                                <option value="ratingTrue">청소년 관람 가능</option>
                                <option value="ratingFalse">청소년 관람 불가능</option>
                            </select>
                        </div>
                    </label>
                    <label>
                        <div>제작년도:</div>
                        <div>
                            <input type="text" name="openYear" className='MovieUploadInput'
                                   value={movieData.openYear}
                                   onChange={handleInputChange}
                                   required/>
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


export default AdminMovieUploadPage;
