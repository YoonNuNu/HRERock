package com.movie.rock.movie.data.pk;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
public class MovieDirectorsPK implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "director_id")
    private Long directorId;

    //기본 생성자
    public MovieDirectorsPK() {}

    //복합 키 생성자
    public MovieDirectorsPK(Long movieId, Long directorId) {
        this.movieId = movieId;
        this.directorId = directorId;
    }

    // equals, hashCode 메서드를 재정의
    // 복합키 식별: 엔티티 간의 식별성과 비교를 보장하며, 데이터베이스에서의 일관성을 유지
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        MovieDirectorsPK that = (MovieDirectorsPK) o;
//        if (movieId != that.movieId) return false;
//        return directorId == that.directorId;
//    }
//
//    @Override
//    public int hashCode() {
//        int result = movieId;
//        result = 31 * result + directorId;
//        return result;
//    }
}
