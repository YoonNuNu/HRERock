package com.movie.rock.member.controller;


import com.movie.rock.member.data.MyPageFavorResponseDTO;
import com.movie.rock.member.data.MyPageReviewResponseDTO;
import com.movie.rock.member.data.MyPageWatchHistoryResponseDTO;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.member.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/mypage")
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;

    //마이페이지 찜하기 불러오기
    @GetMapping("/favor")
    public ResponseEntity<?> myPageFavor(
            @PageableDefault(sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails userDetails){

        Long memNum = userDetails.getMemNum();
        Page<MyPageFavorResponseDTO> favorList = myPageService.getFavoritesMovies(memNum, pageable);


        return ResponseEntity.ok().body(favorList);
    }

    //마이페이지 시청기록 가져오기
    @GetMapping("/history")
    public ResponseEntity<Page<MyPageWatchHistoryResponseDTO>> getWatchHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long memNum = userDetails.getMemNum();// userDetails에서 memNum을 추출하는 로직

        Pageable pageable = PageRequest.of(page, size, Sort.by("watchDate").descending());
        Page<MyPageWatchHistoryResponseDTO> watchHistory = myPageService.getMyPageWatchHistory(memNum, pageable);
        return ResponseEntity.ok(watchHistory);
    }


    //마이페이지 본인 리뷰 가져오기
    @GetMapping("/reviews")
    public ResponseEntity<Page<MyPageReviewResponseDTO>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Long memNum = userDetails.getMemNum();
        Page<MyPageReviewResponseDTO> reviews = myPageService.getMyReviews(memNum, pageable);
        return ResponseEntity.ok(reviews);
    }

    // 마이페이지 리뷰 삭제하기
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long memNum = userDetails.getMemNum();
        myPageService.deleteReview(reviewId, memNum);
        return ResponseEntity.ok().body(Map.of("message", "리뷰가 성공적으로 삭제되었습니다."));
    }
}


