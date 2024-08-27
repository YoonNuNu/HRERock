package com.movie.rock.movie.data.entity;

import com.movie.rock.common.BaseTimeEntity;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.movie.data.pk.MovieFavorPK;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_favor")
public class MovieFavorEntity extends BaseTimeEntity {

    @EmbeddedId //복합 키 클래스를 포함 EmbeddedId
    private MovieFavorPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("memNum") //복합 키의 각 필드에 매핑되는 외래 키를 지정
    @JoinColumn(name = "mem_num", referencedColumnName = "mem_num")
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("movieId") //복합 키의 각 필드에 매핑되는 외래 키를 지정
    @JoinColumn(name = "movie_id", referencedColumnName = "movie_id")
    private MovieEntity movie;

    @Builder
    public MovieFavorEntity(MemberEntity member, MovieEntity movie) {
        this.member = member;
        this.movie = movie;
        this.id = new MovieFavorPK(member.getMemNum(), movie.getMovieId());
    }

    public void setMovie(MovieEntity movie) {
        this.movie = movie;
        if (movie != null) {
            this.id = new MovieFavorPK(this.member.getMemNum(), movie.getMovieId());
        }
    }

    public void setMember(MemberEntity member) {
        this.member = member;
        if (member != null && this.movie != null) {
            this.id = new MovieFavorPK(member.getMemNum(), this.movie.getMovieId());
        }
    }
}
