package com.movie.rock.movie.data.pk;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
public class MovieGenresPK implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "genre_id")
    private Long genreId;

    public MovieGenresPK() {}

    public MovieGenresPK(Long movieId, Long genreId) {
        this.movieId = movieId;
        this.genreId = genreId;
    }
    // equals, hashCode 메서드를 재정의
    // 복합키 식별: 엔티티 간의 식별성과 비교를 보장하며, 데이터베이스에서의 일관성을 유지
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        MovieGenresPK that = (MovieGenresPK) o;
//        return movieId == that.movieId && genreId == that.genreId;
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(movieId, genreId);
//    }
}
