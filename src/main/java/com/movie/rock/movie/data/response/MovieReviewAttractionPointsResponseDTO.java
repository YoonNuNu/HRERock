package com.movie.rock.movie.data.response;

import com.movie.rock.movie.data.entity.MovieReviewAttractionPointsEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MovieReviewAttractionPointsResponseDTO {
    private boolean directingPoint; //감독 연출
    private boolean actingPoint; //배우견기
    private boolean visualPoint; //영상미
    private boolean storyPoint; //스토리
    private boolean ostPoint; //OST

    @Builder(builderMethodName = "attractionPointsDTOBuilder")
    public MovieReviewAttractionPointsResponseDTO(boolean directingPoint, boolean actingPoint, boolean visualPoint,
                                                  boolean storyPoint, boolean ostPoint) {
        this.directingPoint = directingPoint;
        this.actingPoint = actingPoint;
        this.visualPoint = visualPoint;
        this.storyPoint = storyPoint;
        this.ostPoint = ostPoint;
    }

    public static MovieReviewAttractionPointsResponseDTO fromEntity(MovieReviewAttractionPointsEntity entity) {
        return attractionPointsDTOBuilder()
                .directingPoint(entity.isDirectingPoint())
                .actingPoint(entity.isActingPoint())
                .visualPoint(entity.isVisualPoint())
                .storyPoint(entity.isStoryPoint())
                .ostPoint(entity.isOstPoint())
                .build();
    }
}
