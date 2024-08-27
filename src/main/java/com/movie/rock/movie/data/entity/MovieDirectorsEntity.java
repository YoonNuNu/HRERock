package com.movie.rock.movie.data.entity;

import com.movie.rock.movie.data.pk.MovieDirectorsPK;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_directors")
public class MovieDirectorsEntity {

    @EmbeddedId //복합 키 클래스를 포함 EmbeddedId
    private MovieDirectorsPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("movieId") //복합 키의 각 필드에 매핑되는 외래 키를 지정
    @JoinColumn(name = "movie_id", referencedColumnName = "movie_id")
    private MovieEntity movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("directorId") //복합 키의 각 필드에 매핑되는 외래 키를 지정
    @JoinColumn(name = "director_id", referencedColumnName = "director_id")
    private DirectorsEntity director;

    @Builder
    public MovieDirectorsEntity(MovieEntity movie, DirectorsEntity director) {
        this.movie = movie;
        this.director = director;
        this.id = new MovieDirectorsPK(movie.getMovieId(), director.getDirectorId());
    }

    //연관관계설정
    public void setMovie(MovieEntity movie) {
        this.movie = movie;
        movie.getMovieDirectors().add(this);
    }
}
