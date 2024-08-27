package com.movie.rock.admin.data.request;

import com.movie.rock.movie.data.entity.ActorsEntity;
import com.movie.rock.movie.data.entity.ActorsPhotosEntity;
import com.movie.rock.movie.data.entity.PhotoType;
import com.movie.rock.movie.data.entity.PhotosEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class AdminActorAddRequestDTO {

    private Long actorId;
    private String actorName;
    private Integer actorBirth;
    private List<String> actorPhotos;

    // 생성자
    public AdminActorAddRequestDTO(Long actorId, String actorName, Integer actorBirth, List<String> actorPhotos) {
        this.actorId = actorId;
        this.actorName = actorName;
        this.actorBirth = actorBirth;
        this.actorPhotos = actorPhotos;
    }

    // 생성자에 넣을 데이터
    @Builder
    public static ActorsEntity ofEntity(AdminActorAddRequestDTO adminActorAddRequestDTO) {
        // 엔티티 생성 시 actorPhotos 리스트를 초기화
        ActorsEntity actorsEntity = ActorsEntity.builder()
                .actorId(adminActorAddRequestDTO.getActorId())
                .actorName(adminActorAddRequestDTO.getActorName())
                .actorBirth(adminActorAddRequestDTO.getActorBirth())
                .actorPhotos(new ArrayList<>()) // 초기화된 리스트 설정
                .build();

        if (adminActorAddRequestDTO.getActorPhotos() != null) {
            List<ActorsPhotosEntity> photoEntities = adminActorAddRequestDTO.getActorPhotos().stream()
                    .map(photoUrl -> {
                        PhotosEntity photosEntity = PhotosEntity.builder()
                                .photoUrls(photoUrl)
                                .photoType(PhotoType.ACTOR)
                                .build();
                        ActorsPhotosEntity actorsPhotosEntity = ActorsPhotosEntity.builder()
                                .photos(photosEntity)
                                .actor(actorsEntity)
                                .build();
                        return actorsPhotosEntity;
                    })
                    .collect(Collectors.toList());

            actorsEntity.getActorPhotos().addAll(photoEntities); // 안전하게 추가
        }

        return actorsEntity;
    }

}