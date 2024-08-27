package com.movie.rock.admin.data.response;


import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MoviePostersEntity;
import com.movie.rock.movie.data.entity.MovieTrailersEntity;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.FilmResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.TrailerResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class AdminMovieSecondInfoResponseDTO {
    private Long movieId;
    private String movieTitle;
    private List<TrailerResponseDTO> trailer;
    private FilmResponseDTO movieFilm;
    private List<PosterResponseDTO> poster;
    private String createDate;
    private String modifyDate;

    @Builder
    public AdminMovieSecondInfoResponseDTO(Long movieId, String movieTitle, List<TrailerResponseDTO> trailer,
                                           FilmResponseDTO movieFilm, List<PosterResponseDTO> poster,String createDate, String modifyDate) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.trailer = trailer;
        this.movieFilm = movieFilm;
        this.poster = poster;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
    }

    public static AdminMovieSecondInfoResponseDTO fromEntity(MovieEntity movieEntity,
                                                             List<MovieTrailersEntity> trailers, List<MoviePostersEntity> posters) {

        MoviePostersEntity mainPoster = posters.stream()
                .filter(p -> p.getPosters().getMainPoster())
                .findFirst()
                .orElse(posters.isEmpty() ? null : posters.get(0));

        List<TrailerResponseDTO> sortedTrailers = trailers.stream()
                .map(movieTrailer -> TrailerResponseDTO.builder()
                        .trailerId(movieTrailer.getTrailers().getTrailerId())
                        .trailerUrls(movieTrailer.getTrailers().getTrailerUrls())
                        .mainTrailer(movieTrailer.getTrailers().getMainTrailer())
                        .build())
                .sorted((t1, t2) -> Boolean.compare(t2.getMainTrailer(), t1.getMainTrailer()))
                .collect(Collectors.toList());

        List<PosterResponseDTO> sortedPosters = posters.stream()
                .map(moviePoster -> PosterResponseDTO.builder()
                        .posterId(moviePoster.getPosters().getPosterId())
                        .posterUrls(moviePoster.getPosters().getPosterUrls())
                        .mainPoster(moviePoster.getPosters().getMainPoster())
                        .build())
                .sorted((p1, p2) -> Boolean.compare(p2.getMainPoster(), p1.getMainPoster()))
                .collect(Collectors.toList());

        return AdminMovieSecondInfoResponseDTO.builder()
                .movieId(movieEntity.getMovieId())
                .movieTitle(movieEntity.getMovieTitle())
                .trailer(sortedTrailers)
                .movieFilm(FilmResponseDTO.fromEntity(movieEntity.getMovieFilm()))
                .poster(sortedPosters)
                .createDate(movieEntity.getCreateDate())
                .modifyDate(movieEntity.getModifyDate())
                .build();
    }
}
