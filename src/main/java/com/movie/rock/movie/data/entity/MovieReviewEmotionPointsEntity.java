package com.movie.rock.movie.data.entity;

import com.movie.rock.movie.data.request.MovieReviewEmotionPointsRequestDTO;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "review_emotion_points")
public class MovieReviewEmotionPointsEntity {

    @Id
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "review_id")
    private MovieReviewEntity review;

    @Column(nullable = false)
    private boolean stressReliefPoint; //스트레스 해소

    @Column(nullable = false)
    private boolean scaryPoint; //무서움

    @Column(nullable = false)
    private boolean realityPoint; //현실감

    @Column(nullable = false)
    private boolean immersionPoint; //몰입감

    @Column(nullable = false)
    private boolean tensionPoint; //긴장감

    @Builder
    public MovieReviewEmotionPointsEntity(Long reviewId, boolean stressReliefPoint, boolean scaryPoint, boolean realityPoint,
                                          boolean immersionPoint, boolean tensionPoint) {
        this.reviewId = reviewId;
        this.stressReliefPoint = stressReliefPoint;
        this.scaryPoint = scaryPoint;
        this.realityPoint = realityPoint;
        this.immersionPoint = immersionPoint;
        this.tensionPoint = tensionPoint;
    }

    public static MovieReviewEmotionPointsEntity createFromDTO(MovieReviewEmotionPointsRequestDTO requestDTO, MovieReviewEntity review) {
        MovieReviewEmotionPointsEntity emotionPoints = MovieReviewEmotionPointsEntity.builder()
                .reviewId(review.getReviewId())
                .stressReliefPoint(requestDTO.isStressReliefPoint())
                .scaryPoint(requestDTO.isScaryPoint())
                .realityPoint(requestDTO.isRealityPoint())
                .immersionPoint(requestDTO.isImmersionPoint())
                .tensionPoint(requestDTO.isTensionPoint())
                .build();

        emotionPoints.assignReview(review);
        return emotionPoints;
    }

    public void update(MovieReviewEmotionPointsRequestDTO requestDTO) {
        this.stressReliefPoint = requestDTO.isStressReliefPoint();
        this.scaryPoint = requestDTO.isScaryPoint();
        this.realityPoint = requestDTO.isRealityPoint();
        this.immersionPoint = requestDTO.isImmersionPoint();
        this.tensionPoint = requestDTO.isTensionPoint();
    }

    void assignReview(MovieReviewEntity review) {
        this.review = review;
    }
}
