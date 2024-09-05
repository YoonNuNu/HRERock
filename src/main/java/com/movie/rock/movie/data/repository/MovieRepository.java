package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<MovieEntity, Long> {

    @Query("SELECT m " +
             "FROM MovieEntity m " +
            "WHERE m.movieId = :movieId")
    Optional<MovieEntity> findByMovieId(@Param("movieId") Long movieId);

    boolean existsByMovieTitle(String movieTitle);

    @Modifying
    @Query("UPDATE MovieEntity m " +
              "SET m.movieTitle = :title " +
            "WHERE m.movieId = :id")
    void updateMovieTitle(@Param("id") Long id, @Param("title") String title);

    @Modifying
    @Query("UPDATE MovieEntity m " +
              "SET m.movieTitle = :title, m.runTime = :runTime, m.openYear = :openYear, m.movieRating = :rating, m.movieDescription = :description " +
            "WHERE m.movieId = :movieId")
    void updateMovieInfo(@Param("movieId") Long movieId,
                         @Param("title") String title,
                         @Param("runTime") int runTime,
                         @Param("openYear") Integer openYear,
                         @Param("rating") String rating,
                         @Param("description") String description);

    @Query("SELECT m FROM MovieEntity m " +
         "ORDER BY m.searchCount DESC")
    Page<MovieEntity> findTopRankMovies(Pageable pageable);
}
