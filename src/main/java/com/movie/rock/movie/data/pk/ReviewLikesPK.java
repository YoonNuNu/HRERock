package com.movie.rock.movie.data.pk;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
public class ReviewLikesPK implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "mem_num")
    private Long memNum;

    @Column(name = "review_id")
    private Long reviewId;

    //기본 생성자
    public ReviewLikesPK() {}

    //복합 키 생성자
    public ReviewLikesPK(Long memNum, Long reviewId) {
        this.memNum = memNum;
        this.reviewId = reviewId;
    }
}
