package com.movie.rock.movie.data.entity;

import com.movie.rock.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movies")
public class MovieEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "movie_title")
    private String movieTitle;

    @Column(name = "run_time")
    private int runTime;

    @Column(name = "open_year")
    private Integer openYear;

    @Column(name = "movie_rating")
    private String movieRating;

    @Column(name = "movie_description")
    private String movieDescription;

    //searchCount
    @Column(name = "movie_searchCount")
    private Integer searchCount = 0;


    //양방향 연결
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieActorsEntity> movieActors;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieDirectorsEntity> movieDirectors;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MoviePostersEntity> poster;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieTrailersEntity> trailer;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieGenresEntity> genres;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieReviewEntity> reviews;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieFavorEntity> favorites;

    @OneToOne(fetch = FetchType.EAGER, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private MovieFilmEntity movieFilm;

    @Builder
    public MovieEntity(Long movieId, String movieTitle, int runTime, Integer openYear, String movieRating, String movieDescription,
                       List<MovieActorsEntity> movieActors, List<MovieDirectorsEntity> movieDirectors, List<MovieGenresEntity> genres,
                       List<MoviePostersEntity> poster, List<MovieTrailersEntity> trailer, List<MovieReviewEntity> reviews, List<MovieFavorEntity> favorites,
                       MovieFilmEntity movieFilm,Integer searchCount) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.runTime = runTime;
        this.openYear = openYear;
        this.movieRating = movieRating;
        this.movieDescription = movieDescription;
        this.movieActors = movieActors;
        this.movieDirectors = movieDirectors;
        this.genres = genres;
        this.poster = poster;
        this.trailer = trailer;
        this.reviews = reviews;
        this.favorites = favorites;
        this.movieFilm = movieFilm;
        this.searchCount = searchCount;
    }

    // 조회수 증가 메서드
    public void upViewCount() {
        if (this.searchCount == null) {
            this.searchCount = 0;
        }
        System.out.println("Before increment: " + this.searchCount);
        this.searchCount++;
        System.out.println("After increment: " + this.searchCount);
    }

}
