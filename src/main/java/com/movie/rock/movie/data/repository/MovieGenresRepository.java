package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieGenresEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieGenresRepository extends JpaRepository<MovieGenresEntity, Long> {
    @Modifying
    @Query("DELETE FROM MovieGenresEntity mg WHERE mg.movie.movieId = :movieId")
    void deleteByMovieId(@Param("movieId") Long movieId);
}
