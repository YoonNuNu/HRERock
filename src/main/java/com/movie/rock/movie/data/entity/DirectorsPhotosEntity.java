package com.movie.rock.movie.data.entity;

import com.movie.rock.common.CommonException;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "directors_photos")
@IdClass(DirectorsPhotosEntity.DirectorsPhotosId.class)
public class DirectorsPhotosEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "director_id", referencedColumnName = "director_id")
    private DirectorsEntity director;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", referencedColumnName = "photo_id")
    private PhotosEntity photos;

    @Builder
    public DirectorsPhotosEntity(DirectorsEntity director, PhotosEntity photos) {
        this.director = director;
        this.photos = photos;
        if(photos != null && photos.getPhotoType() != PhotoType.DIRECTOR) {
            throw new CommonException.InvalidDirectorPhotoTypeException();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DirectorsPhotosId implements Serializable {
        private Long director;
        private Long photos;
    }
}