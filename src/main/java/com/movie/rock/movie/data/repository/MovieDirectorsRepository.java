package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieDirectorsEntity;
import com.movie.rock.movie.data.entity.MovieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieDirectorsRepository extends JpaRepository<MovieDirectorsEntity, Long> {
    // 단일 movieId로 검색하는 경우
//    List<MovieDirectorsEntity> findByMovieMovieId(Long movieId);

    // 여러 movieId로 검색하는 경우 (In 연산자 사용)
//    List<MovieDirectorsEntity> findByMovieMovieIdIn(Collection<Long> movieIds);;

    @Modifying
    @Query("DELETE FROM MovieDirectorsEntity md " +
            "WHERE md.movie.movieId = :movieId")
    void deleteByMovieId(@Param("movieId") Long movieId);
}
