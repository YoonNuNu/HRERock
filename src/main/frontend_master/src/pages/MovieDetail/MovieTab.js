// import React, { useState, useEffect, useCallback } from 'react';
// import axios from "axios";
// import YouTube from "react-youtube";
// import logo from  "./images/logo_ci.svg"
// import profile from  "./images/profile.png"


// // css
// import "./css/MovieTab.css"
// import { api } from '../../api/axios';
// import {Link, useNavigate} from 'react-router-dom';


// // ■MovieTab (리뷰)
// function MovieTab({ movieId, movieDetail, memRole, correspondMemName, correspondMemNum }) {

//     const [activeTab, setActiveTab] = useState('reviews');
//     const [totalReviews, setTotalReviews] = useState(0);
//     const [averageRating, setAverageRating] = useState(0);
//     const [reviews, setReviews] = useState([]);
//     const [error, setError] = useState(null);
//     const [newReview, setNewReview] = useState({content: '', rating: 5});
//     // const [reviewContent, setReviewContent] = useState('')
//     const [editingReview, setEditingReview] = useState(null);
//     const [editingReviewId, setEditingReviewId] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageNumbers, setPageNumbers] = useState([]);
//     const [hasPrevious, setHasPrevious] = useState(false);
//     const [hasNext, setHasNext] = useState(false);
//     // 매력 포인트
//     const [attractionPoints, setAttractionPoints] = useState({
//         dirctingPoint: false,
//         actingPoint: false,
//         visualPoint: false,
//         storyPoint: false,
//         ostPoint: false,
//     });
//     // 감점 포인트
//     const [emotionPoint, setEmotionPoints] = useState({
//         stressReliefPoint: false,
//         actingPoint: false,
//         realityPoint: false,
//         immersionPoint: false,
//         tnesionPoint: false,
//     })
//     // 매력 포인트 설정
//     const getAttractionPointLabel = (key) => {
//         const labels = {
//             dirctingPoint: "감독연출",
//             actingPoint: "배우연기",
//             visualPoint: "영상미",
//             storyPoint: "스토리",
//             ostPoint: "OST",
//         };

//         return(labels[key] || key);
//     };
//     // 감점 포인트 설정
//     const getEmotionPointLabel = (key) => {
//         const labels = {
//             stressReliefPoint: "스트레스 해소",
//             scaryPoint: "무서움",
//             realityPoint: "현실감",
//             immersionPoint: "몰입감",
//             tensionPoint: "긴장감"
//         };
//         return labels[key] || key;
//     };

//     const [isLike, setIsLike] = useState(false);
//     const [likeCounts, setLikeCounts] = useState({});
//     const [reviewLikes, setReviewLikes] = useState({});
//     const [sortBy, setSortBy] = useState('likes');
//     const [chartImages, setChartImages] = useState({
//         gender: null,
//         age: null,
//         attraction: null,
//         emotion: null
//     });
//     // ======================= useStat 설정 ===================================


//     useEffect(() => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//             fetchReviews(token, 1);
//             fetchInitialLikeStatuses(token);
//             fetchMovieChartImages();
//         }

//         // 컴포넌트가 언마운트될 때 실행될 cleanup 함수
//         return () => {
//             // 컴포넌트가 언마운트될 때 이미지 삭제 요청을 보냅니다.
//             const token = localStorage.getItem('accessToken');
//             if (token) {
//                 axios.post(`/user/movies/${movieId}/delete-image`, {
//                     fileNames: [
//                         `age_chart_${movieId}.png`,
//                         `attraction_chart_${movieId}.png`,
//                         `emotion_chart_${movieId}.png`,
//                         `gender_chart_${movieId}.png`
//                     ]
//                 }, {
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 })
//                     .then(response => {
//                         console.log('Images deleted:', response.data);
//                     })
//                     .catch((error) => {
//                         console.error('Error deleting images:', error);
//                     });
//             }
//         };
//     }, [movieId, sortBy]);

//     const fetchMovieDetail = useCallback(async (token) => {
//         try {
//             const response = await api.get(`/user/movies/detail/${movieId}`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             setMovieDetail(response.data);
//             console.log("영화정보", response.data);
//         } catch (error) {
//             console.error('영화 상세 정보를 가져오는 중 오류 발생:', error);
//             setMovieDetail(null);

