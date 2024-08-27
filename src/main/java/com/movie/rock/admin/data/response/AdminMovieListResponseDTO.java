package com.movie.rock.admin.data.response;


import com.movie.rock.movie.data.entity.MovieEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class AdminMovieListResponseDTO {
    private Long movieId;
    private String movieTitle;
    private List<String> genres;
    private List<String> directors;
    private int runtime;

    //생성자
    @Builder
    public AdminMovieListResponseDTO(Long movieId, String movieTitle, List<String> genres, List<String> directors, int runtime) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.genres = genres;
        this.directors = directors;
        this.runtime = runtime;
    }

    //생성자에 넣을 데이터
    public static AdminMovieListResponseDTO fromEntity(MovieEntity movieEntity){
        return AdminMovieListResponseDTO.builder()
                .movieId(movieEntity.getMovieId())
                .movieTitle(movieEntity.getMovieTitle())
                .genres(movieEntity.getGenres().stream()
                        .map(mg -> mg.getGenre().getGenreName())
                        .collect(Collectors.toList()))
                .directors(movieEntity.getMovieDirectors().stream()
                        .map(md -> md.getDirector().getDirectorName())
                        .collect(Collectors.toList()))
                .runtime(movieEntity.getRunTime())
                .build();
    }
}
