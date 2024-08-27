package com.movie.rock.movie.data.response;

import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class MovieWatchHistoryResponseDTO {

    @Getter
    @NoArgsConstructor
    public static class WatchHistoryResponseDTO {
        private Long watchId;
        private Long watchTime;
        private LocalDateTime watchDate;
        private Long movieId;
        private String movieTitle;
        private PosterResponseDTO poster;
//        private Long runtimeDuration;
        private Long totalDuration;
        private double progressPercentage;
        private boolean isCompleted;

        @Builder
        public WatchHistoryResponseDTO(Long watchId, Long watchTime, LocalDateTime watchDate, Long movieId, String movieTitle,
                                       Long posterId, String posterUrl, Boolean mainPoster, Long totalDuration,
                                       double progressPercentage, boolean isCompleted) {
            this.watchId = watchId;
            this.watchTime = watchTime;
            this.watchDate = watchDate;
            this.movieId = movieId;
            this.movieTitle = movieTitle;
            this.poster = new PosterResponseDTO(posterId, posterUrl, mainPoster);
//            this.runtimeDuration = runtimeDuration; //필요없을 듯
            this.totalDuration = totalDuration;
            this.progressPercentage = progressPercentage;
            this.isCompleted = isCompleted;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class WatchHistoryListResponseDTO {
        private List<WatchHistoryResponseDTO> watchHistory;

        @Builder
        public WatchHistoryListResponseDTO(List<WatchHistoryResponseDTO> watchHistory) {
            this.watchHistory = watchHistory;
        }
    }
}
