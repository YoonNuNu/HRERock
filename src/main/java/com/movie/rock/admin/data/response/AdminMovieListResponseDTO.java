package com.movie.rock.admin.data.response;


import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MovieReviewEntity;
import com.movie.rock.movie.data.entity.MovieWatchHistoryEntity;
import com.movie.rock.movie.data.repository.MovieWatchHistoryRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class AdminMovieListResponseDTO {
    private Long movieId;
    private String movieTitle;
    private List<String> genres;
    private List<String> directors;
    private int runtime;
    private List<Long> posterIds;
    private List<Long> trailerIds;
    private List<Long> reviewIds;
    private List<Long> watchIds;
    private List<Long> favorIds;

    //생성자
    @Builder
    public AdminMovieListResponseDTO(Long movieId, String movieTitle, List<String> genres, List<String> directors, int runtime
            ,List<Long> posterIds, List<Long> trailerIds, List<Long> reviewIds, List<Long> watchIds, List<Long> favorIds) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.genres = genres;
        this.directors = directors;
        this.runtime = runtime;
        this.posterIds = posterIds;
        this.trailerIds = trailerIds;
        this.reviewIds = reviewIds;
        this.watchIds = watchIds;
        this.favorIds = favorIds;
    }

    //생성자에 넣을 데이터
    public static AdminMovieListResponseDTO fromEntity(MovieEntity movieEntity, MovieWatchHistoryRepository movieWatchHistoryRepository){
        List<Long> watchIds = movieWatchHistoryRepository.findByMovieMovieId(movieEntity.getMovieId())
                .stream()
                .map(MovieWatchHistoryEntity::getWatchId)
                .collect(Collectors.toList());

        return AdminMovieListResponseDTO.builder()
                .movieId(movieEntity.getMovieId())
                .movieTitle(movieEntity.getMovieTitle())
                .genres(movieEntity.getGenres().stream()
                        .map(mg -> mg.getGenre().getGenreName())
                        .collect(Collectors.toList()))
                .directors(movieEntity.getMovieDirectors().stream()
                        .map(md -> md.getDirector().getDirectorName())
                        .collect(Collectors.toList()))
                .runtime(movieEntity.getRunTime())
                .posterIds(movieEntity.getPoster().stream()
                        .map(mp -> mp.getPosters().getPosterId())
                        .collect(Collectors.toList()))
                .trailerIds(movieEntity.getTrailer().stream()
                        .map(mt -> mt.getTrailers().getTrailerId())
                        .collect(Collectors.toList()))
                .reviewIds(movieEntity.getReviews().stream()
                        .map(MovieReviewEntity::getReviewId)
                        .collect(Collectors.toList()))
                .watchIds(watchIds)
                .favorIds(movieEntity.getFavorites().stream()
                        .map(favorEntity -> favorEntity.getMovie().getMovieId())
                        .collect(Collectors.toList()))
                .build();
    }
}
