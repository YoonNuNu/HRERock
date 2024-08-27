package com.movie.rock.movie.data.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_trailers")
@IdClass(MovieTrailersEntity.MovieTrailersId.class)  // 여기를 수정
public class MovieTrailersEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trailer_id")
    private TrailersEntity trailers;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private MovieEntity movie;

    @Builder
    public MovieTrailersEntity(TrailersEntity trailers, MovieEntity movie) {
        this.trailers = trailers;
        this.movie = movie;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieTrailersId implements Serializable {  // 여기도 수정
        private Long trailers;  // 순서를 엔티티 필드 순서와 일치시킴
        private Long movie;
    }
}
