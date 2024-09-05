package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieReviewAttractionPointsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MovieReviewAttractionPointsRepository extends JpaRepository<MovieReviewAttractionPointsEntity, Long> {
//    @Query("SELECT new com.movie.rock.movie.data.response.MovieReviewAttractionPointsRatioResponseDTO(" +
//            "CAST(SUM (CASE WHEN r.directingPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.actingPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.visualPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.storyPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE)," +
//            "CAST(SUM (CASE WHEN r.ostPoint = true THEN 1 ELSE 0 END) AS double) / CAST(COUNT (r) AS DOUBLE))" +
//            "FROM MovieReviewAttractionPointsEntity r WHERE r.review.movie.movieId = :movieId")
//    MovieReviewAttractionPointsRatioResponseDTO getAttractionPointRatios(Long movieId);

    Optional<MovieReviewAttractionPointsEntity> findByReviewId(Long reviewId);

    void deleteByReviewId(Long reviewId);
}
