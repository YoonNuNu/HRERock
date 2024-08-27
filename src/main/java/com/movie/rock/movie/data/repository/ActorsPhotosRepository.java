package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.ActorsPhotosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActorsPhotosRepository extends JpaRepository<ActorsPhotosEntity, Long> {
//    @Query("SELECT ap FROM ActorsPhotosEntity ap WHERE ap.actor.actorId IN :actorIds")
//    List<ActorsPhotosEntity> findByActorIdIn(List<Long> actorIds);
    boolean existsByPhotosPhotoUrls(String photoUrl);
}