//             if (error.response) {
//                 const errorData = error.response.data;
//                 if (typeof errorData === 'string') {
//                     setError(errorData);
//                 } else if (errorData.errCode) {
//                     switch (errorData.errCode) {
//                         case "ERR_R_RATED_MOVIE":
//                             alert("청소년 관람 불가 등급의 영화입니다.");
//                             break;
//                         case "ERR_UNAUTHORIZED":
//                             alert("접근 권한이 없습니다.");
//                             navigate('/login');
//                             break;
//                         case "ERR_MEMBER_NOT_FOUND":
//                             alert("회원 정보를 찾을 수 없습니다.");
//                             navigate('/login');
//                             break;
//                         case "ERR_MOVIE_NOT_FOUND":
//                             alert("영화를 찾을 수 없습니다.");
//                             break;
//                         case "ERR_TOKEN_EXPIRED":
//                             alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
//                             navigate('/login');
//                             break;
//                         default:
//                             alert(errorData.message || "영화 정보를 불러오는 데 실패했습니다.");
//                     }
//                 } else {
//                     alert("영화 정보를 불러오는 데 실패했습니다.");
//                 }
//             } else if (error.request) {
//                 setError("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
//             } else {
//                 setError("요청 설정 중 오류가 발생했습니다.");
//             }
//         }
//     }, [movieId, navigate, setError]);
    
//     //  
//     const fetchMovieChartImages = async () => {
//         try {
//             const token = localStorage.getItem('accessToken');
//             if (!token) throw new Error("로그인 토큰이 없습니다.");

//             const chartTypes = ['gender', 'age', 'attraction', 'emotion'];
//             const requests = chartTypes.map(type =>
//                 axios.get(`/user/movies/${movieId}/${type}-chart`, {
//                     responseType: 'arraybuffer',
//                     headers: { 'Authorization': `Bearer ${token}` }
//                 }).then(response => {
//                     const blob = new Blob([response.data], { type: 'image/png' });
//                     const url = URL.createObjectURL(blob);
//                     return { type, url };
//                 })
//             );
//             const results = await Promise.all(requests);
//             const images = results.reduce((acc, { type, url }) => {
//                 acc[type] = url;
//                 return acc;
//             }, {});
//             setChartImages(images);
//         } catch (error) {
//             setError('차트 이미지를 불러오는 데 실패했습니다.');
//         }
//     };


//     // 정렬 방식을 변경하는 함수
//     const handleSortChange = (newSortBy) => {
//         setSortBy(newSortBy);
//         // fetchReviews(localStorage.getItem('accessToken'), 1, newSortBy);
//     };


    
//     // 리뷰
//     const fetchReviews = async (token, page = 1) => {
//         try {
//             const response = await axios.get(`/user/movies/detail/${movieId}/reviews?page=${page}&sortBy=${sortBy}`, {
//                 headers: {'Authorization': `Bearer ${token}`}
//             });
//             const data = response.data;
//             // console.log('Fetched review data:', response.data);
//             setReviews(response.data.reviews);
//             setTotalReviews(response.data.totalReviews);
//             setAverageRating(response.data.averageRating);
//             setCurrentPage(response.data.currentPage);
//             setPageNumbers(response.data.pageNumbers);
//             setHasPrevious(response.data.hasPrevious);
//             setHasNext(response.data.hasNext);
//         } catch (error) {
//             // console.error('리뷰를 가져오는 중 오류 발생:', error);
//             setError('리뷰를 불러오는데 실패했습니다.');
//         }
//     };


//     // const handleReviewCharsWithLimit = (e) => {
//     //     const content = e.target.value;
//     //     if (content.length <= 50) {
//     //         setNewReview(prevState => ({...prev, content: content}));
//     //     } else {
//     //         alert("리뷰는 50자 이내로 작성해야 합니다.")
//     //     }
//     // };

//     // 수정 버튼
//     const handleEditClick = (review) => {
//         setNewReview({
//             content: review.reviewContent,
//             rating: review.reviewRating
//         });
//         setEditingReviewId(review.reviewId);
//     };

//     const handleAttractionPointChange = (e) => {
//         setAttractionPoints({...attractionPoints, [e.target.name]: e.target.checked});
//     };

//     const handleEmotionPointChange = (e) => {
//         setEmotionPoints({...emotionPoints, [e.target.name]: e.target.checked});
//     };

//     // 리뷰 업로드
//     const handleSubmitReview = async () => {
//         const token = localStorage.getItem('accessToken');
//         try {
//             const reviewData = {
//                 reviewContent: newReview.content,
//                 reviewRating: newReview.rating,
//                 attractionPoints: attractionPoints,
//                 emotionPoints: emotionPoints
//             };

