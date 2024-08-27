package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieWatchHistoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieWatchHistoryRepository extends JpaRepository<MovieWatchHistoryEntity, Long> {
    //이어보기 목록
//    @Query("SELECT DISTINCT mwh FROM MovieWatchHistoryEntity mwh " +
//            "JOIN FETCH mwh.movie m " +
//            "LEFT JOIN FETCH m.poster p " +
//            "ON p.movie.movieId = m.movieId " +
//            "WHERE mwh.member.memNum = :memNum AND mwh.watchTime < mwh.totalDuration " +
//            "ORDER BY mwh.watchDate DESC")
//    List<MovieWatchHistoryEntity> findUnfinishedByMemNumOrderByDateDesc(@Param("memNum") Long memNum);

    @Query("SELECT DISTINCT mwh FROM MovieWatchHistoryEntity mwh " +
                "JOIN FETCH mwh.movie m " +
           "LEFT JOIN FETCH m.poster p " +
                     "WHERE mwh.member.memNum = :memNum AND mwh.watchTime < mwh.totalDuration " +
                                                       "AND (p IS NULL OR p.posters.mainPoster = true) " +
                  "ORDER BY mwh.watchDate DESC")
    List<MovieWatchHistoryEntity> findUnfinishedByMemNumOrderByDateDesc(@Param("memNum") Long memNum, Pageable pageable);

    //전체 시청기록
    @Query("SELECT DISTINCT mwh FROM MovieWatchHistoryEntity mwh " +
                "JOIN FETCH mwh.movie m " +
           "LEFT JOIN FETCH m.poster p " +
                     "WHERE mwh.member.memNum = :memNum AND (p IS NULL OR p.posters.mainPoster = true) " +
                  "ORDER BY mwh.watchDate DESC")
    List<MovieWatchHistoryEntity> findAllByMemNumOrderByDateDesc(@Param("memNum") Long memNum, Pageable pageable);

    //영화별 시청 기록
    @Query("SELECT mwh FROM MovieWatchHistoryEntity mwh " +
            "WHERE mwh.member.memNum = :memNum AND mwh.movie.movieId = :movieId " +
         "ORDER BY mwh.watchDate DESC")
    Optional<MovieWatchHistoryEntity> findLatestByMemNumAndMovieId(@Param("memNum") Long memNum, @Param("movieId") Long movieId);

    // 마이페이지 전체 시청기록 (Page 반환)
    @Query("SELECT DISTINCT mwh FROM MovieWatchHistoryEntity mwh " +
                "JOIN FETCH mwh.movie m " +
           "LEFT JOIN FETCH m.poster p " +
                     "WHERE mwh.member.memNum = :memNum AND (p IS NULL OR p.posters.mainPoster = true) " +
                  "ORDER BY mwh.watchDate DESC")
    Page<MovieWatchHistoryEntity> findAllByMemNumOrderByDateDescPaged(@Param("memNum") Long memNum, Pageable pageable);
}
