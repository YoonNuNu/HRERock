package com.movie.rock.movie.data.response;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.PostersEntity;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@Slf4j
public class MovieSearchResponseDTO {
    private Long movieId;
    private String movieTitle;
    private String movieDescription;
    private List<PosterResponseDTO> posters;
    private Integer searchCount;

    @Builder
    public MovieSearchResponseDTO(Long movieId, String movieTitle,
                                  List<PosterResponseDTO> posters, String movieDescription, Integer searchCount) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.posters = posters;
        this.movieDescription = movieDescription;
        this.searchCount = searchCount;
    }

    public static MovieSearchResponseDTO fromEntity(MovieEntity movieEntity) {
        log.info("MovieEntity ID: {}", movieEntity.getMovieId());
        log.info("MovieEntity Title: {}", movieEntity.getMovieTitle());  // 여기서 값 확인
        log.info("MovieEntity Description: {}", movieEntity.getMovieDescription());



        return MovieSearchResponseDTO.builder()
                .movieId(movieEntity.getMovieId())
                .movieTitle(movieEntity.getMovieTitle())
//                .posters(movieEntity.getPoster().stream()
//                        .map(mp -> PosterResponseDTO.fromEntity(mp.getPosters()))
//                        .collect(Collectors.toList()))
                .posters(movieEntity.getPoster().stream()
                        .map(mp -> {
                            PostersEntity poster = mp.getPosters();
                            return (poster != null && poster.getMainPoster() != null && poster.getMainPoster())
                                    ? PosterResponseDTO.fromEntity(poster)
                                    : null;
                        })
                        .filter(Objects::nonNull)
                        .findFirst()
                        .map(Collections::singletonList)
                        .orElseGet(() -> movieEntity.getPoster().stream()
                                .map(mp -> PosterResponseDTO.fromEntity(mp.getPosters()))
                                .filter(Objects::nonNull)
                                .limit(1)
                                .collect(Collectors.toList()))
                )
                .movieDescription(movieEntity.getMovieDescription())
                .searchCount(movieEntity.getSearchCount())
                .build();
    }
}
