package com.movie.rock.movie.data.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewLikesResponseDTO {

    private Long reviewId;
    private Long memNum;
    private boolean isLike;
    private int likeCount;

    public ReviewLikesResponseDTO(Long reviewId, Long memNum, boolean isLike, int likeCount) {
        this.reviewId = reviewId;
        this.memNum = memNum;
        this.isLike = isLike;
        this.likeCount = likeCount;
    }

    @Builder
    public static ReviewLikesResponseDTO fromEntity(Long reviewId, Long memNum, boolean isLike, int likeCount) {
        return ReviewLikesResponseDTO.builder()
                .reviewId(reviewId)
                .memNum(memNum)
                .isLike(isLike)
                .likeCount(likeCount)
                .build();
    }
}
