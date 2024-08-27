package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieSearchRepository extends JpaRepository<MovieEntity, Long> {
    @Query("SELECT DISTINCT m FROM MovieEntity m " +
                 "LEFT JOIN m.genres mg " +
                        "ON m.movieId = mg.movie.movieId " +
                 "LEFT JOIN mg.genre g " +
                        "ON g.genreId = mg.genre.genreId " +
                 "LEFT JOIN m.movieDirectors md " +
                        "ON m.movieId = md.movie.movieId " +
                 "LEFT JOIN md.director d " +
                        "ON d.directorId = md.director.directorId " +
                 "LEFT JOIN m.movieActors ma " +
                        "ON m.movieId = ma.movie.movieId " +
                 "LEFT JOIN ma.actor a " +
                        "ON a.actorId = ma.actor.actorId " +
                     "WHERE (LOWER(m.movieTitle) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
                        "OR LOWER(g.genreName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
                        "OR LOWER(a.actorName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
                        "OR LOWER(d.directorName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<MovieEntity> searchMovies(@Param("searchTerm") String searchTerm,
                                   Pageable pageable
    );
}
