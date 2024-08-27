package com.movie.rock.movie.data.request;

import lombok.*;

@Getter
@NoArgsConstructor
public class MovieFavorRequestDTO {
    private Long movieId;

    @Builder
    public MovieFavorRequestDTO(Long movieId) {
        this.movieId = movieId;
    }
}
