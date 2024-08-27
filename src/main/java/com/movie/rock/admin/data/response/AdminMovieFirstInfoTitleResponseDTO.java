package com.movie.rock.admin.data.response;


import com.movie.rock.movie.data.entity.MovieEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminMovieFirstInfoTitleResponseDTO {
    private Long movieId;
    private String movieTitle;

    //생성자
    @Builder
    public AdminMovieFirstInfoTitleResponseDTO(Long movieId,String movieTitle){
        this.movieId = movieId;
        this.movieTitle = movieTitle;
    }

    //생성자에 넣을 데이터
    public static AdminMovieFirstInfoTitleResponseDTO fromEntity(MovieEntity movieEntity){
        return AdminMovieFirstInfoTitleResponseDTO.builder()
                .movieId(movieEntity.getMovieId())
                .movieTitle(movieEntity.getMovieTitle())
                .build();
    }
}
