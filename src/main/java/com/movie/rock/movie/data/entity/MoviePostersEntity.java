package com.movie.rock.movie.data.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_posters")
@IdClass(MoviePostersEntity.MoviePostersId.class)
public class MoviePostersEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private MovieEntity movie;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_id")
    private PostersEntity posters;

    @Builder
    public MoviePostersEntity(PostersEntity posters, MovieEntity movie) {
        this.posters = posters;
        this.movie = movie;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MoviePostersId implements Serializable {
        private Long movie;
        private Long posters;
    }
}