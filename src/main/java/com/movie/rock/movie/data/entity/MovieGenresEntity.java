package com.movie.rock.movie.data.entity;

import com.movie.rock.movie.data.pk.MovieGenresPK;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_genres")
public class MovieGenresEntity {

    @EmbeddedId
    private MovieGenresPK id;  // MovieActorsPK 대신 MovieGenresPK 사용

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("movieId")
    @JoinColumn(name = "movie_id")
    private MovieEntity movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("genreId")
    @JoinColumn(name = "genre_id")
    private GenresEntity genre;

    @Builder
    public MovieGenresEntity(MovieEntity movie, GenresEntity genre) {
        this.movie = movie;
        this.genre = genre;
        this.id = new MovieGenresPK(movie.getMovieId(), genre.getGenreId());
    }

    public void setMovie(MovieEntity movie) {
        this.movie = movie;
        // 복합 키(MovieActorsPK)를 생성합니다. 영화와 장르가 모두 설정된 경우에만 수행합니다.
        if (movie != null && genre != null) {
            this.id = new MovieGenresPK(movie.getMovieId(), genre.getGenreId());
        }
    }
}
