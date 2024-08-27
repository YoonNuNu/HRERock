package com.movie.rock.movie.data.entity;

import com.movie.rock.common.BaseTimeEntity;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.movie.data.pk.ReviewLikesPK;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "review_likes")
public class ReviewLikesEntity extends BaseTimeEntity {

    @EmbeddedId
    private ReviewLikesPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("memNum")
    @JoinColumn(name = "mem_num", referencedColumnName = "mem_num")
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reviewId")
    @JoinColumn(name = "review_id", referencedColumnName = "review_id")
    private MovieReviewEntity review;

    @Builder
    public ReviewLikesEntity(MemberEntity member, MovieReviewEntity review) {
        this.member = member;
        this.review = review;
        this.id = new ReviewLikesPK(member.getMemNum(), review.getReviewId());
    }

    public void setReview(MovieReviewEntity review) {
        this.review = review;
        if (review != null && this.member != null) {
            this.id = new ReviewLikesPK(review.getReviewId(), this.member.getMemNum());
        }
    }

    public void setMember(MemberEntity member) {
        this.member = member;
        if (member != null && this.review != null) {
            this.id = new ReviewLikesPK(this.review.getReviewId(), member.getMemNum());
        }
    }
}
