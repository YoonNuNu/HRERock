package com.movie.rock.movie.data.entity;

import com.movie.rock.common.BaseTimeEntity;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.movie.data.request.MovieReviewAttractionPointsRequestDTO;
import com.movie.rock.movie.data.request.MovieReviewEmotionPointsRequestDTO;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reviews")
public class MovieReviewEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "review_content", nullable = false, length = 50)
    private String reviewContent;

    @Column(name = "review_rating", nullable = false)
    private double reviewRating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mem_num", nullable = false, updatable = false)
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false, updatable = false)
    private MovieEntity movie;

    @OneToOne(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private MovieReviewAttractionPointsEntity reviewAttractionPoints;

    @OneToOne(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private MovieReviewEmotionPointsEntity reviewEmotionPoints;

    @Builder
    private MovieReviewEntity(String reviewContent, double reviewRating, MemberEntity member, MovieEntity movie) {
        this.reviewContent = reviewContent;
        this.reviewRating = reviewRating;
        this.member = member;
        this.movie = movie;
    }

    public static MovieReviewEntity createWithPoints(String reviewContent, double reviewRating, MemberEntity member, MovieEntity movie,
                                                     MovieReviewAttractionPointsRequestDTO attractionPointsDTO, MovieReviewEmotionPointsRequestDTO emotionPointsDTO) {
        MovieReviewEntity review = new MovieReviewEntity(reviewContent, reviewRating, member, movie);

        review.addAttractionPoints(MovieReviewAttractionPointsEntity.createFromDTO(attractionPointsDTO, review));
        review.addEmotionPoints(MovieReviewEmotionPointsEntity.createFromDTO(emotionPointsDTO, review));

        return review;
    }

    public void update(String reviewContent, double reviewRating,
                       MovieReviewAttractionPointsRequestDTO attractionPointsDTO,
                       MovieReviewEmotionPointsRequestDTO emotionPointsDTO) {
        this.reviewContent = reviewContent;
        this.reviewRating = reviewRating;
        if (this.reviewAttractionPoints == null) {
            this.addAttractionPoints(MovieReviewAttractionPointsEntity.createFromDTO(attractionPointsDTO, this));
        } else {
            this.reviewAttractionPoints.update(attractionPointsDTO);
        }
        if (this.reviewEmotionPoints == null) {
            this.addEmotionPoints(MovieReviewEmotionPointsEntity.createFromDTO(emotionPointsDTO, this));
        } else {
            this.reviewEmotionPoints.update(emotionPointsDTO);
        }
    }

    private void addAttractionPoints(MovieReviewAttractionPointsEntity attractionPoints) {
        this.reviewAttractionPoints = attractionPoints;
        attractionPoints.assignReview(this);
    }

    private void addEmotionPoints(MovieReviewEmotionPointsEntity emotionPoints) {
        this.reviewEmotionPoints = emotionPoints;
        emotionPoints.assignReview(this);
    }

    // equals, hashCode 메서드를 재정의
    // 객체 비교, 저장
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        MovieReviewEntity that = (MovieReviewEntity) o;
//        return reviewId == that.reviewId;
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(reviewId);
//    }
}
