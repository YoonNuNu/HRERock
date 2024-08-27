package com.movie.rock.movie.data.response;

import com.movie.rock.movie.data.entity.MovieReviewEmotionPointsEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MovieReviewEmotionPointsResponseDTO {

    private boolean stressReliefPoint; //스트레스 해소
    private boolean scaryPoint; //무서움
    private boolean realityPoint; //현실감
    private boolean immersionPoint; //몰입감
    private boolean tensionPoint; //긴장감

    @Builder(builderMethodName = "emotionPointsDTOBuilder")
    public MovieReviewEmotionPointsResponseDTO(boolean stressReliefPoint, boolean scaryPoint, boolean realityPoint,
                                               boolean immersionPoint, boolean tensionPoint) {
        this.stressReliefPoint = stressReliefPoint;
        this.scaryPoint = scaryPoint;
        this.realityPoint = realityPoint;
        this.immersionPoint = immersionPoint;
        this.tensionPoint = tensionPoint;
    }

    public static MovieReviewEmotionPointsResponseDTO fromEntity(MovieReviewEmotionPointsEntity entity) {
        return emotionPointsDTOBuilder()
                .stressReliefPoint(entity.isStressReliefPoint())
                .scaryPoint(entity.isScaryPoint())
                .realityPoint(entity.isRealityPoint())
                .immersionPoint(entity.isImmersionPoint())
                .tensionPoint(entity.isTensionPoint())
                .build();
    }
}
