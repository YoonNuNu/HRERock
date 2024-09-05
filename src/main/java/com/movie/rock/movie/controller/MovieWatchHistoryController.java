package com.movie.rock.movie.controller;

import com.movie.rock.common.CommonException.UnauthorizedAccessException;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.movie.data.request.MovieWatchHistoryRequestDTO;
import com.movie.rock.movie.service.MovieWatchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static com.movie.rock.movie.data.request.MovieWatchHistoryRequestDTO.*;
import static com.movie.rock.movie.data.response.MovieWatchHistoryResponseDTO.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class MovieWatchHistoryController {

    private final MovieWatchHistoryService movieWatchHistoryService;

    // 이어보기
    @GetMapping("/main/history/continue")
    public ResponseEntity<WatchHistoryListResponseDTO> getContinueWatchingMovies(@AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            throw new UnauthorizedAccessException(); // 인증되지 않은 경우 예외 처리
        }

        Long memNum = userDetails.getMemNum();
        WatchHistoryListResponseDTO responseDTO = movieWatchHistoryService.getContinueWatchingMovies(memNum);

        return ResponseEntity.ok(responseDTO);
    }

    // 최근 시청목록
    @GetMapping("/main/history/recent-Watched")
    public ResponseEntity<WatchHistoryListResponseDTO> getRecentWatchedMovies(@AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            throw new UnauthorizedAccessException(); // 인증되지 않은 경우 예외 처리
        }

        Long memNum = userDetails.getMemNum();
        WatchHistoryListResponseDTO responseDTO = movieWatchHistoryService.getRecentWatchedMovies(memNum);

        return ResponseEntity.ok(responseDTO);
    }

    // 재생률 업데이트
    @PostMapping("/movies/history/update-progress")
    public ResponseEntity<Void> updateWatchingProgress(
            @RequestBody MovieContinueWatchRequestDTO requestDTO,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        // 사용자 인증 확인
        if (userDetails == null) {
            throw new UnauthorizedAccessException();
        }

        Long memNum = userDetails.getMemNum();
        Long movieId = requestDTO.getMovie().getMovieId();
        Long watchId = requestDTO.getWatchId();
        Long watchTime = requestDTO.getWatchTime();
        Long totalDuration = requestDTO.getTotalDuration(); // totalDuration 추가

        try {
            // 서비스 레이어 호출
            movieWatchHistoryService.updateWatchingProgress(memNum, movieId, watchId, watchTime, totalDuration);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 오류 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
