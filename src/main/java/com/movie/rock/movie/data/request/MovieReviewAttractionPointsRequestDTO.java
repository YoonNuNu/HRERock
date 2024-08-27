package com.movie.rock.movie.data.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MovieReviewAttractionPointsRequestDTO {

    private boolean directingPoint = false; //감독 연출
    private boolean actingPoint = false; //배우견기
    private boolean visualPoint = false; //영상미
    private boolean storyPoint = false; //스토리
    private boolean ostPoint = false; //OST

    @Builder
    public MovieReviewAttractionPointsRequestDTO(boolean directingPoint, boolean actingPoint, boolean visualPoint,
                                                 boolean storyPoint, boolean ostPoint) {
        this.directingPoint = directingPoint;
        this.actingPoint = actingPoint;
        this.visualPoint = visualPoint;
        this.storyPoint = storyPoint;
        this.ostPoint = ostPoint;
    }

    //포인트가 비어있을 경우
    public static MovieReviewAttractionPointsRequestDTO createEmpty() {
        return new MovieReviewAttractionPointsRequestDTO();
    }
}
