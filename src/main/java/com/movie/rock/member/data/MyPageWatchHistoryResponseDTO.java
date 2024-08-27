package com.movie.rock.member.data;


import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MovieWatchHistoryEntity;
import com.movie.rock.movie.data.entity.PostersEntity;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class MyPageWatchHistoryResponseDTO {

    private Long watchId;
    private Long watchTime;
    private LocalDateTime watchDate;
    private Long movieId;
    private String movieTitle;
    private Long memNum;
    private PosterResponseDTO poster;
    //        private Long runtimeDuration;
    private Long totalDuration;


    @Builder
    public  MyPageWatchHistoryResponseDTO(Long watchId,Long watchTime,LocalDateTime watchDate,Long movieId,String movieTitle,
                                          Long memNum,Long posterId, String posterUrl, Boolean mainPoster,Long totalDuration) {
        this.watchId = watchId;
        this.watchTime = watchTime;
        this.watchDate = watchDate;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.memNum = memNum;
        this.poster = new PosterResponseDTO(posterId, posterUrl, mainPoster);
        //        this.runtimeDuration = runtimeDuration;
        this.totalDuration = totalDuration;
    }
}
