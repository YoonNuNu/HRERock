package com.movie.rock.movie.data.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewLikesRequestDTO {

    private Long reviewId;

    @Builder
    public ReviewLikesRequestDTO(Long reviewId) {
        this.reviewId = reviewId;
    }
}
