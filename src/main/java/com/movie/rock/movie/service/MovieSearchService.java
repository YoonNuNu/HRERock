package com.movie.rock.movie.service;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.repository.MovieRepository;
import com.movie.rock.movie.data.repository.MovieSearchRepository;
import com.movie.rock.movie.data.request.MovieSearchRequestDTO;
import com.movie.rock.movie.data.response.MovieSearchResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieSearchService {
    private final MovieSearchRepository movieSearchRepository;
    private final MovieRepository movieRepository;

    public Page<MovieSearchResponseDTO> movieSearch(MovieSearchRequestDTO movieSearchRequestDTO, Pageable pageable) {

        // 검색 조건을 하나의 문자열로 결합
        String searchTerm = buildSearchTerm(movieSearchRequestDTO);

        // 로그: 서비스 호출 정보
//        log.info("서비스 호출: 검색어={}", searchTerm);

        // JPQL 쿼리로 영화 검색
        Page<MovieEntity> movieEntities = movieSearchRepository.searchMovies(
                searchTerm,
                pageable
        );

        movieEntities.forEach(movie -> incrementSearchCount(movie.getMovieId()));

        // 로그: 검색된 영화 수
//        log.info("검색된 영화 수: {}", movieEntities.getTotalElements());

        // 엔티티를 DTO로 변환하여 반환
        return movieEntities.map(MovieSearchResponseDTO::fromEntity);
    }

    private String buildSearchTerm(MovieSearchRequestDTO movieSearchRequestDTO) {
        StringBuilder searchTerm = new StringBuilder();

        // 제목 추가
        if (movieSearchRequestDTO.getMovieTitle() != null && !movieSearchRequestDTO.getMovieTitle().trim().isEmpty()) {
            searchTerm.append(movieSearchRequestDTO.getMovieTitle()).append(" ");
        }

        // 감독 추가
        if (movieSearchRequestDTO.getMovieDirectors() != null && !movieSearchRequestDTO.getMovieDirectors().trim().isEmpty()) {
            searchTerm.append(movieSearchRequestDTO.getMovieDirectors()).append(" ");
        }

        // 배우 추가
        if (movieSearchRequestDTO.getMovieActors() != null && !movieSearchRequestDTO.getMovieActors().trim().isEmpty()) {
            searchTerm.append(movieSearchRequestDTO.getMovieActors()).append(" ");
        }

        // 장르 추가
        if (movieSearchRequestDTO.getGenres() != null && !movieSearchRequestDTO.getGenres().trim().isEmpty()) {
            searchTerm.append(movieSearchRequestDTO.getGenres());
        }

        return searchTerm.toString().trim();
    }

    //해당영화를 찾고 카운트를 1씩 올려주고 저장
    private void incrementSearchCount(Long movieId) {
        Optional<MovieEntity> movieOpt = movieRepository.findById(movieId);

        if (movieOpt.isPresent()) {
            MovieEntity movie = movieOpt.get();
            movie.upViewCount(); // 조회수 증가
            movieRepository.save(movie); // 데이터베이스에 저장
        } else {
//            log.warn("영화 ID {} 를 찾을 수 없습니다.", movieId);
        }
    }

    // 상위 랭킹 영화 리스트를 반환하는 메서드 추가
    public Page<MovieSearchResponseDTO> getTopRankMovies(Pageable pageable) {
        // Pageable을 사용하여 상위 10개의 영화만 가져오기
        Pageable topRankPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "searchCount"));
        Page<MovieEntity> movieEntities = movieRepository.findTopRankMovies(topRankPageable);

        // 로그: 상위 랭킹 영화 수
//        log.info("상위 랭킹 영화 수: {}", movieEntities.getTotalElements());

        // 엔티티를 DTO로 변환하여 반환
        return movieEntities.map(MovieSearchResponseDTO::fromEntity);
    }

}
