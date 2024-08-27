package com.movie.rock.admin.data;


import com.movie.rock.movie.data.entity.MovieEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminMovieListRepository extends JpaRepository<MovieEntity,Long> {

    //통합검색
    @Query(value = "SELECT DISTINCT m FROM MovieEntity m " +
                         "LEFT JOIN m.genres mg " +
                                "ON m.movieId = mg.movie.movieId " +
                         "LEFT JOIN mg.genre g " +
                                "ON g.genreId = mg.genre.genreId " +
                         "LEFT JOIN m.movieDirectors md " +
                                "ON m.movieId = md.movie.movieId " +
                         "LEFT JOIN md.director d " +
                                "ON d.directorId = md.director.directorId " +
                             "WHERE (LOWER(m.movieTitle) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR :searchTerm = '') " +
                                "OR (LOWER(g.genreName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR :searchTerm = '') " +
                                "OR (LOWER(d.directorName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR :searchTerm = '')",
               countQuery = "SELECT COUNT(DISTINCT m) FROM MovieEntity m " +
                         "LEFT JOIN m.genres mg " +
                                "ON m.movieId = mg.movie.movieId " +
                         "LEFT JOIN mg.genre g " +
                                "ON g.genreId = mg.genre.genreId " +
                         "LEFT JOIN m.movieDirectors md " +
                                "ON m.movieId = md.movie.movieId " +
                         "LEFT JOIN md.director d " +
                                "ON d.directorId = md.director.directorId " +
                             "WHERE (LOWER(m.movieTitle) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR :searchTerm = '') " +
                                "OR (LOWER(g.genreName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR :searchTerm = '') " +
                                "OR (LOWER(d.directorName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR :searchTerm = '')")
    Page<MovieEntity> findByAllSearch( @Param("searchTerm") String searchTerm, Pageable pageable);
}
