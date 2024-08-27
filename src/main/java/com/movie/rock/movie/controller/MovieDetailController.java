package com.movie.rock.movie.controller;

import com.movie.rock.common.CommonException.UnauthorizedAccessException;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.movie.data.response.MovieDetailResponseDTO;
import com.movie.rock.movie.service.MovieDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user/movies") // USER와 ADMIN 모두 접근 가능
@RequiredArgsConstructor
public class MovieDetailController {

    private final MovieDetailService movieDetailService;

    @GetMapping("/detail/{movieId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")  //사용자 관리자 모두 접근가능
    public ResponseEntity<MovieDetailResponseDTO> showMovieDetail(@PathVariable("movieId") Long movieId,
                                                                  @AuthenticationPrincipal CustomUserDetails userDetails,
                                                                  @RequestParam(name = "reviewPage", defaultValue = "1") int reviewPage) {
        if (userDetails == null) {
            throw new UnauthorizedAccessException(); // 인증되지 않은 경우 예외 처리
        }

        Long memNum = userDetails.getMemNum();

        MovieDetailResponseDTO movieResponseDTO = movieDetailService.getMovieDetail(movieId, memNum);
        return ResponseEntity.ok(movieResponseDTO);
    }
}
