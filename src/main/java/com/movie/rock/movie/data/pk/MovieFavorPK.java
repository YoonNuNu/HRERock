package com.movie.rock.movie.data.pk;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
public class MovieFavorPK implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "mem_num")
    private Long memNum;

    @Column(name = "movie_id")
    private Long movieId;

    //기본 생성자
    public MovieFavorPK() {}

    //복합 키 생성자
    public MovieFavorPK(Long memNum, Long movieId) {
        this.memNum = memNum;
        this.movieId = movieId;
    }

    // equals, hashCode 메서드를 재정의
    // 복합키 식별: 엔티티 간의 식별성과 비교를 보장하며, 데이터베이스에서의 일관성을 유지
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        MovieFavorPK that = (MovieFavorPK) o;
//        return Objects.equals(memNum, that.memNum) && movieId == that.movieId;
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(memNum, movieId);
//    }
}
