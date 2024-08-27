package com.movie.rock.admin.data.request;


import lombok.Builder;
import lombok.Getter;

@Getter
public class AdminMovieListSearchRequestDTO {

    //관리자 영화리스트 페이지 검색
    //글 제목
    private final String movieTitle;
    private final String movieGenres;
    private final String directorName;


    @Builder
    public AdminMovieListSearchRequestDTO(String movieTitle,String movieGenres,String directorName) {
        this.movieTitle = movieTitle;
        this.movieGenres = movieGenres;
        this.directorName = directorName;
    }


    public static AdminMovieListSearchRequestDTO adminMovieListSearchRequestDTO(
            String movieTitle,String movieGenres,String directorName) {
        return AdminMovieListSearchRequestDTO.builder()
                .movieTitle(movieTitle)
                .movieGenres(movieGenres)
                .directorName(directorName)
                .build();
    }
}