//             if (editingReviewId) {
//                 await api.put(`/user/movies/detail/${movieId}/reviews/${editingReviewId}`, reviewData, {
//                     headers: {'Authorization': `Bearer ${token}`}
//                 });
//                 setEditingReviewId(null);
//             } else {
//                 await api.post(`/user/movies/detail/${movieId}/reviews`, reviewData, {
//                     headers: {'Authorization': `Bearer ${token}`}
//                 });
//             }
//             setNewReview({content: '', rating: 5});
//             setAttractionPoints({directingPoint: false, actingPoint: false, visualPoint: false, storyPoint: false, ostPoint: false});
//             setEmotionPoints({stressReliefPoint: false, scaryPoint: false, realityPoint: false, immersionPoint: false, tensionPoint: false});
//             await fetchReviews(token, currentPage);
//             alert(editingReviewId ? '리뷰가 수정되었습니다.' : '리뷰가 작성되었습니다.');
//         } catch (error) {
//             if (error.response && error.response.data) {
//                 alert(error.response.data);
//             } else {
//                 alert('리뷰 작성/수정에 실패했습니다. 다시 시도해 주세요.');
//             }
//         }
//     };

//     // 리뷰 삭제 기능
//     const handleDeleteReview = async (reviewId) => {
//         const token = localStorage.getItem('accessToken');
//         try {
//             const response = await axios.delete(`/user/movies/detail/${movieId}/reviews/${reviewId}`, {
//                 headers: {'Authorization': `Bearer ${token}`}
//             });

//             const { currentPage: newPage, totalReviews: newTotalReviews } = response.data;

//             //즉시 상태 업데이트
//             setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
//             setTotalReviews(newTotalReviews);

//             // 현재 페이지의 리뷰 수 계산
//             const currentPageReviewCount = reviews.length - 1;

//             // 삭제 후 페이지 결정
//             let pageToFetch;
//             if (currentPageReviewCount === 1 && currentPage > 1) {
//                 // 현재 페이지의 마지막 리뷰를 삭제한 경우, 이전 페이지로 이동
//                 pageToFetch = currentPage - 1;
//             } else {
//                 // 그 외의 경우, 현재 페이지 유지
//                 pageToFetch = currentPage;
//             }

//             setCurrentPage(pageToFetch);
//             await fetchReviews(token, pageToFetch);
//             // setTotalReviews(newTotalReviews);
//             alert('리뷰가 삭제되었습니다.');
//         } catch (error) {
//             console.error('리뷰 삭제 중 오류 발생:', error);
//             alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
//         }
//     };

//     const fetchInitialLikeStatuses = async (token) => {
//         try {
//             const response = await api.get(`/user/movies/detail/${movieId}/reviews/likes`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             const likeStatusArray = response.data; // [{reviewId, memNum, likeCount, like}]
//             const initialLikes = {};
//             console.log("Like Status:", response.data);

//             // 배열을 순회하며 상태를 초기화합니다.
//             likeStatusArray.forEach(status => {
//                 initialLikes[status.reviewId] = {
//                     isLike: status.like,
//                     likeCount: status.likeCount
//                 };
//             });

//             setReviewLikes(initialLikes);
//         } catch (error) {
//             console.error('초기 좋아요 상태를 가져오는 중 오류 발생:', error);
//             setError('좋아요 상태를 불러오는데 실패했습니다.');
//         }
//     };



//     const toggleReviewLike = async (reviewId) => {
//         const token = localStorage.getItem('accessToken');
//         if (!token || !reviewId) {
//             console.error('AccessToken 또는 ReviewId가 없습니다');
//             return;
//         }

//         try {
//             const currentLikeStatus = reviewLikes[reviewId] || { isLike: false, likeCount: 0 };
//             const url = `/user/movies/detail/${movieId}/reviews/${reviewId}/likes`;

//             let response;
//             if (currentLikeStatus.isLike) {
//                 response = await api.delete(url, {
//                     headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//                     data: { movieId, reviewId }
//                 });
//             } else {
//                 response = await api.post(url, { movieId, reviewId }, {
//                     headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//                 });
//             }

//             const newLikeStatus = {
//                 isLike: response.data.like,
//                 likeCount: response.data.likeCount
//             };

//             setReviewLikes(prev => ({
//                 ...prev,
//                 [reviewId]: newLikeStatus
//             }));
//         } catch (error) {
//             console.error('좋아요 토글 중 오류 발생:', error);
//             alert('댓글 좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
//         }
//     };




