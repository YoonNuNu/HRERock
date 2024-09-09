package com.movie.rock.movie.controller;

import com.movie.rock.common.CommonException.UnauthorizedAccessException;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.movie.data.repository.MovieReviewEmotionPointsRepository;
import com.movie.rock.movie.data.request.MovieFavorRequestDTO;
import com.movie.rock.movie.data.request.MovieReviewRequestDTO;
import com.movie.rock.movie.data.request.ReviewLikesRequestDTO;
import com.movie.rock.movie.data.response.MovieReviewResponseDTO.ReviewPageResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewResponseDTO.ReviewResponseDTO;
import com.movie.rock.movie.data.response.ReviewLikesResponseDTO;
import com.movie.rock.movie.service.MovieReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/movies/detail")
@RequiredArgsConstructor
public class MovieReviewController {

    private final MovieReviewService movieReviewService;

    // 회원 확인
    private Long getMemNumFromAuthentication(Authentication authentication) {
        if (authentication.getPrincipal() instanceof UserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            return customUserDetails.getMemNum();
        } else {
            throw new UnauthorizedAccessException();
        }
    }

    // 리뷰 조회
    @GetMapping("/{movieId}/reviews")
    public ResponseEntity<ReviewPageResponseDTO> getMovieReviews(
            @PathVariable("movieId") Long movieId,
            @RequestParam(defaultValue = "1", name = "page") int page,
            @RequestParam(defaultValue = "latest", name = "sortBy") String sortBy,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        ReviewPageResponseDTO reviewPage = movieReviewService.getMovieReviews(movieId, page, member,sortBy);
        return ResponseEntity.ok(reviewPage);
    }

    // 리뷰 작성
    @PostMapping("/{movieId}/reviews")
    public ResponseEntity<ReviewResponseDTO> createMovieReview(
            @PathVariable("movieId") Long movieId,
            @Valid @RequestBody MovieReviewRequestDTO requestDTO,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        ReviewResponseDTO review = movieReviewService.createMovieReview(movieId, requestDTO, member);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    // 리뷰 수정
    @PutMapping("/{movieId}/reviews/{reviewId}")
    public ResponseEntity<ReviewResponseDTO> updateMovieReview(
            @PathVariable("movieId") Long movieId,
            @PathVariable("reviewId") Long reviewId,
            @Valid @RequestBody MovieReviewRequestDTO requestDTO,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        ReviewResponseDTO review = movieReviewService.updateMovieReview(movieId, reviewId, requestDTO, member);
        return ResponseEntity.ok(review);
    }

    //리뷰 삭제
    @DeleteMapping("/{movieId}/reviews/{reviewId}")
    public ResponseEntity<Void> deleteMovieReview(
            @PathVariable("movieId") Long movieId,
            @PathVariable("reviewId") Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        movieReviewService.deleteMovieReview(movieId, reviewId, member);
        return ResponseEntity.noContent().build();
    }

    // 리뷰 좋아요 활성화
    @PostMapping("/{movieId}/reviews/{reviewId}/likes")
    public ResponseEntity<ReviewLikesResponseDTO> addReviewLike(@RequestBody ReviewLikesRequestDTO requestDTO, Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        ReviewLikesResponseDTO responseDTO = movieReviewService.addLikes(memNum, requestDTO);

        return ResponseEntity.ok(responseDTO);
    }

    // 리뷰 좋아요 비활성화
    @DeleteMapping("/{movieId}/reviews/{reviewId}/likes")
    public ResponseEntity<ReviewLikesResponseDTO> removeReviewLike(@PathVariable("movieId") Long movieId,
                                                                   @PathVariable("reviewId") Long reviewId,
                                                                   Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        ReviewLikesResponseDTO responseDTO = movieReviewService.removeLikes(memNum, reviewId);

        return ResponseEntity.ok(responseDTO);
    }

    // 리뷰 좋아요 상태
    @GetMapping("/{movieId}/reviews/{reviewId}/likes")
    public ResponseEntity<ReviewLikesResponseDTO> getReviewLikeStatus(@PathVariable("movieId") Long movieId,
                                                                      @PathVariable("reviewId") Long reviewId,
                                                                      Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        ReviewLikesResponseDTO responseDTO = movieReviewService.getLikesStatus(memNum, reviewId);

        return ResponseEntity.ok(responseDTO);
    }

    // 리뷰 좋아요 갯수
    @GetMapping("/{movieId}/reviews/likes")
    public ResponseEntity<List<ReviewLikesResponseDTO>> getReviewLikes( @PathVariable("movieId") Long movieId,
                                                                        Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        List<ReviewLikesResponseDTO> likesReviews = movieReviewService.getLikesStatusForMovie(movieId, memNum);

        return ResponseEntity.ok(likesReviews);
    }
}

