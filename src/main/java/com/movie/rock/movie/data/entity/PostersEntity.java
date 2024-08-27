package com.movie.rock.movie.data.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name="posters")
public class PostersEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poster_id")
    private Long posterId;

    @Column(name = "poster_url")
    private String posterUrls;

    @Column(name = "main_poster")
    private Boolean mainPoster = false;

    @Builder
    public PostersEntity(Long posterId, String posterUrls, Boolean mainPoster) {
        this.posterId = posterId;
        this.posterUrls = posterUrls;
        this.mainPoster = mainPoster;
    }
}
