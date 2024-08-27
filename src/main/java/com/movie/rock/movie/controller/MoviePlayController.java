package com.movie.rock.movie.controller;

import com.movie.rock.common.CommonException;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.movie.data.response.MoviePlayResponseDTO;
import com.movie.rock.movie.service.MoviePlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/movies")
@RequiredArgsConstructor
public class MoviePlayController {

    private final MoviePlayService moviePlayService;

    @GetMapping("/{movieId}/play")
    public ResponseEntity<MoviePlayResponseDTO> getMoviePlay(
            @PathVariable("movieId") Long movieId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            throw new CommonException.UnauthorizedAccessException(); // 인증되지 않은 경우 예외 처리
        }

        MoviePlayResponseDTO play = moviePlayService.getMoviePlay(movieId, userDetails.getMemNum());

        return ResponseEntity.ok(play);
    }
}
