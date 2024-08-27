package com.movie.rock.movie.data.response;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.response.MovieReviewResponseDTO.ReviewResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.movie.rock.movie.data.response.MovieInfoResponseDTO.*;

@Getter
@NoArgsConstructor
public class MovieDetailResponseDTO {

    private Long movieId;
    private String movieTitle;
    private List<GenreResponseDTO> genres;
    private int runTime;
    private Integer openYear;
    private String movieRating;
    private String movieDescription;
    private List<ActorResponseDTO> actors;
    private Map<Long, List<Long>> actorsPhotos;
    private List<DirectorResponseDTO> directors;
    private Map<Long, List<Long>> directorsPhoto;
    private List<PosterResponseDTO> posters;
    private PosterResponseDTO mainPoster;
    private List<TrailerResponseDTO> trailers;
    private TrailerResponseDTO mainTrailer;
    private FilmResponseDTO movieFilm;
    private List<ReviewResponseDTO> reviews;
    private Long favorCount;

    @Builder
    public MovieDetailResponseDTO(Long movieId, String movieTitle, int runTime, Integer openYear, String movieRating, String movieDescription,
                                  List<ActorResponseDTO> actors, Map<Long, List<Long>> actorsPhotos, List<DirectorResponseDTO> directors,
                                  Map<Long, List<Long>> directorsPhoto, List<GenreResponseDTO> genres, List<PosterResponseDTO> posters, PosterResponseDTO mainPoster,
                                  List<TrailerResponseDTO> trailers, TrailerResponseDTO mainTrailer,FilmResponseDTO movieFilm, List<ReviewResponseDTO> reviews,
                                  Long favorCount) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.genres = genres;
        this.runTime = runTime;
        this.openYear = openYear;
        this.movieRating = movieRating;
        this.movieDescription = movieDescription;
        this.actors = actors;
        this.actorsPhotos = actorsPhotos;
        this.directors = directors;
        this.directorsPhoto = directorsPhoto;
        this.posters = posters;
        this.mainPoster = mainPoster;
        this.trailers = trailers;
        this.mainTrailer = mainTrailer;
        this.movieFilm = movieFilm;
        this.reviews = reviews;
        this.favorCount = favorCount;
    }


    public static MovieDetailResponseDTO fromEntity(MovieEntity movie) {
        return MovieDetailResponseDTO.builder()
                .movieId(movie.getMovieId())
                .movieTitle(movie.getMovieTitle())
                .genres(movie.getGenres().stream()
                        .map(mg -> GenreResponseDTO.fromEntity(mg.getGenre()))
                        .collect(Collectors.toList()))
                .runTime(movie.getRunTime())
                .openYear(movie.getOpenYear())
                .movieRating(movie.getMovieRating())
                .movieDescription(movie.getMovieDescription())
                .actors(movie.getMovieActors().stream()
                        .map(ma -> ActorResponseDTO.fromEntity(ma.getActor()))
                        .collect(Collectors.toList()))
                .actorsPhotos(movie.getMovieActors().stream()
                        .flatMap(ap -> ap.getActor().getActorPhotos().stream())
                        .filter(ap -> ap.getActor() != null && ap.getPhotos() != null)
                        .collect(Collectors.groupingBy(
                                ap -> ap.getActor().getActorId(),
                                Collectors.mapping(ap -> ap.getPhotos().getPhotoId(), Collectors.toList())
                        )))
                .directors(movie.getMovieDirectors().stream()
                        .map(md -> DirectorResponseDTO.fromEntity(md.getDirector()))
                        .collect(Collectors.toList()))
                .directorsPhoto(movie.getMovieDirectors().stream()
                        .flatMap(md -> md.getDirector().getDirectorPhotos().stream())
                        .filter(dp -> dp.getDirector() != null && dp.getPhotos() != null)
                        .collect(Collectors.groupingBy(
                                dp -> dp.getDirector().getDirectorId(),
                                Collectors.mapping(dp -> dp.getPhotos().getPhotoId(), Collectors.toList())
                        )))
                .posters(movie.getPoster().stream()
                        .map(mp -> PosterResponseDTO.fromEntity(mp.getPosters()))
                        .collect(Collectors.toList()))
                .mainPoster(movie.getPoster().stream()
                        .map(mp -> mp.getPosters())
                        .filter(p -> p != null)
                        .map(PosterResponseDTO::fromEntity)
                        .sorted((p1, p2) -> {
                            if (p1.getMainPoster() == p2.getMainPoster()) return 0;
                            if (p1.getMainPoster() == null) return 1;
                            if (p2.getMainPoster() == null) return -1;
                            return p2.getMainPoster().compareTo(p1.getMainPoster());
                        })
                        .findFirst()
                        .orElse(null))
                .trailers(movie.getTrailer().stream()
                        .map(mt -> TrailerResponseDTO.fromEntity(mt.getTrailers()))
                        .collect(Collectors.toList()))
                .mainTrailer(movie.getTrailer().stream()
                        .map(mt -> mt.getTrailers())
                        .filter(t -> t != null)
                        .map(TrailerResponseDTO::fromEntity)
                        .sorted((t1, t2) -> {
                            if (t1.getMainTrailer() == t2.getMainTrailer()) return 0;
                            if (t1.getMainTrailer() == null) return 1;
                            if (t2.getMainTrailer() == null) return -1;
                            return t2.getMainTrailer().compareTo(t1.getMainTrailer());
                        })
                        .findFirst()
                        .orElse(null))
                .movieFilm(FilmResponseDTO.fromEntity(movie.getMovieFilm()))
                .reviews(movie.getReviews().stream()
                        .map(review -> ReviewResponseDTO.fromEntity(review, review.getMember()))
                        .collect(Collectors.toList()))
                .favorCount((long) movie.getFavorites().size())
                .build();
    }
}