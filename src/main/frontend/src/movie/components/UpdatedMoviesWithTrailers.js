import React, {useEffect, useState, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";

function UpdateMoviesWithTrailers() {
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTrailer, setShowTrailer] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchUpdatedWithTrailers = async() => {
            try {
                const response = await axios.get(`/user/main/updated-trailers`);
                setMovies(response.data);
            } catch (error) {
                console.error('트레일러 에러', error);
            }
        };
        fetchUpdatedWithTrailers();
    }, []);

    useEffect(() => {
        if (movies.length > 0) {
            setShowTrailer(false);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setShowTrailer(true);
            }, 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [currentIndex, movies]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        // 위 코드는 이미 목록의 끝에 도달하면 처음으로 돌아가는 로직을 포함하고 있습니다.
        // (prevIndex + 1) % movies.length는 마지막 인덱스 다음에 0으로 돌아갑니다.
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
        // 마찬가지로, 첫 번째 항목에서 이전으로 가면 마지막 항목으로 이동합니다.
    };

    const handleTrailerEnded = () => {
        nextSlide();
    };

    if (movies.length === 0) {
        return <div>Loading...</div>;
    }

    const currentMovie = movies[currentIndex];

    return (
        <>
            <div className="slide">
                <div className="slide_page">
                    {showTrailer && currentMovie.trailer ? (
                        <ReactPlayer
                            url={currentMovie.trailer.trailerUrls}
                            playing={true}
                            controls={true}
                            width="100%"
                            height="100%"
                            onEnded={handleTrailerEnded}
                        />
                    ) : (
                        <div className="slide_content">
                            <img
                                src={currentMovie.poster ? currentMovie.poster.posterUrls : '포스터'}
                                alt={currentMovie.movieTitle}
                                className={"slide_img"}
                            />
                            <div className="slide-info">
                                <h2 className="movie-title">{currentMovie.movieTitle}</h2>
                                <p className="movie-description">{currentMovie.movieDescription}</p>
                                <div className="button-group">
                                    <Link to={`/user/MoviePlay/${currentMovie.movieId}`} className="btn play">재생</Link>
                                    <Link to={`/user/MoviePage/${currentMovie.movieId}`}
                                          className="btn details">상세정보</Link>
                                </div>
                            </div>
                        </div>
                    )}
                    <button className="nav-button prev" onClick={prevSlide}>&lt;</button>
                    <button className="nav-button next" onClick={nextSlide}>&gt;</button>
                    <div className="indicator-container">
                        {movies.map((_, index) => (
                            <span
                                key={index}
                                className={`indicator ${currentIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                {index + 1}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UpdateMoviesWithTrailers;