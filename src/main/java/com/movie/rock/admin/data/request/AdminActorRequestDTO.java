package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.ActorsEntity;
import com.movie.rock.movie.data.entity.ActorsPhotosEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class AdminActorRequestDTO {

    private Long actorId;
    private String actorName;
    private Integer actorBirth;
    private List<ActorsPhotosEntity> actorPhotos;

    //생성자
    public AdminActorRequestDTO(Long actorId,String actorName,Integer actorBirth,List<ActorsPhotosEntity> actorPhotos)
    {
        this.actorId =actorId;
        this.actorName = actorName;
        this.actorBirth = actorBirth;
        this.actorPhotos = actorPhotos;
    }

    //생성자에 넣을 데이터
    @Builder
    public static ActorsEntity ofEntity(AdminActorRequestDTO adminActorRequestDTO){
        return ActorsEntity.builder()
                .actorId(adminActorRequestDTO.getActorId())
                .actorName(adminActorRequestDTO.getActorName())
                .actorBirth(adminActorRequestDTO.getActorBirth())
                .actorPhotos(adminActorRequestDTO.getActorPhotos())
                .build();
    }
}
