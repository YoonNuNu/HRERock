package com.movie.rock.movie.data.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MovieReviewEmotionPointsRequestDTO {

    private boolean stressReliefPoint = false; //스트레스 해소
    private boolean scaryPoint = false; //무서움
    private boolean realityPoint = false; //현실감
    private boolean immersionPoint = false; //몰입감
    private boolean tensionPoint = false; //긴장감

    @Builder
    public MovieReviewEmotionPointsRequestDTO(boolean stressReliefPoint, boolean scaryPoint, boolean realityPoint,
                                              boolean immersionPoint, boolean tensionPoint) {
        this.stressReliefPoint = stressReliefPoint;
        this.scaryPoint = scaryPoint;
        this.realityPoint = realityPoint;
        this.immersionPoint = immersionPoint;
        this.tensionPoint = tensionPoint;
    }

    //포인트가 비어있을 경우
    public static MovieReviewEmotionPointsRequestDTO createEmpty() {
        return new MovieReviewEmotionPointsRequestDTO();
    }
}
