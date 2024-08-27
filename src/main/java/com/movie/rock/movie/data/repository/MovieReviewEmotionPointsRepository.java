package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieReviewEmotionPointsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieReviewEmotionPointsRepository extends JpaRepository<MovieReviewEmotionPointsEntity, Long> {
//    @Query("SELECT new com.movie.rock.movie.data.response.MovieReviewEmotionPointsRatioResponseDTO(" +
//            "CAST(SUM (CASE WHEN r.stressReliefPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.scaryPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.realityPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.immersionPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.tensionPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE))" +
//            "FROM MovieReviewEmotionPointsEntity r WHERE r.review.movie.movieId = :movieId")
//    MovieReviewEmotionPointsRatioResponseDTO getEmotionPointRatios(Long movieId);

    Optional<MovieReviewEmotionPointsEntity> findByReviewId(Long reviewId);
}
