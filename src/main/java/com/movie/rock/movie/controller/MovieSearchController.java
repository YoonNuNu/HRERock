package com.movie.rock.movie.controller;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.request.MovieSearchRequestDTO;
import com.movie.rock.movie.data.response.MovieSearchResponseDTO;
import com.movie.rock.movie.service.MovieSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MovieSearchController {

    private final MovieSearchService movieSearchService;

    // 검색 컨트롤러
    @GetMapping("/user/MovieSearch")
    public ResponseEntity<Page<MovieSearchResponseDTO>> userMovieSearch(
            @PageableDefault(size = 5, sort = "movieId", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(value = "movieTitle", defaultValue = "") String movieTitle,
            @RequestParam(value = "movieDirectors", defaultValue = "") List<String> movieDirectors,
            @RequestParam(value = "movieActors", defaultValue = "") List<String> movieActors,
            @RequestParam(value = "genres", defaultValue = "") List<String> genres) {

//        log.info("검색 요청: 제목={}, 감독={}, 배우={}, 장르={}", movieTitle, movieDirectors, movieActors, genres);

        MovieSearchRequestDTO requestDTO = MovieSearchRequestDTO.builder()
                .movieTitle(movieTitle)
                .movieDirectors(String.join(",", movieDirectors))
                .movieActors(String.join(",", movieActors))
                .genres(String.join(",", genres))  // 장르 필드 설정
                .build();

//        log.info("DTO 생성 완료: 제목={}, 감독={}, 배우={}, 장르={}",
//                requestDTO.getMovieTitle(), requestDTO.getMovieDirectors(),
//                requestDTO.getMovieActors(), requestDTO.getGenres());

        try {
            Page<MovieSearchResponseDTO> response = movieSearchService.movieSearch(requestDTO, pageable);
//            log.info("검색 결과 총 개수: {}", response.getTotalElements());
            response.getContent().forEach(movie -> {
//                log.info("영화 ID: {}", movie.getMovieId());
//                log.info("영화 제목: {}", movie.getMovieTitle());
//                log.info("영화 설명: {}", movie.getMovieDescription());
//                log.info("포스터 개수: {}", movie.getPosters().size());
                movie.getPosters().forEach(poster -> log.info("포스터 URL: {}", poster.getPosterUrls()));
            });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
//            log.error("서버 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/TopRankMovies")
    public ResponseEntity<Page<MovieSearchResponseDTO>> getTopRankMovies(
            @PageableDefault(size = 10, sort = "searchCount", direction = Sort.Direction.DESC) Pageable pageable) {

//        log.info("상위 랭킹 영화 요청");

        try {
            Page<MovieSearchResponseDTO> response = movieSearchService.getTopRankMovies(pageable);
//            log.info("상위 랭킹 영화 총 개수: {}", response.getTotalElements());
            response.getContent().forEach(movie -> {
//                log.info("영화 ID: {}", movie.getMovieId());
//                log.info("영화 제목: {}", movie.getMovieTitle());
//                log.info("영화 설명: {}", movie.getMovieDescription());
//                log.info("포스터 개수: {}", movie.getPosters().size());
                movie.getPosters().forEach(poster -> log.info("포스터 URL: {}", poster.getPosterUrls()));
            });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
//            log.error("서버 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
