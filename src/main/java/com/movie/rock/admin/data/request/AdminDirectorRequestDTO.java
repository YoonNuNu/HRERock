package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.DirectorsEntity;
import com.movie.rock.movie.data.entity.DirectorsPhotosEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class AdminDirectorRequestDTO {

    private Long directorId;
    private String directorName;
    private Integer directorBirth;
    private List<DirectorsPhotosEntity> directorPhotos;

    //생성자
    public AdminDirectorRequestDTO(Long directorId, String directorName,
                                   Integer directorBirth, List<DirectorsPhotosEntity> directorPhotos){
        this.directorId = directorId;
        this.directorName = directorName;
        this.directorBirth =directorBirth;
        this.directorPhotos = directorPhotos;
    }

    //생성자에 넣을 데이터
    @Builder
    public static DirectorsEntity ofEntity(AdminDirectorRequestDTO adminDirectorRequestDTO){
        return DirectorsEntity.builder()
                .directorId(adminDirectorRequestDTO.getDirectorId())
                .directorName(adminDirectorRequestDTO.getDirectorName())
                .directorBirth(adminDirectorRequestDTO.getDirectorBirth())
                .directorPhotos(adminDirectorRequestDTO.getDirectorPhotos())
                .build();
    }
}
