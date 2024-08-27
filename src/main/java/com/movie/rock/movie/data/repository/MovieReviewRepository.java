package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieReviewRepository extends JpaRepository<MovieReviewEntity, Long> {

    // 회원이 영화에 이미 리뷰를 작성했는지 확인
    boolean existsByMemberMemNumAndMovieMovieId(Long memNum, Long movieId);

    // 특정 영화 리뷰와 회원 정보를 포함하여 리뷰 조회
    @Query("SELECT r FROM MovieReviewEntity r " +
       "JOIN FETCH r.member m " +
       "JOIN FETCH r.movie b " +
            "WHERE b.movieId = :movieId AND r.reviewId = :reviewId")
    Optional<MovieReviewEntity> findByIdWithMemberAndMovie(@Param("movieId") Long movieId,
                                                           @Param("reviewId") Long reviewId);

    /// 작성자 본인 리뷰 가져오기
    @Query("SELECT c FROM MovieReviewEntity c " +
       "JOIN FETCH c.member m " +
       "JOIN FETCH c.movie b " +
            "WHERE b.movieId = :movieId AND c.member.memNum = :memNum")
    Optional<MovieReviewEntity> findByMovieIdAndMemberNum(@Param("movieId") Long movieId,
                                                          @Param("memNum") Long memNum);

//    //시간순으로 정렬
//    Page<MovieReviewEntity> findByMovieMovieIdOrderByCreateDateDesc(Long movieId, Pageable pageable);
//
//    //추천순으로 정렬
//    Page<MovieReviewEntity> findByMovieMovieIdOrderByLikesCountDesc(Long movieId, Pageable pageable);

    //추천순으로 정렬
    @Query("SELECT r, COUNT(rl) as likesCount " +
             "FROM MovieReviewEntity r " +
        "LEFT JOIN ReviewLikesEntity rl " +
               "ON r.reviewId = rl.review.reviewId " +
            "WHERE r.movie.movieId = :movieId AND r.member.memNum != :memNum " +
         "GROUP BY r.reviewId " +
         "ORDER BY likesCount DESC, r.createDate DESC")
    List<Object[]> findByMovieIdWithLikesCountOrderByLikesCountDesc(
            @Param("movieId") Long movieId,
            @Param("memNum") Long memNum
    );

    //시간순으로 정렬
    @Query("SELECT r, COUNT(rl) as likesCount " +
             "FROM MovieReviewEntity r " +
        "LEFT JOIN ReviewLikesEntity rl ON r.reviewId = rl.review.reviewId " +
            "WHERE r.movie.movieId = :movieId AND r.member.memNum != :memNum " +
         "GROUP BY r.reviewId " +
         "ORDER BY r.createDate DESC, likesCount DESC")
    List<Object[]> findByMovieIdWithLikesCountOrderByCreateDateDesc(
            @Param("movieId") Long movieId,
            @Param("memNum") Long memNum
    );

    //리뷰 전체 갯수
    Long countByMovieMovieId(Long movieId);

    //영화 평점 평균
    @Query("SELECT AVG(r.reviewRating) FROM MovieReviewEntity r " +
            "WHERE r.movie.movieId = :movieId")
    Double getAverageRatingForMovie(@Param("movieId") Long movieId);

    List<MovieReviewEntity> findByMovieMovieId(Long movieId);

    Optional<MovieReviewEntity> findByMovieMovieIdAndMemberMemNum(Long movieId, Long memNum);

    // 작성자 본인 리뷰 가져오기
    @Query("SELECT r, m, mp, e, a " +
            "FROM MovieReviewEntity r " +
            "JOIN r.movie m " +
            "LEFT JOIN m.poster mp " +
            "JOIN r.member mem " +
            "LEFT JOIN r.reviewEmotionPoints e " +
            "LEFT JOIN r.reviewAttractionPoints a " +
            "WHERE mem.memNum = :memNum " +
            "AND (mp.posters.mainPoster = true OR mp IS NULL OR NOT EXISTS(SELECT 1 FROM MoviePostersEntity mp2 WHERE mp2.movie = m AND mp2.posters.mainPoster = true)) " +
            "ORDER BY r.createDate DESC")
    Page<Object[]> findByMovieReviewMyPage(@Param("memNum") Long memNum, Pageable pageable);


    //작성자 리뷰 삭제
    Optional<MovieReviewEntity> findByReviewIdAndMember_MemNum(@Param("reviewId") Long reviewId, @Param("memNum") Long memNum);





}

