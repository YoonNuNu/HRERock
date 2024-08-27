package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.MovieEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminMovieFirstInfoTitleRequestDTO {
    private Long movieId;
    private String movieTitle;


    //생성자
    public AdminMovieFirstInfoTitleRequestDTO(Long movieId,String movieTitle){
        this.movieId = movieId;
        this.movieTitle = movieTitle;
    }

    //생성자에 넣을 데이터
    @Builder
    public static MovieEntity ofEntity(AdminMovieFirstInfoTitleRequestDTO adminMovieFirstInfoTitleRequestDTO){
        return MovieEntity.builder()
                .movieId(adminMovieFirstInfoTitleRequestDTO.getMovieId())
                .movieTitle(adminMovieFirstInfoTitleRequestDTO.getMovieTitle())
                .build();
    }
}
