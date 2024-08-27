package com.movie.rock.movie.data.request;

import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.movie.data.entity.MovieEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class MovieWatchHistoryRequestDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class MovieContinueWatchRequestDTO {
        private Long watchId;
        private Long watchTime;
//        private Long fileDuration;  //수정할 수 있음!!!!!!!!
        private Long totalDuration;
        private MovieEntity movie;
        private MemberEntity member;

        @Builder
        public MovieContinueWatchRequestDTO(Long watchId, Long watchTime, Long totalDuration, MovieEntity movie, MemberEntity member) {
            this.watchId = watchId;
            this.watchTime = watchTime;
            this.totalDuration = totalDuration;
            this.movie = movie;
            this.member = member;
//            this.fileDuration = fileDuration;
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class MovieWatchedRequestDTO {
        private Long watchId;
        private Long watchTime;
        //        private Long fileDuration;  //수정할 수 있음!!!!!!!!
        private Long totalDuration;
        private MovieEntity movie;
        private MemberEntity member;


        @Builder
        public MovieWatchedRequestDTO(Long watchId, Long watchTime, Long totalDuration, MovieEntity movie, MemberEntity member) {
            this.watchId = watchId;
            this.watchTime = watchTime;
            this.totalDuration = totalDuration;
            this.movie = movie;
            this.member = member;
        }
    }
}
