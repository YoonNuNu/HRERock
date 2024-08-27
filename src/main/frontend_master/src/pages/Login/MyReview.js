import React, { useCallback, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

import '../Login/css/MyPage.css';

function MyReview() {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const navigate = useNavigate();

    // const api = axios.create({
    //     baseURL: "http://localhost:8080"
    // });

    const reviewsPerPage = 1;

    // 인증 확인
    const checkPermission = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`/auth/memberinfo`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const role = response.data.memRole;
            if (role === 'ADMIN' || role === 'USER') {
                setHasPermission(true);
            } else {
                alert("권한이 없습니다.");
                navigate('/');
            }
        } catch (error) {
            // console.error('Error fetching user info:', error);
            // alert("오류가 발생했습니다. 다시 로그인해주세요.");
            // navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        checkPermission();
        fetchReviews();
    }, [checkPermission]);

    const fetchReviews = useCallback(async () => {
        if (!hasMore) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`/user/mypage/reviews`, {
                params: {
                    page: currentPage,
                    size: reviewsPerPage,
                    sort: 'createDate,desc'
                },
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });

            if (response.data && Array.isArray(response.data.content)) {
                setReviews(prevReviews => [...prevReviews, ...response.data.content]);
                setHasMore(response.data.content.length === reviewsPerPage);
                setCurrentPage(prevPage => prevPage + 1);
            } else {
                console.error('Unexpected response structure:', response.data);
                setError('리뷰 데이터 구조가 예상과 다릅니다.');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('리뷰를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, hasMore, axios]);

    const handleLoadMore = () => {
        fetchReviews();
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/user/mypage/reviews/${reviewId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('리뷰 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const getAttractionPointLabel = (key) => {
        const labels = {
            directingPoint: "감독연출",
            actingPoint: "배우연기",
            visualPoint: "영상미",
            storyPoint: "스토리",
            ostPoint: "OST"
        };
        return labels[key] || key;
    };

    const getEmotionPointLabel = (key) => {
        const labels = {
            stressReliefPoint: "스트레스 해소",
            scaryPoint: "무서움",
            realityPoint: "현실감",
            immersionPoint: "몰입감",
            tensionPoint: "긴장감"
        };
        return labels[key] || key;
    };

    if (error) {
        return <div className="myreview-error">{error}</div>;
    }

    return (
        <div className="myreview">
            <div className="myreview-list">
                {reviews.length === 0 ? (
                    <p>작성한 리뷰가 없습니다.</p>
                ) : (
                    reviews.map((review, index) => (
                        <div className="myreview-item" key={index}>
                            <div className="myreview-movie-title">
                                <Link to={`/user/MoviePage/${review.movieId}`}>
                                    {review.movieTitle}
                                </Link>
                            </div>
                            <div className="myreview-content">
                                <div className="myreview-poster">
                                    <Link to={`/user/MoviePage/${review.movieId}`}>
                                        <img src={review.poster?.posterUrls || '/path/to/default/poster.jpg'} alt={review.movieTitle} />
                                    </Link>
                                </div>
                                <div className="myreview-details">
                                    <div className="myreview-text">{review.reviewContent}</div>
                                    <div className="myreview-meta">
                                        <span className="myreview-date">{review.createDate}</span>
                                        <span className="myreview-rating">{'★'.repeat(Math.round(review.reviewRating))}</span>
                                    </div>
                                    <div className="qwer">
                                    <div className="review-points">
                                        <div className="attraction-points">
                                            매력 포인트:
                                            {review.attractionPointsResponseDTO && Object.entries(review.attractionPointsResponseDTO)
                                                .filter(([key, value]) => value)
                                                .map(([key, value]) => (
                                                    <span key={key} className="point-tag">{getAttractionPointLabel(key)}</span>
                                                ))}
                                        </div>
                                        <div className="emotion-points">
                                            감정 포인트:
                                            {review.emotionPointsResponseDTO && Object.entries(review.emotionPointsResponseDTO)
                                                .filter(([key, value]) => value)
                                                .map(([key, value]) => (
                                                    <span key={key} className="point-tag">{getEmotionPointLabel(key)}</span>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="myreview-actions">
                                        <button
                                            className="myreview-delete-btn"
                                            onClick={() => handleDelete(review.reviewId)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {(hasMore || reviews.length === 0) && !isLoading && (
                <button onClick={handleLoadMore} className="mypage-load-more">
                    더보기
                </button>
            )}
            {isLoading && <div className="myreview-loading">Loading...</div>}
        </div>
    );
}

export default MyReview;