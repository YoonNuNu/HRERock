package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.ActorResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.DirectorResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.GenreResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class AdminMovieFirstInfoUpdateRequestDTO {
    private Long movieId;
    private String movieTitle;
    private List<GenreResponseDTO> movieGenres;
    private int runTime;
    private Integer openYear;
    private String movieRating;
    private String movieDescription;
    private List<ActorResponseDTO> movieActors;
    //배우사진 추가
    private List<DirectorResponseDTO> movieDirectors;
    //감독사진 추가

    public AdminMovieFirstInfoUpdateRequestDTO(Long movieId,String movieTitle,List<GenreResponseDTO> movieGenres,
                                               int runTime,Integer openYear,String movieRating,String movieDescription,
                                               List<ActorResponseDTO> movieActors,List<DirectorResponseDTO> movieDirectors){

        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.movieGenres = movieGenres;
        this.runTime = runTime;
        this.openYear = openYear;
        this.movieRating = movieRating;
        this.movieDescription = movieDescription;
        this.movieActors = movieActors;
        this.movieDirectors = movieDirectors;
    }

    //생성자에 넣을 데이터
    @Builder
    public static MovieEntity ofEntity(AdminMovieFirstInfoUpdateRequestDTO adminMovieFirstInfoUpdateRequestDTO){
        return MovieEntity.builder()
                .movieId(adminMovieFirstInfoUpdateRequestDTO.getMovieId())
                .movieTitle(adminMovieFirstInfoUpdateRequestDTO.getMovieTitle())
                .genres(adminMovieFirstInfoUpdateRequestDTO.getMovieGenres().stream()
                        .map(genreDto -> MovieGenresEntity.builder()
                                .genre(GenresEntity.builder()
                                        .genreId(genreDto.getGenreId())
                                        .genreName(genreDto.getGenreName())
                                        .build())
                                .build())
                        .collect(Collectors.toList()))
                .runTime(adminMovieFirstInfoUpdateRequestDTO.getRunTime())
                .openYear(adminMovieFirstInfoUpdateRequestDTO.getOpenYear())
                .movieRating(adminMovieFirstInfoUpdateRequestDTO.getMovieRating())
                .movieDescription(adminMovieFirstInfoUpdateRequestDTO.getMovieDescription())
                .movieActors(adminMovieFirstInfoUpdateRequestDTO.getMovieActors().stream()
                        .map(movieActorDto -> MovieActorsEntity.builder()
                                .actor(ActorsEntity.builder()
                                        .actorId(movieActorDto.getActorId())
                                        .actorName(movieActorDto.getActorName())
                                        .build())
                                .build())
                        .collect(Collectors.toList()))
                .movieDirectors(adminMovieFirstInfoUpdateRequestDTO.getMovieDirectors().stream()
                        .map(movieDirectorDto -> MovieDirectorsEntity.builder()
                                .director(DirectorsEntity.builder()
                                        .directorId(movieDirectorDto.getDirectorId())
                                        .directorName(movieDirectorDto.getDirectorName())
                                        .build())
                                .build())
                        .collect(Collectors.toList())
                )
                .build();

    }
}
