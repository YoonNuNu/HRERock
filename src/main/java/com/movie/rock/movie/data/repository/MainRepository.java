package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.response.MainResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MainRepository extends JpaRepository<MovieEntity, Long> {

    //30일 내에 추가된 영화 있을 시,
    //포스터 중복 제거
    @Query("SELECT new com.movie.rock.movie.data.response.MainResponseDTO(m.movieId, m.movieTitle, m.movieDescription, " +
            "p.posters.posterId, p.posters.posterUrls, p.posters.mainPoster, " +
            "t.trailers.trailerId, t.trailers.trailerUrls, t.trailers.mainTrailer, " +
            "m.createDate, 0.0) " +
             "FROM MovieEntity m " +
        "LEFT JOIN m.poster p " +
               "ON p.movie.movieId = m.movieId " +
        "LEFT JOIN m.trailer t " +
               "ON t.movie.movieId = m.movieId " +
            "WHERE m.createDate > :thirtyDaysAgo " +
              "AND (p.posters.mainPoster = true OR  p.posters IS NULL OR NOT EXISTS(SELECT 1 FROM MoviePostersEntity mp " +
                                                                                    "WHERE mp.movie = m AND mp.posters.mainPoster = true))" +
         "ORDER BY m.createDate DESC")
    List<MainResponseDTO> findRecentMoviesWithin30days(@Param("thirtyDaysAgo") String thirtyDaysAgo);

    //30일 내에 추가된 영화 없을 시, movieId 상위 5개
    @Query("SELECT new com.movie.rock.movie.data.response.MainResponseDTO(m.movieId, m.movieTitle, m.movieDescription, " +
            "p.posters.posterId, p.posters.posterUrls, p.posters.mainPoster, " +
            "t.trailers.trailerId, t.trailers.trailerUrls, t.trailers.mainTrailer, " +
            "m.createDate, 0.0) " +
             "FROM MovieEntity m " +
        "LEFT JOIN m.poster p " +
               "ON p.movie.movieId = m.movieId " +
        "LEFT JOIN m.trailer t " +
               "ON t.movie.movieId = m.movieId " +
            "WHERE p.posters.mainPoster = true OR  p.posters IS NULL OR NOT EXISTS(SELECT 1 FROM MoviePostersEntity mp " +
                                                                                   "WHERE mp.movie = m AND mp.posters.mainPoster = true)" +
         "ORDER BY m.movieId DESC")
    List<MainResponseDTO> findTop10ByOrderByMovieIdDesc(Pageable pageable);

    //IMDB Score 방식 랭킹
//    @Query("SELECT new com.movie.rock.movie.data.response.MainResponseDTO(m.movieId, m.movieTitle, m.movieDescription, " +
//            "p.posters.posterId, p.posters.posterUrls, p.posters.mainPoster, " +
//            "t.trailers.trailerId, t.trailers.trailerUrls, t.trailers.mainTrailer, " +
//            "m.createDate, COALESCE(AVG(r.reviewRating), 0.0)) " +
//             "FROM MovieEntity m " +
//        "LEFT JOIN m.poster p " +
//               "ON p.movie.movieId = m.movieId " +
//        "LEFT JOIN m.trailer t " +
//               "ON t.movie.movieId = m.movieId " +
//        "LEFT JOIN m.reviews r " +
//               "ON r.movie.movieId = m.movieId " +
//         "GROUP BY m.movieId, m.movieTitle, m.movieDescription, p.posters.posterId, p.posters.posterUrls, p.posters.mainPoster, m.createDate " +
//         "ORDER BY AVG(r.reviewRating) DESC")
//    List<MainResponseDTO> findTopRatedMovies(Pageable pageable);
    @Query("SELECT DISTINCT new com.movie.rock.movie.data.response.MainResponseDTO(m.movieId, m.movieTitle, m.movieDescription, " +
            "p.posters.posterId, p.posters.posterUrls, p.posters.mainPoster, " +
            "null, null, null, " + // 트레일러 관련 필드를 null로 설정
            "m.createDate, COALESCE(AVG(r.reviewRating), 0.0)) " +
            "FROM MovieEntity m " +
            "LEFT JOIN m.poster p " +
            "LEFT JOIN m.reviews r " +
            "WHERE (p.posters.mainPoster = true OR p.posters IS NULL) " +
            "GROUP BY m.movieId, m.movieTitle, m.movieDescription, p.posters.posterId, p.posters.posterUrls, p.posters.mainPoster, m.createDate " +
            "ORDER BY AVG(r.reviewRating) DESC")
    List<MainResponseDTO> findTopRatedMovies(Pageable pageable);
}

