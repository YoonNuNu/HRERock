package com.movie.rock.movie.data.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "trailers")
public class TrailersEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trailer_id")
    private Long trailerId;

    @Column(name = "trailer_url")
    private String trailerUrls;

    @Column(name = "main_trailer")
    private Boolean mainTrailer = false;

    @Builder
    public TrailersEntity(Long trailerId, String trailerUrls, Boolean mainTrailer) {
        this.trailerId = trailerId;
        this.trailerUrls = trailerUrls;
        this.mainTrailer = mainTrailer;
    }
}
