package com.movie.rock.movie.data.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "actors")
public class ActorsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "actor_name")
    private String actorName;

    @Column(name = "actor_birth")
    private Integer actorBirth;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieActorsEntity> movieActors;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActorsPhotosEntity> actorPhotos;

    @Builder
    public ActorsEntity(Long actorId, String actorName, Integer actorBirth, List<MovieActorsEntity> movieActors, List<ActorsPhotosEntity> actorPhotos) {
        this.actorId = actorId;
        this.actorName = actorName;
        this.actorBirth = actorBirth;
        this.movieActors = movieActors;
        this.actorPhotos = actorPhotos;
    }
}
