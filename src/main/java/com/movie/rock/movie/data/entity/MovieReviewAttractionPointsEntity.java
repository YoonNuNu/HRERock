package com.movie.rock.movie.data.entity;

import com.movie.rock.movie.data.request.MovieReviewAttractionPointsRequestDTO;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "review_attraction_points")
public class MovieReviewAttractionPointsEntity {

    @Id
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "review_id")
    private MovieReviewEntity review;

    @Column(nullable = false)
    private boolean directingPoint; //감독 연출

    @Column(nullable = false)
    private boolean actingPoint; //배우견기

    @Column(nullable = false)
    private boolean visualPoint; //영상미

    @Column(nullable = false)
    private boolean storyPoint; //스토리

    @Column(nullable = false)
    private boolean ostPoint; //OST

    @Builder
    public MovieReviewAttractionPointsEntity(Long reviewId, boolean directingPoint, boolean actingPoint,
                                   boolean visualPoint, boolean storyPoint, boolean ostPoint) {
        this.reviewId = reviewId;
        this.directingPoint = directingPoint;
        this.actingPoint = actingPoint;
        this.visualPoint = visualPoint;
        this.storyPoint = storyPoint;
        this.ostPoint = ostPoint;
    }

    public static MovieReviewAttractionPointsEntity createFromDTO(MovieReviewAttractionPointsRequestDTO requestDTO, MovieReviewEntity review) {
        MovieReviewAttractionPointsEntity attractionPoints = MovieReviewAttractionPointsEntity.builder()
                .reviewId(review.getReviewId())
                .directingPoint(requestDTO.isDirectingPoint())
                .actingPoint(requestDTO.isActingPoint())
                .visualPoint(requestDTO.isVisualPoint())
                .storyPoint(requestDTO.isStoryPoint())
                .ostPoint(requestDTO.isOstPoint())
                .build();

        attractionPoints.assignReview(review);
        return attractionPoints;
    }

    public void update(MovieReviewAttractionPointsRequestDTO requestDTO) {
        this.directingPoint = requestDTO.isDirectingPoint();
        this.actingPoint = requestDTO.isActingPoint();
        this.visualPoint = requestDTO.isVisualPoint();
        this.storyPoint = requestDTO.isStoryPoint();
        this.ostPoint = requestDTO.isOstPoint();
    }

    void assignReview(MovieReviewEntity review) {
        this.review = review;
    }
}