//     //html ---------------------------------------------------------
//     return (
//         <>
//             <div className='tabDiv'>
//                 <div className="tabs">
//                     <button onClick={() => setActiveTab('reviews')}
//                             className={activeTab === 'reviews' ? 'active' : ''}>리뷰 ({totalReviews})
//                     </button>
//                     <button onClick={() => setActiveTab('trailer')}
//                             className={activeTab === 'trailer' ? 'active' : ''}>예고편
//                     </button>
//                 </div>
//                 {activeTab === 'reviews' && (
//                     <div className="tabDiv">
//                         <div className="chart-container">
//                             {chartImages.gender && <img src={chartImages.gender} alt="Gender Chart"/>}
//                             {chartImages.age && <img src={chartImages.age} alt="Age Chart"/>}
//                             {chartImages.attraction && <img src={chartImages.attraction} alt="Attraction Chart"/>}
//                             {chartImages.emotion && <img src={chartImages.emotion} alt="Emotion Chart"/>}
//                         </div>
//                         {/*<h2>리뷰 ({totalReviews})</h2>*/}
//                         <p>평균 평점: {averageRating.toFixed(1)}/5</p>
//                         {error && <p className="error">{error}</p>}
//                         {/*상황별 에러 수정해야함*/}
//                         <form className="review-input" onSubmit={(e) => {
//                             e.preventDefault();
//                             handleSubmitReview();
//                         }}>
//                           <textarea
//                               value={newReview.content}
//                               onChange={(e) => setNewReview({...newReview, content: e.target.value})}
//                               placeholder="리뷰를 작성해주세요. (50자 이내)"
//                               required
//                           />
//                             <div>
//                                 <label>평점: </label>
//                                 <input
//                                     type="number"
//                                     value={newReview.rating}
//                                     onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
//                                     min="1"
//                                     max="5"
//                                     required
//                                 />
//                             </div>
//                             <div className="points-section">
//                                 <div className="attraction-points">
//                                     <div className="points-title">매력 포인트</div>
//                                     <div className="points-checkboxes">
//                                         <label><input type="checkbox" name="directingPoint"
//                                                       checked={attractionPoints.directingPoint}
//                                                       onChange={handleAttractionPointChange}/> 감독연출</label>
//                                         <label><input type="checkbox" name="actingPoint"
//                                                       checked={attractionPoints.actingPoint}
//                                                       onChange={handleAttractionPointChange}/> 배우연기</label>
//                                         <label><input type="checkbox" name="visualPoint"
//                                                       checked={attractionPoints.visualPoint}
//                                                       onChange={handleAttractionPointChange}/> 영상미</label>
//                                         <label><input type="checkbox" name="storyPoint"
//                                                       checked={attractionPoints.storyPoint}
//                                                       onChange={handleAttractionPointChange}/> 스토리</label>
//                                         <label><input type="checkbox" name="ostPoint"
//                                                       checked={attractionPoints.ostPoint}
//                                                       onChange={handleAttractionPointChange}/> OST</label>
//                                     </div>
//                                 </div>
//                                 <div className="emotion-points">
//                                     <div className="points-title">감정 포인트</div>
//                                     <div className="points-checkboxes">
//                                         <label><input type="checkbox" name="stressReliefPoint"
//                                                       checked={emotionPoints.stressReliefPoint}
//                                                       onChange={handleEmotionPointChange}/> 스트레스 해소</label>
//                                         <label><input type="checkbox" name="scaryPoint"
//                                                       checked={emotionPoints.scaryPoint}
//                                                       onChange={handleEmotionPointChange}/> 무서움</label>
//                                         <label><input type="checkbox" name="realityPoint"
//                                                       checked={emotionPoints.realityPoint}
//                                                       onChange={handleEmotionPointChange}/> 현실감</label>
//                                         <label><input type="checkbox" name="immersionPoint"
//                                                       checked={emotionPoints.immersionPoint}
//                                                       onChange={handleEmotionPointChange}/> 몰입감</label>
//                                         <label><input type="checkbox" name="tensionPoint"
//                                                       checked={emotionPoints.tensionPoint}
//                                                       onChange={handleEmotionPointChange}/> 긴장감</label>
//                                     </div>
//                                 </div>
//                             </div>
//                             <button type="submit">
//                                 {editingReviewId ? '리뷰 수정' : '리뷰 작성'}
//                             </button>
//                             {editingReviewId && (
//                                 <button type="button" onClick={() => {
//                                     setEditingReviewId(null);
//                                     setNewReview({content: '', rating: 5});
//                                 }}>
//                                     취소
//                                 </button>
//                             )}
//                         </form>
//                         {reviews.length > 0 ? (
//                             <>
//                                 <div className="sort-tabs">
//                                     <button onClick={() => handleSortChange('latest')}
//                                             className={sortBy === 'latest' ? 'active' : ''}>최신순
//                                     </button>
//                                     <button onClick={() => handleSortChange('likes')}
//                                             className={sortBy === 'likes' ? 'active' : ''}>좋아요순
//                                     </button>
//                                 </div>
//                                 <ul className="review_ul">
//                                     {reviews.map((review) => (
//                                         <li key={review.reviewId} className="review-item">
//                                             {/*{console.log('Review:', review, 'correspondMemNum:', correspondMemNum, 'memRole:', memRole)}*/}
//                                             <span className="reviewWriter">{review.memName}</span>
//                                             <span className="reviewContent">{review.reviewContent}</span>
//                                             <span className="reviewTime">
//                                             {review.modifyDate && review.modifyDate !== review.createDate
//                                                 ? `수정됨: ${review.modifyDate}`
//                                                 : `작성: ${review.createDate}`}
//                                             </span>
//                                             <span className="reviewStar">{review.reviewRating}/5</span>
//                                             <div className="review-points">
//                                                 <div className="attraction-points">
//                                                     매력 포인트:
//                                                     {review.attractionPoints && Object.entries(review.attractionPoints)
//                                                         .filter(([key, value]) => value)
//                                                         .map(([key, value]) => (
//                                                             <span key={key}
//                                                                   className="point-tag">{getAttractionPointLabel(key)}</span>
//                                                         ))}
//                                                 </div>
//                                                 <div className="emotion-points">
//                                                     감정 포인트:
//                                                     {review.emotionPoints && Object.entries(review.emotionPoints)
//                                                         .filter(([key, value]) => value)
//                                                         .map(([key, value]) => (
//                                                             <span key={key}
//                                                                   className="point-tag">{getEmotionPointLabel(key)}</span>
//                                                         ))}
//                                                 </div>
//                                             </div>

