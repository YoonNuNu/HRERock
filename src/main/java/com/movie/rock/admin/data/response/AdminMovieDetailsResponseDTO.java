package com.movie.rock.admin.data.response;


import com.movie.rock.movie.data.entity.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class AdminMovieDetailsResponseDTO {

    // 영화의 기본 정보
    private Long movieId;
    private String movieTitle;
    private int runTime;
    private Integer openYear;
    private String movieRating;
    private String movieDescription;

    // 영화와 관련된 엔티티들의 정보
    private List<MovieActorDto> movieActors;     // 출연 배우 정보 리스트
    private List<MovieDirectorDto> movieDirectors; // 감독 정보 리스트
    private List<String> genres;                 // 장르 이름 리스트
    private List<String> posterUrls;             // 포스터 URL 리스트
    private List<String> trailerUrls;            // 트레일러 URL 리스트
    private String filmUrl;                      // 영화 파일 URL

    @Builder
    public AdminMovieDetailsResponseDTO(Long movieId, String movieTitle, int runTime, Integer openYear,
                                        String movieRating, String movieDescription, List<MovieActorDto> movieActors,
                                        List<MovieDirectorDto> movieDirectors, List<String> genres, List<String> posterUrls,
                                        List<String> trailerUrls, String filmUrl) {
        // 생성자: 모든 필드를 초기화
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.runTime = runTime;
        this.openYear = openYear;
        this.movieRating = movieRating;
        this.movieDescription = movieDescription;
        this.movieActors = movieActors;
        this.movieDirectors = movieDirectors;
        this.genres = genres;
        this.posterUrls = posterUrls;
        this.trailerUrls = trailerUrls;
        this.filmUrl = filmUrl;
    }

    // MovieEntity를 ResponseMovieDetailsDto로 변환하는 정적 메소드
    public static AdminMovieDetailsResponseDTO fromEntity(MovieEntity movie) {
        return AdminMovieDetailsResponseDTO.builder()
                .movieId(movie.getMovieId())
                .movieTitle(movie.getMovieTitle())
                .runTime(movie.getRunTime())
                .openYear(movie.getOpenYear())
                .movieRating(movie.getMovieRating())
                .movieDescription(movie.getMovieDescription())
                // 배우 정보를 MovieActorDto 리스트로 변환
                .movieActors(movie.getMovieActors().stream()
                        .map(MovieActorDto::fromEntity)
                        .collect(Collectors.toList()))
                // 감독 정보를 MovieDirectorDto 리스트로 변환
                .movieDirectors(movie.getMovieDirectors().stream()
                        .map(MovieDirectorDto::fromEntity)
                        .collect(Collectors.toList()))
                // 장르 이름만 추출하여 리스트로 변환
                .genres(movie.getGenres().stream()
                        .map(mg -> mg.getGenre().getGenreName())
                        .collect(Collectors.toList()))
                // 포스터 URL만 추출하여 리스트로 변환
                .posterUrls(movie.getPoster().stream()
                        .map(pu -> pu.getPosters().getPosterUrls())
                        .collect(Collectors.toList()))

                // 트레일러 URL만 추출하여 리스트로 변환
                .trailerUrls(movie.getTrailer().stream()
                        .map(tu->tu.getTrailers().getTrailerUrls())
                        .collect(Collectors.toList()))
                // 영화 파일 URL 추출 (null 체크 포함)
                .filmUrl(movie.getMovieFilm() != null ? movie.getMovieFilm().getMovieFilm() : null)
                .build();
    }

    // 내부 클래스: 배우 정보를 위한 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    public static class MovieActorDto {
        private Long actorId;
        private String actorName;

        @Builder
        public MovieActorDto(Long actorId, String actorName) {
            this.actorId = actorId;
            this.actorName = actorName;
        }

        // MovieActorsEntity를 MovieActorDto로 변환하는 정적 메소드
        public static MovieActorDto fromEntity(MovieActorsEntity movieActor) {
            return MovieActorDto.builder()
                    .actorId(movieActor.getActor().getActorId())
                    .actorName(movieActor.getActor().getActorName())
                    .build();
        }
    }

    // 내부 클래스: 감독 정보를 위한 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    public static class MovieDirectorDto {
        private Long directorId;
        private String directorName;

        @Builder
        public MovieDirectorDto(Long directorId, String directorName) {
            this.directorId = directorId;
            this.directorName = directorName;
        }

        // MovieDirectorsEntity를 MovieDirectorDto로 변환하는 정적 메소드
        public static MovieDirectorDto fromEntity(MovieDirectorsEntity movieDirector) {
            return MovieDirectorDto.builder()
                    .directorId(movieDirector.getDirector().getDirectorId())
                    .directorName(movieDirector.getDirector().getDirectorName())
                    .build();
        }
    }
}
