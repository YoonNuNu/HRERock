package com.movie.rock.movie.data.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MoviePlayResponseDTO {
    private Long filmId;
    private String movieFilm;
    private Long movieId;
    private Long watchTime;

    @Builder
    public MoviePlayResponseDTO(Long filmId, String movieFilm, Long movieId, Long watchTime) {
        this.filmId = filmId;
        this.movieFilm = movieFilm;
        this.movieId = movieId;
        this.watchTime = watchTime;
    }
}
