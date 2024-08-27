package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.DirectorResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.GenreResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class AdminMovieListRequestDTO {
    private Long movieId;
    private String movieTitle;
    private List<GenreResponseDTO> movieGenres;
    private List<DirectorResponseDTO> movieDirectors;
    private int runtime;

    //생성자
    public AdminMovieListRequestDTO(Long movieId, String movieTitle, List<GenreResponseDTO> movieGenres,
                                    List<DirectorResponseDTO> movieDirectors, int runtime) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.movieGenres = movieGenres;
        this.movieDirectors = movieDirectors;
        this.runtime = runtime;
    }

    //생성자에 넣을 데이터
    @Builder
    public static MovieEntity ofEntity(AdminMovieListRequestDTO requestMovieListDto){
        return MovieEntity.builder()
                .movieId(requestMovieListDto.getMovieId())
                .movieTitle(requestMovieListDto.getMovieTitle())
                .genres(requestMovieListDto.getMovieGenres().stream()
                        .map(movieGenre -> MovieGenresEntity.builder()
                                .genre(GenresEntity.builder()
                                        .genreId(movieGenre.getGenreId())
                                        .genreName(movieGenre.getGenreName())
                                        .build())
                                .build()
                        ).collect(Collectors.toList()))
                .build();
    }
}
