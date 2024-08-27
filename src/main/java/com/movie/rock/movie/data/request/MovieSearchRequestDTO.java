package com.movie.rock.movie.data.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MovieSearchRequestDTO {
    //메인페이지 검색
    //영화이름, 감독, 배우, 장르
    //메인페이지 검색
    //영화이름, 감독, 배우, 장르
    private String movieTitle;
    private String movieDirectors;
    private String movieActors;
    private String genres;

    // @Builder를 사용하여 객체 생성

    @Builder
    public MovieSearchRequestDTO(String movieTitle, String movieDirectors, String movieActors, String genres) {
        this.movieTitle = movieTitle;
        this.movieDirectors = movieDirectors;
        this.movieActors = movieActors;
        this.genres = genres;
    }

}
