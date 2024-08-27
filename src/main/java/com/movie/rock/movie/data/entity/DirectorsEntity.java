package com.movie.rock.movie.data.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "directors")
public class DirectorsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "director_id")
    private Long directorId;

    @Column(name = "director_name")
    private String directorName;

    @Column(name = "director_birth")
    private Integer directorBirth;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "director", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieDirectorsEntity> movieDirectors;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "director", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DirectorsPhotosEntity> directorPhotos;

    @Builder
    public DirectorsEntity(Long directorId, String directorName, Integer directorBirth, List<MovieDirectorsEntity> movieDirectors, List<DirectorsPhotosEntity> directorPhotos) {
        this.directorId = directorId;
        this.directorName = directorName;
        this.directorBirth = directorBirth;
        this.movieDirectors = movieDirectors;
        this.directorPhotos = directorPhotos;
    }
}
