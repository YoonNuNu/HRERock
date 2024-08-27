package com.movie.rock.movie.data.entity;

import com.movie.rock.common.CommonException.InvalidActorPhotoTypeException;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "actors_photos")
@IdClass(ActorsPhotosEntity.ActorsPhotosId.class)
public class ActorsPhotosEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id", referencedColumnName = "actor_id")
    private ActorsEntity actor;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", referencedColumnName = "photo_id")
    private PhotosEntity photos;

    @Builder
    public ActorsPhotosEntity(ActorsEntity actor, PhotosEntity photos) {
        this.actor = actor;
        this.photos = photos;
        if(photos != null && photos.getPhotoType() != PhotoType.ACTOR) {
            throw new InvalidActorPhotoTypeException();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActorsPhotosId implements Serializable {
        private Long actor;
        private Long photos;
    }
}