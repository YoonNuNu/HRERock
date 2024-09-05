import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaPlay } from 'react-icons/fa';
import '../Login/css/MyPage.css';



const DraggableMovieItem = ({ movie, showPlayButton, showProgressBar, progressPercentage, onDragStart, onDragEnd }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'watch-history',
        item: () => {
            onDragStart();
            return { id: movie.watchId, type: 'watch-history' };
        },
        end: (item, monitor) => {
            onDragEnd();
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <li ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="mypage-watch-history-item">
            <div className="mypage-poster-container">
                <img
                    src={movie.poster.posterUrls}
                    alt={movie.movieTitle}
                    className="mypage-movie-poster"
                />
                {showPlayButton && (
                    <Link
                        to={`/user/MoviePlay/${movie.movieId}`}
                        state={{watchedTime: movie.watchTime}}
                        className="mypage-play-button"
                    >
                        <FaPlay/>
                    </Link>
                )}
                {showProgressBar && (
                    <div className="mypage-progress-bar">
                        <div
                            className="mypage-progress"
                            style={{width: `${progressPercentage}%`}}
                        ></div>
                    </div>
                )}
                <figcaption className='mypage-movie-title'>
                    {movie.movieTitle}
                </figcaption>
            </div>
        </li>
    );
};

const DropZone = ({ onDrop, isVisible }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'watch-history',
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    if (!isVisible) return null;

    return (
        <div ref={drop} className={`mypage-dropzone ${isOver ? 'active' : ''}`}>
            <p>시청 기록을 삭제하려면 여기로 드래그하세요</p>
        </div>
    );
};

function WatchHistory() {
    const [watchHistory, setWatchHistory] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isDropZoneVisible, setIsDropZoneVisible] = useState(false);

    // const api = axios.create({
    //     baseURL: "http://localhost:8080"
    // });

    const itemsPerPage = 4;

    useEffect(() => {
        fetchWatchHistory(currentPage);
    }, [currentPage]);

    const fetchWatchHistory = async (page) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No access token found');
                setError('접근 토큰이 없습니다. 다시 로그인해주세요.');
                return;
            }

            const response = await axios.get(`/user/mypage/history`, {
                params: {
                    page: page,
                    size: itemsPerPage
                },
                headers: {'Authorization': `Bearer ${token}`}
            });

            console.log('Response data:', response.data);
            setWatchHistory(prevHistory => [...prevHistory, ...response.data.content]);
            setHasMore(response.data.content.length === itemsPerPage);
        } catch (error) {
            console.error('Error fetching watch history:', error);
            setError('시청 기록을 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleDrop = async (item) => {
        if (item.type === 'watch-history') {
            try {
                const token = localStorage.getItem('accessToken');
                await axios.delete(`/user/mypage/history/${item.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setWatchHistory(prevHistory => prevHistory.filter(movie => movie.watchId !== item.id));
            } catch (error) {
                console.error('Error deleting watch history item:', error);
            }
        }
        setIsDropZoneVisible(false);
    };

    const handleDragStart = () => {
        setIsDropZoneVisible(true);
    };

    const handleDragEnd = () => {
        setIsDropZoneVisible(false);
    };

    if (error) {
        return <div className="mypage-error">{error}</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="mypage-watch-history">
                {watchHistory.length === 0 && !loading ? (
                    <div className="mypage-empty-state">시청 기록이 없습니다.</div>
                ) : (
                    <>
                        <ul className="mypage-watch-history-list">
                            {watchHistory.map((movie, index) => {
                                const progressPercentage = (movie.watchTime / movie.totalDuration) * 100;
                                return (
                                    <DraggableMovieItem
                                        key={movie.watchId}
                                        movie={movie}
                                        showPlayButton={true}
                                        showProgressBar={true}
                                        progressPercentage={progressPercentage}
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
                                    />
                                );
                            })}
                        </ul>
                        {hasMore && !loading && (
                            <button onClick={handleLoadMore} className="mypage-load-more">
                                더보기
                            </button>
                        )}
                    </>
                )}
                {loading && <div className="mypage-loading">Loading...</div>}
                <DropZone onDrop={handleDrop} isVisible={isDropZoneVisible} />
            </div>
        </DndProvider>
    );
}

export default WatchHistory;