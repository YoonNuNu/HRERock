package com.movie.rock.admin.data.request;

import com.movie.rock.movie.data.entity.PostersEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminPosterRequestDTO {

    private Long posterId;
    private String posterUrls;
    private boolean mainPoster=false;  // 이 필드 추가

    @Builder
    private AdminPosterRequestDTO(Long posterId, String posterUrls, boolean mainPoster) {
        this.posterId = posterId;
        this.posterUrls = posterUrls;
        this.mainPoster = mainPoster;
    }

    public static PostersEntity ofEntity(AdminPosterRequestDTO dto) {
        return PostersEntity.builder()
                .posterId(dto.getPosterId())
                .posterUrls(dto.getPosterUrls())
                .mainPoster(dto.isMainPoster())  // 이 부분 추가
                .build();
    }
}