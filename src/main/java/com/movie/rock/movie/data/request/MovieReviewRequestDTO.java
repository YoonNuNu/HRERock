package com.movie.rock.movie.data.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MovieReviewRequestDTO {

    @NotBlank
    @Size(max = 50, message = "리뷰는 50자 내로 작성해야 합니다.")
    private String reviewContent;

    @Min(1)
    @Max(5)
    private double reviewRating;

    private MovieReviewAttractionPointsRequestDTO attractionPoints;
    private MovieReviewEmotionPointsRequestDTO emotionPoints;

    @Builder
    public MovieReviewRequestDTO(String reviewContent, double reviewRating,
                                 MovieReviewAttractionPointsRequestDTO attractionPoints,
                                 MovieReviewEmotionPointsRequestDTO emotionPoints) {
        this.reviewContent = reviewContent;
        this.reviewRating = reviewRating;
        this.attractionPoints = attractionPoints;
        this.emotionPoints = emotionPoints;
    }
}
