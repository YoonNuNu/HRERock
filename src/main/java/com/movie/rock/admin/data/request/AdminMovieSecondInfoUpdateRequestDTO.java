package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.FilmResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.TrailerResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;


@Getter
@Setter
@NoArgsConstructor
public class AdminMovieSecondInfoUpdateRequestDTO {
    private Long movieId;
    private String movieTitle;
    private List<TrailerResponseDTO> trailer;
    private FilmResponseDTO movieFilm;  // MovieFilmEntity에서 FilmResponseDTO로 변경
    private List<PosterResponseDTO> poster;

    // 생성자
    @Builder
    public AdminMovieSecondInfoUpdateRequestDTO(Long movieId, String movieTitle, List<TrailerResponseDTO> trailer, FilmResponseDTO movieFilm, List<PosterResponseDTO> poster) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.trailer = trailer;
        this.movieFilm = movieFilm;
        this.poster = poster;
    }

    // ofEntity 메서드 수정
    public static MovieEntity ofEntity(AdminMovieSecondInfoUpdateRequestDTO dto) {
        return MovieEntity.builder()
                .movieId(dto.getMovieId())
                .movieTitle(dto.getMovieTitle())
                .trailer(dto.getTrailer().stream()
                        .map(trailerDto -> MovieTrailersEntity.builder()
                                .trailers(TrailersEntity.builder()
                                        .trailerId(trailerDto.getTrailerId())
                                        .trailerUrls(trailerDto.getTrailerUrls())
                                        .mainTrailer(trailerDto.getMainTrailer())
                                        .build())
                                .build())
                        .collect(Collectors.toList()))
                .movieFilm(MovieFilmEntity.builder()
                        .filmId(dto.getMovieFilm().getFilmId())
                        .movieFilm(dto.getMovieFilm().getMovieFilm())
                        .build())
                .poster(dto.getPoster().stream()
                        .map(posterDto -> MoviePostersEntity.builder()
                                .posters(PostersEntity.builder()
                                        .posterId(posterDto.getPosterId())
                                        .posterUrls(posterDto.getPosterUrls())
                                        .mainPoster(posterDto.getMainPoster())
                                        .build())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}