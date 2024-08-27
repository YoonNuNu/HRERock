package com.movie.rock.movie.data.response;

import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.RoleEnum;
import com.movie.rock.movie.data.entity.MovieReviewEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


public class  MovieReviewResponseDTO {

    @Getter
    @NoArgsConstructor
    public static class ReviewResponseDTO {

        private Long reviewId;
        private String reviewContent;
        private double reviewRating;
        private Long memNum;
        private String memName;
        private RoleEnum memRole;
        private String createDate;
        private String modifyDate;
        private MovieReviewAttractionPointsResponseDTO attractionPoints;
        private MovieReviewEmotionPointsResponseDTO emotionPoints;
        private String sortBy;
        private Long likesCount;


        @Builder
        public ReviewResponseDTO(Long reviewId, String reviewContent, double reviewRating, Long memNum, String memName,
                                 RoleEnum memRole, String createDate, String modifyDate,
                                 MovieReviewAttractionPointsResponseDTO attractionPoints,
                                 MovieReviewEmotionPointsResponseDTO emotionPoints,
                                 String sortBy) {
            this.reviewId = reviewId;
            this.reviewContent = reviewContent;
            this.reviewRating = reviewRating;
            this.memNum = memNum;
            this.memName = memName;
            this.memRole = memRole;
            this.createDate = createDate;
            this.modifyDate = modifyDate;
            this.attractionPoints = attractionPoints;
            this.emotionPoints = emotionPoints;
            this.sortBy = sortBy;
        }

        public static ReviewResponseDTO fromEntity(MovieReviewEntity review, MemberEntity member) {
            return ReviewResponseDTO.builder()
                    .reviewId(review.getReviewId())
                    .reviewContent(review.getReviewContent())
                    .reviewRating(review.getReviewRating())
                    .memNum(member.getMemNum())
                    .memName(member.getMemName())
                    .memRole(member.getMemRole())
                    .createDate(review.getCreateDate())
                    .modifyDate(review.getModifyDate())
                    .attractionPoints(MovieReviewAttractionPointsResponseDTO.fromEntity(review.getReviewAttractionPoints()))
                    .emotionPoints(MovieReviewEmotionPointsResponseDTO.fromEntity(review.getReviewEmotionPoints()))
                    .build();
        }

        public static ReviewResponseDTO fromEntityWithLikes(MovieReviewEntity review, MemberEntity member, Long likesCount) {
            ReviewResponseDTO dto = fromEntity(review, member);
            dto.likesCount = likesCount;
            return dto;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class ReviewPageResponseDTO {
        private List<ReviewResponseDTO> reviews;
        private ReviewResponseDTO ownReview;
        private int currentPage;
        private int startPage;
        private int endPage;
        private int totalPages;
        private boolean hasPrevious;
        private boolean hasNext;
        private List<Integer> pageNumbers;
        private long totalReviews;
        private double averageRating;
        private String sortBy;


        @Builder
        public ReviewPageResponseDTO(List<ReviewResponseDTO> reviews, ReviewResponseDTO ownReview, int currentPage,
                                     int startPage, int endPage, int totalPages, boolean hasPrevious, boolean hasNext,
                                     List<Integer> pageNumbers, long totalReviews, double averageRating, String sortBy) {
            this.reviews = reviews;
            this.ownReview = ownReview;
            this.currentPage = currentPage;
            this.startPage = startPage;
            this.endPage = endPage;
            this.totalPages = totalPages;
            this.hasPrevious = hasPrevious;
            this.hasNext = hasNext;
            this.pageNumbers = pageNumbers;
            this.totalReviews = totalReviews;
            this.averageRating = averageRating;
            this.sortBy = sortBy;
        }
    }
}
