package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.FilmResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.TrailerResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class AdminMovieSecondInfoRequestDTO {
    private Long movieId;
    private String movieTitle;
    private List<TrailersEntity> trailer;
    private MovieFilmEntity movieFilm;
    private List<PostersEntity> poster;

    //생성자
    public AdminMovieSecondInfoRequestDTO(Long movieId,String movieTitle,List<TrailersEntity> trailer,MovieFilmEntity movieFilm
            ,List<PostersEntity> poster){
        this.movieId=movieId;
        this.movieTitle = movieTitle;
        this.trailer = trailer;
        this.movieFilm = movieFilm;
        this.poster = poster;

        // 메인 포스터를 맨 앞에 배치하는 로직 추가
        if (this.poster != null && !this.poster.isEmpty()) {
            Optional<PostersEntity> mainPosterOpt = this.poster.stream().filter(PostersEntity::getMainPoster).findFirst();
            if (mainPosterOpt.isPresent()) {
                PostersEntity mainPoster = mainPosterOpt.get();
                this.poster.remove(mainPoster);
                this.poster.add(0, mainPoster);
            }
        }
    }
    //생성자에 넣을 데이터
    @Builder
    public static MovieEntity ofEntity(AdminMovieSecondInfoRequestDTO adminMovieSecondInfoRequestDTO){
        return MovieEntity.builder()
                .movieId(adminMovieSecondInfoRequestDTO.getMovieId())
                .movieTitle(adminMovieSecondInfoRequestDTO.getMovieTitle())
                .trailer(adminMovieSecondInfoRequestDTO.getTrailer().stream()
                        .map(tr -> MovieTrailersEntity.builder()
                                .trailers(TrailersEntity.builder()
                                        .trailerId(tr.getTrailerId())
                                        .trailerUrls(tr.getTrailerUrls())
                                        .mainTrailer(tr.getMainTrailer())
                                        .build())
                                .build())
                        .collect(Collectors.toList()))
                .movieFilm(adminMovieSecondInfoRequestDTO.getMovieFilm())
                .poster(adminMovieSecondInfoRequestDTO.getPoster().stream()
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
