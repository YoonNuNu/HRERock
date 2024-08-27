package com.movie.rock.movie.data.entity;

import com.movie.rock.movie.data.pk.MovieActorsPK;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_actors")
public class MovieActorsEntity {

    @EmbeddedId //복합 키 클래스를 포함 EmbeddedId
    private MovieActorsPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("movieId") //복합 키의 각 필드에 매핑되는 외래 키를 지정
    @JoinColumn(name = "movie_id", referencedColumnName = "movie_id")
    private MovieEntity movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("actorId") //복합 키의 각 필드에 매핑되는 외래 키를 지정
    @JoinColumn(name = "actor_id", referencedColumnName = "actor_id")
    private ActorsEntity actor;

    @Builder
    public MovieActorsEntity(MovieEntity movie, ActorsEntity actor) {
        this.movie = movie;
        this.actor = actor;
        this.id = new MovieActorsPK(movie.getMovieId(), actor.getActorId());
    }

    //연관관계 설정
    public void setMovie(MovieEntity movie) {
        this.movie = movie;
        movie.getMovieActors().add(this);
    }
}