//                                             <div className="review_actions">
//                                                 <div className="like_button">
//                                                     <button
//                                                         onClick={() => toggleReviewLike(review.reviewId)}
//                                                     >
//                                                         {reviewLikes[review.reviewId]?.isLike ? '❤️' : '🤍'}
//                                                     </button>
//                                                     <span>({reviewLikes[review.reviewId]?.likeCount || 0})</span>
//                                                 </div>
//                                                 {(correspondMemNum && Number(review.memNum) === Number(correspondMemNum)) && (
//                                                     <button onClick={() => handleEditClick(review)}>수정</button>
//                                                 )}
//                                                 {((memRole === 'ADMIN') || (correspondMemNum && Number(review.memNum) === Number(correspondMemNum))) && (
//                                                     <button
//                                                         onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
//                                                 )}
//                                             </div>
//                                         </li>
//                                     ))}
//                                 </ul>
//                                 <div className="pagination">
//                                     {hasPrevious && (
//                                         <button
//                                             onClick={() => fetchReviews(localStorage.getItem('accessToken'), currentPage - 1)}>
//                                             &lt;
//                                         </button>
//                                     )}
//                                     {pageNumbers && pageNumbers.map(number => (
//                                         <button
//                                             key={number}
//                                             onClick={() => fetchReviews(localStorage.getItem('accessToken'), number)}
//                                             className={number === currentPage ? 'active' : ''}
//                                         >
//                                             {number}
//                                         </button>
//                                     ))}
//                                     {hasNext && (
//                                         <button
//                                             onClick={() => fetchReviews(localStorage.getItem('accessToken'), currentPage + 1)}>
//                                             &gt;
//                                         </button>
//                                     )}
//                                 </div>
//                             </>
//                         ) : (
//                             <p>아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
//                         )}
//                     </div>
//                 )}
//                 {activeTab === 'trailer' && (
//                     <div className="trailer">
//                         {movieDetail.trailers && movieDetail.trailers.length > 0 ? (
//                             <YouTube
//                                 videoId={movieDetail.trailers[0].trailerUrls.split('v=')[1]}
//                                 opts={{
//                                     width: '100%',
//                                     height: '500px',
//                                     playerVars: {
//                                         autoplay: 0,
//                                         rel: 0,
//                                         modestbranding: 1,
//                                         controls: 1,
//                                     },
//                                 }}
//                                 onReady={(event) => {
//                                     event.target.playVideo();
//                                 }}
//                                 onEnd={(event) => {
//                                     event.target.stopVideo();
//                                 }}
//                             />
//                         ) : (
//                             <p>예고편이 없습니다.</p>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }

// export default MovieTab;