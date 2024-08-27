package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.TrailersEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminTrailerRequestDTO {

    private Long trailerId;
    private String trailerUrls;
    private boolean mainTrailer=false;  // 이 필드 추가

    @Builder
    private AdminTrailerRequestDTO(Long trailerId, String trailerUrls, boolean mainTrailer) {
        this.trailerId = trailerId;
        this.trailerUrls = trailerUrls;
        this.mainTrailer = mainTrailer;
    }

    public static TrailersEntity ofEntity(AdminTrailerRequestDTO dto) {
        return TrailersEntity.builder()
                .trailerId(dto.getTrailerId())
                .trailerUrls(dto.getTrailerUrls())
                .mainTrailer(dto.isMainTrailer())  // 이 부분 추가
                .build();
    }
}