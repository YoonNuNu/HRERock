package com.movie.rock.admin.data.request;

import com.movie.rock.movie.data.entity.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.parameters.P;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class AdminDirectorAddRequestDTO {

    private Long directorId;
    private String directorName;
    private Integer directorBirth;
    private List<String> directorPhotos;

    //생성자
    public AdminDirectorAddRequestDTO(Long directorId, String directorName,
                                      Integer directorBirth, List<String> directorPhotos){
        this.directorId = directorId;
        this.directorName = directorName;
        this.directorBirth =directorBirth;
        this.directorPhotos = directorPhotos;
    }

    //생성자에 넣을 데이터
    @Builder
    public static DirectorsEntity ofEntity(AdminDirectorAddRequestDTO adminDirectorAddRequestDTO) {
        DirectorsEntity directorsEntity = DirectorsEntity.builder()
                .directorId(adminDirectorAddRequestDTO.getDirectorId())
                .directorName(adminDirectorAddRequestDTO.getDirectorName())
                .directorBirth(adminDirectorAddRequestDTO.getDirectorBirth())
                .directorPhotos(new ArrayList<>())
                .build();

        if (adminDirectorAddRequestDTO.getDirectorPhotos() != null) {
            List<DirectorsPhotosEntity> photosEntities = adminDirectorAddRequestDTO.getDirectorPhotos().stream()
                    .map(photoUrl -> {
                        PhotosEntity photosEntity = PhotosEntity.builder()
                                .photoUrls(photoUrl)
                                .photoType(PhotoType.DIRECTOR)
                                .build();
                        DirectorsPhotosEntity directorsPhotosEntity = DirectorsPhotosEntity.builder()
                                .photos(photosEntity)
                                .director(directorsEntity)
                                .build();
                        return directorsPhotosEntity;
                    })
                    .collect(Collectors.toList());

            directorsEntity.getDirectorPhotos().addAll(photosEntities);
        }

        return directorsEntity;
    }
}