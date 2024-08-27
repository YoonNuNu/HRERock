package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MovieFilmEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminFilmRequestDTO {

    private Long filmId;
    private MovieEntity movie;  //영화ID
    private String movieFilm;   //필름 주소

    //생성자
    private AdminFilmRequestDTO(Long filmId,MovieEntity movie,String  movieFilm){
        this.filmId = filmId;
        this.movie= movie;
        this.movieFilm = movieFilm;
    }

    //생성자에 넣을 데이터
    @Builder
    public static MovieFilmEntity ofEntity(AdminFilmRequestDTO adminFilmRequestDTO){
        return MovieFilmEntity.builder()
                .filmId(adminFilmRequestDTO.getFilmId())
                .movie(adminFilmRequestDTO.getMovie())
                .movieFilm(adminFilmRequestDTO.getMovieFilm())
                .build();
    }
}
