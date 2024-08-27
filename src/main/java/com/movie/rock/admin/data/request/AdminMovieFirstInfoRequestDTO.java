package com.movie.rock.admin.data.request;

import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor

public class AdminMovieFirstInfoRequestDTO {
    private Long movieId;
    private String movieTitle;  // 추가
    private List<GenreResponseDTO> movieGenres = new ArrayList<>();
    private int runTime;
    private Integer openYear;
    private String movieRating;
    private String movieDescription;
    private List<ActorResponseDTO> movieActors = new ArrayList<>();
    private List<DirectorResponseDTO> movieDirectors = new ArrayList<>();


    // 생성자에 넣을 데이터
    @Builder
    public static MovieEntity ofEntity(AdminMovieFirstInfoRequestDTO dto) {
        return MovieEntity.builder()
                .movieId(dto.getMovieId())
                .movieTitle(dto.getMovieTitle())
                .genres(dto.getMovieGenres().stream()
                        .map(genreDto -> MovieGenresEntity.builder()
                                .genre(GenresEntity.builder()
                                        .genreId(genreDto.getGenreId())
                                        .genreName(genreDto.getGenreName())
                                        .build())
                                .build())
                        .collect(Collectors.toList()))
                .runTime(dto.getRunTime())
                .openYear(dto.getOpenYear())
                .movieRating(dto.getMovieRating())
                .movieDescription(dto.getMovieDescription())
                .movieActors(dto.getMovieActors().stream()
                        .map(movieActorDto -> MovieActorsEntity.builder()
                                .actor(ActorsEntity.builder()
                                        .actorId(movieActorDto.getActorId())
                                        .actorName(movieActorDto.getActorName())
                                        .build())
                                .build())
                        .collect(Collectors.toList()))
                .movieDirectors(dto.getMovieDirectors().stream()
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