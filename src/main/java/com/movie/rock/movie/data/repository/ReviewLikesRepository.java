package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieFavorEntity;
import com.movie.rock.movie.data.entity.ReviewLikesEntity;
import com.movie.rock.movie.data.pk.ReviewLikesPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewLikesRepository extends JpaRepository<ReviewLikesEntity, ReviewLikesPK> {

    // 특정 리뷰의 좋아요 수 조회
    @Query("SELECT COUNT(rl) FROM ReviewLikesEntity rl WHERE rl.id.reviewId = :reviewId")
    int countLikesByReviewId(@Param("reviewId") Long reviewId);

    // 특정 사용자가 특정 리뷰에 좋아요를 눌렀는지 확인
    boolean existsByReviewReviewIdAndMemberMemNum(Long reviewId, Long memNum);

    // 특정 사용자의 특정 리뷰에 대한 좋아요 엔티티 조회
    Optional<ReviewLikesEntity> findByReviewReviewIdAndMemberMemNum(Long reviewId, Long memNum);

    // 개인 좋아요 삭제
    void deleteByReviewReviewIdAndMemberMemNum(Long reviewId, Long memNum);

    //리뷰 삭제시 전체 좋아요 삭제
    void deleteByReviewReviewId(Long reviewId);

    //회원 찜 리스트
    List<ReviewLikesEntity> findByMemberMemNum(Long memNum);
}
