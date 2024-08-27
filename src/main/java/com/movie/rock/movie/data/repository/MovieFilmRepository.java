package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieFilmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface MovieFilmRepository extends JpaRepository<MovieFilmEntity, Long> {

    Optional<MovieFilmEntity> findByMovieMovieId(Long movieId);

    @Modifying
    @Query("UPDATE MovieFilmEntity m SET m.movieFilm = :movieFilm WHERE m.movie.movieId = :movieId")
    int updateMovieFilm(@Param("movieId") Long movieId, @Param("movieFilm") String movieFilm);

    @Modifying
    @Query(value = "INSERT INTO movie_films (movie_id, movie_film) VALUES (:movieId, :movieFilm)", nativeQuery = true)
    int insertMovieFilm(@Param("movieId") Long movieId, @Param("movieFilm") String movieFilm);


//    Optional<MovieFilmEntity> findByMovieMovieId(Long movieId);
}
