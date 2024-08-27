package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieActorsEntity;
import com.movie.rock.movie.data.entity.MovieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieActorsRepository extends JpaRepository<MovieActorsEntity, Long> {
    // 단일 movieId로 검색하는 경우
//    List<MovieActorsEntity> findByMovieMovieId(Long movieId);

    // 여러 movieId로 검색하는 경우 (In 연산자 사용)
//    List<MovieActorsEntity> findByMovieMovieIdIn(Collection<Long> movieIds);

    @Modifying
    @Query("DELETE FROM MovieActorsEntity ma " +
            "WHERE ma.movie.movieId = :movieId")
    void deleteByMovieId(@Param("movieId") Long movieId);
}
