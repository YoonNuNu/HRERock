import React, { useState } from 'react';
import styled from 'styled-components';
import CheckboxGroup from './CheckboxGroup';
import ReviewLists from './ReviewLists';
import CharmingGraph from './CharmingGraph';
import { useEffect } from 'react';
import axios from 'axios';


//MovieReview -----------------------------
const MovieReview = ({ movieId, movieDetail, memRole, correspondMemName, correspondMemNum }) => {

    // 변수 설정
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [newReview, setNewReview] = useState({ content: '', rating: 5 });
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [charmingPoint, setCharmingPoint] = useState([]);
    const [emotionalPoint, setEmotionalPoint] = useState([]);
    const [attractionPoints, setAttractionPoints] = useState({
        directingPoint: false,
        actingPoint: false,
        visualPoint: false,
        storyPoint: false,
        ostPoint: false
    });
    const [emotionPoints, setEmotionPoints] = useState({
        stressReliefPoint: false,
        scaryPoint: false,
        realityPoint: false,
        immersionPoint: false,
        tensionPoint: false
    });

    const [reviewLikes, setReviewLikes] = useState({});
    const [sortBy, setSortBy] = useState('likes');

    const [graphUpdateTrigger, setGraphUpdateTrigger] = useState(0);

    // movieId, sortBy에 따라 랜더링
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            const validMovieId = typeof movieId === 'object' && movieId.movieId ? movieId.movieId : movieId;

            if (validMovieId) {
                fetchReviews(token, 1).then(() => {
                    console.log("useEffect EditingReviewId after fetch:", editingReviewId);
                });
                fetchInitialLikeStatuses(token);

                console.log("useEffect movieId:", movieId.movieId, "Type of movieId:", typeof movieId.movieId);
            } else {
                console.error("movieId가 유효하지 않습니다.", movieId);
            }
        }
    }, [movieId, sortBy]);


    // 정렬 방식을 변경하는 함수
    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        // fetchReviews(localStorage.getItem('accessToken'), 1, newSortBy);
    };


    // 리뷰 불러오기 
    const fetchReviews = async (token, page = 1) => {
        try {
            // movie id 정보가 객체일 경우 string을 추출
            const validMovieId = typeof movieId === 'object' && movieId.movieId ? movieId.movieId : movieId;
            const response = await axios.get(`/user/movies/detail/${validMovieId}/reviews?page=${page}&sortBy=${sortBy}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            const data = response.data;
            // console.log('Fetched review data:', response.data);
            setReviews(response.data.reviews);
            setTotalReviews(response.data.totalReviews);
            setAverageRating(response.data.averageRating);
            setCurrentPage(response.data.currentPage);
            setPageNumbers(response.data.pageNumbers);
            setHasPrevious(response.data.hasPrevious);
            setHasNext(response.data.hasNext);
        } catch (error) {
            // console.error('리뷰를 가져오는 중 오류 발생:', error);
            setError('리뷰를 불러오는데 실패했습니다.');
        }
    };

    // 리뷰 수정 버튼
    const handleEditClick = (review) => {
        setNewReview({
            content: review.reviewContent,
            rating: review.reviewRating
        });
        setEditingReviewId(review.reviewId);
    };

    // 리뷰 매력 포인트 구성
    const handleAttractionPointChange = (e) => {
        setAttractionPoints({ ...attractionPoints, [e.target.name]: e.target.checked });
    };

    // 리뷰 감정 포인트 구성
    const handleEmotionPointChange = (e) => {
        setEmotionPoints({ ...emotionPoints, [e.target.name]: e.target.checked });
    };


    // 매력 포인트 label
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

    // 감정 포인트 label
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

    // 리뷰 submit 관리
    const handleSubmitReview = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const validMovieId = typeof movieId === 'object' && movieId.movieId ? movieId.movieId : movieId;
            const reviewData = {
                reviewContent: newReview.content,
                reviewRating: newReview.rating,
                attractionPoints: attractionPoints,
                emotionPoints: emotionPoints
            };

            if (editingReviewId) {
                await axios.put(`/user/movies/detail/${validMovieId}/reviews/${editingReviewId}`, reviewData, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                setEditingReviewId(null);
            } else {
                await axios.post(`/user/movies/detail/${validMovieId}/reviews`, reviewData, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
            }
            setNewReview({content: '', rating: 5});
            setAttractionPoints({directingPoint: false, actingPoint: false, visualPoint: false, storyPoint: false, ostPoint: false});
            setEmotionPoints({stressReliefPoint: false, scaryPoint: false, realityPoint: false, immersionPoint: false, tensionPoint: false});
            await fetchReviews(token, currentPage);
            alert(editingReviewId ? '리뷰가 수정되었습니다.' : '리뷰가 작성되었습니다.');

            setGraphUpdateTrigger(prev => prev + 1);
        } catch (error) {
            if (error.response && error.response.data) {

                console.error(error.response.data);

                alert("이미 리뷰를 작성했습니다. 수정 버튼을 누르고 수정해주세요");
            } else {
                alert('리뷰 작성/수정에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };


    // 리뷰 글자 수 유효성 검사
    const handleValidationAndSubmit = () => {
        if (newReview.content.length >= 4 && newReview.content.length <= 50) {
            setIsValid(true); // 유효한 상태
            handleSubmitReview(); // 제출 처리
        } else {
            alert("리뷰는 4자 이상, 50자 이하로 쓰셔야 합니다");
            setIsValid(false); // 유효하지 않은 상태
        }
    };

    // 리뷰 수정 버튼 클릭시 모달창 띄우기
    const handleEditButtonClick = (review) => {
        handleEditClick(review); // 리뷰 수정 핸들러 호출
        setOpenReviewModal(true);
    };

    // 리뷰 delete 관리
    const handleDeleteReview = async (reviewId) => {
        const token = localStorage.getItem('accessToken');
        const validMovieId = typeof movieId === 'object' && movieId.movieId ? movieId.movieId : movieId;
        try {
            const response = await axios.delete(`/user/movies/detail/${validMovieId}/reviews/${reviewId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const { currentPage: newPage, totalReviews: newTotalReviews } = response.data;

            //즉시 상태 업데이트
            setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
            setTotalReviews(newTotalReviews);

            // 현재 페이지의 리뷰 수 계산
            const currentPageReviewCount = reviews.length - 1;

            // 삭제 후 페이지 결정
            let pageToFetch;
            if (currentPageReviewCount === 1 && currentPage > 1) {
                // 현재 페이지의 마지막 리뷰를 삭제한 경우, 이전 페이지로 이동
                pageToFetch = currentPage - 1;
            } else {
                pageToFetch = currentPage; // 그 외의 경우, 현재 페이지 유지
            }
            setCurrentPage(pageToFetch);
            await fetchReviews(token, pageToFetch);
            setEditingReviewId(null); // 삭제 후 편집 ID 초기화
            alert('리뷰가 삭제되었습니다.');
            setGraphUpdateTrigger(prev => prev + 1);
        } catch (error) {
            console.error('리뷰 삭제 중 오류 발생:', error);
            alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };


    // 리뷰 좋아요 상태 확인
    const fetchInitialLikeStatuses = async (token) => {
        const validMovieId = movieId.movieId;

        try {
            const response = await axios.get(`/user/movies/detail/${validMovieId}/reviews/likes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const likeStatusArray = response.data; // [{reviewId, memNum, likeCount, like}]
            const initialLikes = {};
            console.log("fetchInitialLikeStatuses Like Status:", response.data);

            // 배열을 순회하며 상태를 초기화합니다.
            likeStatusArray.forEach(status => {
                initialLikes[status.reviewId] = {
                    isLike: status.like,
                    likeCount: status.likeCount
                };
            });

            setReviewLikes(initialLikes);
        } catch (error) {
            console.error('초기 좋아요 상태를 가져오는 중 오류 발생:', error);
            setError('좋아요 상태를 불러오는데 실패했습니다.');
        }
    };

    // 리뷰 좋아요 버튼
    const toggleReviewLike = async (reviewId) => {
        const validMovieId = movieId.movieId;
        const token = localStorage.getItem('accessToken');
        if (!token || !reviewId) {
            console.error('AccessToken 또는 ReviewId가 없습니다');
            return;
        }
        try {
            const currentLikeStatus = reviewLikes[reviewId] || { isLike: false, likeCount: 0 };
            const url = `/user/movies/detail/${validMovieId}/reviews/${reviewId}/likes`;
            let response;
            if (currentLikeStatus.isLike) {
                response = await axios.delete(url, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    data: { movieId, reviewId }
                });
            } else {
                response = await axios.post(url, { movieId, reviewId }, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
            }
            const newLikeStatus = {
                isLike: response.data.like,
                likeCount: response.data.likeCount
            };
            setReviewLikes(prev => ({
                ...prev,
                [reviewId]: newLikeStatus
            }));
        } catch (error) {
            console.error('좋아요 토글 중 오류 발생:', error);
            alert('댓글 좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    //HTML
    return (
        <>

            {/*그래프 자리*/}
            {/* 그래프를 표시할 자리 */}
            <ChartWrap>

                <CharmingGraph
                    movieId={movieId}
                    updateTrigger={graphUpdateTrigger}
                />

            </ChartWrap>

            {/* 리뷰 창 */}
            <WholeReviewConstainer>

                <ReviewInfoBox>
                    <div className="infoText">
                        <BoxText>🎁   관람에 대한 이야기를 남겨주세요&nbsp;&nbsp;|&nbsp;&nbsp;✎ 현재 작성자&nbsp;({totalReviews})</BoxText>

                        <p className="average">
                            <ReviewCount>평균 평점 [ {averageRating.toFixed(1)} / 5 ]</ReviewCount>
                            <ReviewCounts>재미있게 보셨나요? 영화의 어떤 점이 좋았는지 이야기해주세요.</ReviewCounts>
                        </p>
                    </div>
                    <OpenReviewBtn
                        onClick={() => {
                            setOpenReviewModal(!openReviewModal);
                        }}
                    >
                        &nbsp;✎ 관람평 쓰기&nbsp;
                    </OpenReviewBtn>
                </ReviewInfoBox>
                {openReviewModal && (
                    <ReviewContainer>
                        <ReviewModalTitle>
                            <ReviewModalTitle>Review&nbsp;&nbsp;

                            </ReviewModalTitle>
                            <CloseReviewBtn
                                onClick={() => {
                                    setOpenReviewModal(false);
                                }}
                            >
                                X
                            </CloseReviewBtn>
                        </ReviewModalTitle>
                        <ReviewModalContentBox>
                            <ReviewModalInfoBox>
                                <ReviewTitleText>
                                    &nbsp; &nbsp;당신만의 관람 포인트 선택해주세요!&nbsp;&nbsp;
                                </ReviewTitleText>
                                <SelectAgainText>
                                    중복선택
                                    <span className="SelectAgainText">도 가능합니다.</span>
                                </SelectAgainText>

                                {/*평점 등록*/}
                                <SelectAgainTexts>
                                    리뷰 작성 시,<span className="SelectAgainTexts">평점</span>을 등록해주세요
                                </SelectAgainTexts>

                            </ReviewModalInfoBox>

                            {/* <form> */}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmitReview();
                            }}>
                                {/*체크박스 컨테이너*/}
                                <CheckboxContainer>
                                    <CheckboxWrap>
                                        <CheckboxGroup
                                            className="CheckboxGroup"
                                            values={charmingPoint}
                                            onChange={setCharmingPoint}>
                                            <SelectPointTitle>❤️ 매력포인트</SelectPointTitle>
                                            {/* {CHARMING_DATA_LIST.map(charmingList => {
                                                return (
                                                    <label key={charmingList.id}>

                                                        <Checkbox
                                                            className="Checkbox"
                                                            name={charmingList.point}
                                                            value={charmingList.title}
                                                            checked={attractionPoints[charmingList.point]}
                                                            onChange={handleAttractionPointChange}
                                                        >
                                                            {charmingList.title}
                                                        </Checkbox>
                                                    </label>
                                                );
                                            })} */}
                                        </CheckboxGroup>
                                        <div className="points-checkboxes">
                                            <label><input type="checkbox" name="directingPoint"
                                                          checked={attractionPoints.directingPoint}
                                                          onChange={handleAttractionPointChange} /> 감독연출</label>
                                            <label><input type="checkbox" name="actingPoint"
                                                          checked={attractionPoints.actingPoint}
                                                          onChange={handleAttractionPointChange} /> 배우연기</label>
                                            <label><input type="checkbox" name="visualPoint"
                                                          checked={attractionPoints.visualPoint}
                                                          onChange={handleAttractionPointChange} /> 영상미</label>
                                            <label><input type="checkbox" name="storyPoint"
                                                          checked={attractionPoints.storyPoint}
                                                          onChange={handleAttractionPointChange} /> 스토리</label>
                                            <label><input type="checkbox" name="ostPoint"
                                                          checked={attractionPoints.ostPoint}
                                                          onChange={handleAttractionPointChange} /> OST</label>
                                        </div>

                                    </CheckboxWrap>
                                    <br />


                                    <CheckboxWrap>
                                        <CheckboxGroup
                                            values={emotionalPoint}
                                            onChange={setEmotionalPoint}
                                        >
                                            <SelectPointTitle>😳 감정 포인트</SelectPointTitle>
                                            {/* {EMOTIOMAL_DATA_LIST.map(emotionalList => {
                                                return (
                                                    <label>
                                                        <Checkbox
                                                            key={emotionalList.id}
                                                            value={emotionalList.title}
                                                            name = {emotionalList.point}
                                                            checked={emotionPoints[emotionalList.point]}
                                                            onChange={handleEmotionPointChange}

                                                        >
                                                            {emotionalList.title}
                                                        </Checkbox>

                                                    </label>
                                                );
                                            })} */}
                                        </CheckboxGroup>
                                        <div className="points-checkboxes">
                                            <label><input type="checkbox" name="stressReliefPoint"
                                                          checked={emotionPoints.stressReliefPoint}
                                                          onChange={handleEmotionPointChange} /> 스트레스 해소</label>
                                            <label><input type="checkbox" name="scaryPoint"
                                                          checked={emotionPoints.scaryPoint}
                                                          onChange={handleEmotionPointChange} /> 무서움</label>
                                            <label><input type="checkbox" name="realityPoint"
                                                          checked={emotionPoints.realityPoint}
                                                          onChange={handleEmotionPointChange} /> 현실감</label>
                                            <label><input type="checkbox" name="immersionPoint"
                                                          checked={emotionPoints.immersionPoint}
                                                          onChange={handleEmotionPointChange} /> 몰입감</label>
                                            <label><input type="checkbox" name="tensionPoint"
                                                          checked={emotionPoints.tensionPoint}
                                                          onChange={handleEmotionPointChange} /> 긴장감</label>
                                        </div>

                                    </CheckboxWrap>
                                </CheckboxContainer>

                                <WriteReview>

                                    <ReviewInput
                                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}

                                        //  리뷰 글자 수가 4~50자 이어야 작성 가능
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();  // Enter 눌렀을 때 기본 제출 방지
                                                handleValidationAndSubmit();
                                            }
                                        }}
                                        type="text"
                                        value={newReview.content}
                                        placeholder=" 리뷰 작성 (50자 이내로 작성) "
                                    />

                                    {/* 평점 스핀박스 */}
                                    <InputNumber
                                        type="number"
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                        min="1"
                                        max="5"
                                        required
                                    />

                                    {/* 첫 리뷰 작성시 등록 버튼, 리뷰 작성 후는 수정 버튼 */}
                                    {editingReviewId ? (
                                        <EditBtn type='submit'  >
                                            수정
                                        </EditBtn>
                                    ) : (
                                        <UploadBtn type='submit' >
                                            등록
                                        </UploadBtn>
                                    )}

                                </WriteReview>
                            </form>


                        </ReviewModalContentBox>
                    </ReviewContainer>
                )}

                {/* 리뷰 출력 */}
                {reviews.length > 0 ? (
                    <>

                        <OnlyReviewContainer>
                            <ReviewArrayBtnWrap>
                                <ReviewTitle> &#62; Review</ReviewTitle>
                                <ArrayBtn onClick={() => handleSortChange('latest')}
                                          className={sortBy === 'latest' ? 'active' : ''}>최신순
                                </ArrayBtn>
                                <ArrayBtn onClick={() => handleSortChange('likes')}
                                          className={sortBy === 'likes' ? 'active' : ''}>좋아요순
                                </ArrayBtn>
                            </ReviewArrayBtnWrap>
                            <ReviewCommentContainer>
                                {reviews.map((review) => {

                                    return (
                                        <>
                                            {/* 리뷰 리스트 */}
                                            <ReviewLists
                                                key={review.id}
                                                userName={review.memName}
                                                userReview={review.reviewContent}
                                                reviewRating={review.reviewRating}
                                                reviewTime={review.modifyDate && review.modifyDate !== review.createDate
                                                    ? `수정됨: ${review.modifyDate}`
                                                    : `작성: ${review.createDate}`}

                                                charmingPoint={review.attractionPoints && Object.entries(review.attractionPoints)
                                                    .filter(([key, value]) => value)
                                                    .map(([key, value]) => (
                                                        getAttractionPointLabel(key)
                                                    ))}

                                                emotionalPoint={review.emotionPoints && Object.entries(review.emotionPoints)
                                                    .filter(([key, value]) => value)
                                                    .map(([key, value]) => (
                                                        getEmotionPointLabel(key)
                                                    ))}

                                                // 리뷰 수정 버튼
                                                editButton={(correspondMemNum && Number(review.memNum) === Number(correspondMemNum)) && (
                                                    <button
                                                        onClick={() =>
                                                            handleEditButtonClick(review)
                                                        }
                                                    >수정</button>
                                                )}

                                                // 리뷰 삭제 버튼
                                                deleteButton={((memRole === 'ADMIN') || (correspondMemNum && Number(review.memNum) === Number(correspondMemNum))) && (
                                                    <button
                                                        onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
                                                )}

                                                // 리뷰 좋아요 버튼
                                                reviewLike={<button
                                                    onClick={() => toggleReviewLike(review.reviewId)}
                                                >
                                                    {reviewLikes[review.reviewId]?.isLike ? '❤️' : '🤍'}
                                                    <span>({reviewLikes[review.reviewId]?.likeCount || 0})</span>
                                                </button>}

                                            />

                                        </>
                                    );
                                })}
                            </ReviewCommentContainer>
                        </OnlyReviewContainer>
                        <ReviewPagination>
                            {hasPrevious && (
                                <button
                                    onClick={() => fetchReviews(localStorage.getItem('accessToken'), currentPage - 1)}>
                                    {"<"}
                                </button>
                            )}
                            {pageNumbers && pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => fetchReviews(localStorage.getItem('accessToken'), number)}
                                    className={number === currentPage ? 'active' : ''}
                                >
                                    {number}
                                </button>
                            ))}
                            {hasNext && (
                                <button
                                    onClick={() => fetchReviews(localStorage.getItem('accessToken'), currentPage + 1)}>
                                    {">"}
                                </button>
                            )}
                        </ReviewPagination>
                    </>
                ) : (
                    <div style={{ color: 'white' }}>아직 리뷰가 없습니다. 첫번째 리뷰를 작성해보세요</div>
                )}
            </WholeReviewConstainer >
        </>





    );
};

//STYLE -----------------------------------


//그래프 전체 박스 - 그래프 자리
const ChartWrap = styled.div`
    //사이즈
    width: 100%;
    // height: 500px;
    margin: 0 auto;
    margin-top: 80px;
    padding-top: 20px;
    margin-bottom: 40px;
    display: flex;
    border-radius: 12px;
    flex-wrap: wrap;
    justify-content: center;
    //디자인
    //background-color: rgba(255, 255, 255, 0.1);
    background-color:#fff;
`;

//리뷰 박스
const OnlyReviewContainer = styled.div`
    padding: 20px;
`;

//모든 체크 박스
const CheckboxContainer = styled.div`
    margin-left: 60px;
    margin: 0 auto;


    input{
        width: 18px;
        height: 18px;
        margin-right: 5px;
        font-size: 16px;
        text-align: center;
        align-items: center;

    }
`;

//스핀박스
const InputNumber = styled.input`
    width: 100px;
    height: 60px;
    border: none;
    border-bottom: 1px solid #000;
    margin-right: 20px;
    margin-top: 20px;
    background-color: transparent;
    outline: none;
    text-align: left;
    color: #000;
    font-size: 16px;
    font-weight: 600;

    &:hover{
        cursor: pointer;
    }
`;

//체크박스 감싸는 전체 박스
const CheckboxWrap = styled.div`
    display: flex;
    //width: 600px;
    //height: 80px;
    text-indent: 10px;
    cursor: pointer;
    //디자인
    padding-bottom: 10px;
`;


//등록버튼
const UploadBtn = styled.button`
    // 디자인
    width: 100px;
    height: 60px;
    background-color: #1351f9;
    margin-right: 20px;
    margin-top: 20px;
    border-radius: 12px;

    // 폰트스타일
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    z-index: 1000;
`;

//수정버튼
const EditBtn = styled.button`
    // 디자인
    width: 100px;
    height: 60px;
    background-color: #ff27a3;
    margin-right: 20px;
    margin-top: 20px;
    border-radius: 12px;

    // 폰트스타일
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    z-index: 1000;
`;



//리뷰작성 박스
const WriteReview = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;

`;

//리뷰
const ReviewInput = styled.input`
    border: transparent;
    border-radius: 12px;
    width: 80%;
    line-height: 100px;
    margin-right: 20px;
    font-size: 17px;

    &:focus,
    &:hover {
        border: 2px solid #1351f9;
        outline: none;
    }
`;

const ReviewArrayBtnWrap = styled.div`
    display: flex;

`

// 리뷰 정렬 버튼
const ArrayBtn = styled.button`
    width: 80px;
    // heigh: 55px;
    border: 2px solid #1351f9;
    background: #1351f9;
    margin: 30px 10px 10px 10px;
    border-radius: 12px;
    color: white;

    &:focus,
    &:hover {
        background: white;
        border: 2px solid #1351f9;
        color: #1351f9;
    }

`
const ReviewTitle = styled.div`
    color: #9971ff;
    font-size: 18px;
    font-weight: 600;
    margin: 30px 10px 10px 10px;
`;

const ReviewCommentContainer = styled.div`
    border-top: 2px solid #f1f1f3;
    padding: 20px 20px 0 0px;
    margin: 20px 0 10px 20px;
    width: 100%;
    //   max-height: 700px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    display: flex;
    align-items: center;
`;

const CloseReviewBtn = styled.button`
    background-color:#ff27a3;
    border: 1px solid #ff27a3;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    font-size: 18px;
    font-weight: 600;
    color: #1351f9;
    margin-top: 8px;
`;

const ReviewModalContentBox = styled.div`
    padding: 20px;
`;


//당신만의 관람 포인트 선택해주세요!
const ReviewModalInfoBox = styled.header`
    //display: flex;
    //justify-content: left;
    text-align: left;
    padding: 30px 0;
`;

const ReviewModalTitle = styled.div`
    background-color: #1351f9;
    display: flex;
    justify-content: space-between;
    color: #ff27a3;
    font-size: 25px;
    font-weight: 600;
    padding: 6px 10px;

    .ReviewModalTitle{
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        text-indent: 10px;
        color: #fff;
    }
`;

const ReviewTitleText = styled.p`
    font-size: 25px;
    font-weight: 600;
    color: #000;
    margin-bottom: 5px;
    display: inline-block;
`;

//평점선택
const SelectAgainTexts = styled.span`
    color: #000;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    margin-left: 20px;

    .SelectAgainTexts{
        color: #ff27a3;
        font-size: 18px;
        font-weight: 500;
        text-indent: 2px;
    }
`;

//중복선택
const SelectAgainText = styled.span`
    color: #1351f9;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    text-indent: 20px;


    .SelectAgainText{
        color: #000;
        font-size: 18px;
        font-weight: 500;
        text-indent: 2px;

    }
`;

//매력,감정포인트-체크타이틀
const SelectPointTitle = styled.p`
    color: #000;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    text-indent: 16px;
`;

const ReviewContainer = styled.div`

    background-color: #f1f1f3;
    border-radius: 10px;
    margin-top: 20px;
    margin-bottom: 60px;

    /* transition-duration: 1ms; */
`;
const OpenReviewBtn = styled.button`
    width: 120px;
    height: 55px;

    font-size: 16px;
    font-weight: 500;
    background-color: #1351f9;
    border: none;
    border-radius: 12px;
    color: #fff;
    transition: all 600ms cubic-bezier(0.86, 0, 0.07, 1);
    cursor: pointer;


    &:hover {
        color: #1351f9;
        font-weight: 600;
        border: 2px solid #1351f9;
        background-color: #fff;
    }
`;

const ReviewInfoBox = styled.div`
    background-color: #f1f1f3;
    display: flex;
    align-items: center;

    padding: 35px;
    border-radius: 10px;
    -webkit-box-shadow: 17px 23px 25px 5px rgba(0, 0, 0, 0.19);
    box-shadow: 17px 23px 25px 5px rgba(0, 0, 0, 0.19);
    font-weight: 600;
    transition: 0.25s;

    //평균 평점
    .average{
        width: 1000px;
        height: 84px;
        vertical-align: middle;
        padding-left: 30px;
        text-align: left;
        color: #666;
        line-height: 27px;
    }
`;
const WholeReviewConstainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    //padding: 10px;
`;


// {/*01.현재 작성자*/ }
const BoxText = styled.p`
    font-size: 20px;
    text-align: center;
    color: #000;
    font-weight: 600;
    display: flex;
    justify-content: left;
    margin-bottom: 20px;
`;

const ReviewCount = styled.p`
    font-size: 17px;
    color: #fff;
    font-weight: 500;
    width: 155px;
    background-color: #ff27a3;
    text-indent: 10px;
`;

const ReviewCounts = styled.p`
    font-size: 17px;
    color: #666;
    font-weight: 600;
`;

// 리뷰 차트 이미지
const ReviewChartImg = styled.img`

    width: 100%;
`

// 리뷰 pagination
const ReviewPagination = styled.div`
    // border: 1px solid red;

    button{
        width: 40px;
        height: 40px;
        font-size: 1rem;
        background: white;
        margin: 10px;
        border: 2px solid #1351f9;
        border-radius: 50%;
        color: #1351f9;
        font-weight: 500;

        &:active,
        &:hover{
            background: #1351f9;
            color: white;
            font-weight: 800;
        }
    }
`

export default MovieReview;
