package com.movie.rock.movie.data.entity;

import com.movie.rock.member.data.MemberEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_watch")
public class MovieWatchHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "watch_id")
    private Long watchId;

    @Column(name = "watch_time")
    private Long watchTime;

    @Column(name = "watch_date")
    private LocalDateTime watchDate;

    @Column(name = "total_duration")
    private Long totalDuration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mem_num", referencedColumnName = "mem_num")
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", referencedColumnName = "movie_id")
    private MovieEntity movie;

    @Builder
    public MovieWatchHistoryEntity(Long watchId, Long watchTime, LocalDateTime watchDate, Long totalDuration, MemberEntity member, MovieEntity movie) {
        this.watchId = watchId;
        this.watchTime = watchTime;
        this.totalDuration = totalDuration;
        this.watchDate = watchDate;
        this.member = member;
        this.movie = movie;
    }

    public MovieWatchHistoryEntity updateWatchTime(Long watchTime) {
        return MovieWatchHistoryEntity.builder()
                .watchTime(watchTime)
                .totalDuration(this.totalDuration)
                .member(this.member)
                .movie(this.movie)
                .build();
    }

    public MovieWatchHistoryEntity updateWatchTimeAndDate(Long watchTime, Long totalDuration) {
        this.watchTime = watchTime;
        this.watchDate = LocalDateTime.now();
        this.totalDuration = totalDuration;
        return this;
    }
}
