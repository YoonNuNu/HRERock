package com.movie.rock.movie.service;

import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.movie.data.entity.MovieReviewEntity;
import com.movie.rock.movie.data.request.MovieReviewRequestDTO;
import com.movie.rock.movie.data.request.ReviewLikesRequestDTO;
import com.movie.rock.movie.data.response.ReviewLikesResponseDTO;

import java.util.List;

import static com.movie.rock.movie.data.response.MovieReviewResponseDTO.*;

public interface MovieReviewService {

    ReviewPageResponseDTO getMovieReviews(Long movieId, int page, MemberEntity member, String sortBy);

    ReviewResponseDTO createMovieReview(Long movieId, MovieReviewRequestDTO movieReviewRequestDTO, MemberEntity member);

    ReviewResponseDTO updateMovieReview(Long movieId, Long reviewId, MovieReviewRequestDTO requestDTO, MemberEntity member);

//    void deleteMovieReview(Long movieId, Long reviewId, MemberEntity member);

    Long getTotalReviews(Long movieId);

    double getAverageRating(Long movieId);

    MovieReviewServiceImpl.DeleteReviewResult deleteMovieReview(Long movieId, Long reviewId, MemberEntity member);

    //===================================================================<리뷰 좋아요>

    ReviewLikesResponseDTO addLikes(Long memNum, ReviewLikesRequestDTO reviewLikesRequestDTO);

    ReviewLikesResponseDTO removeLikes(Long memNum, Long reviewId);

    ReviewLikesResponseDTO getLikesStatus(Long memNum, Long reviewId);

//    List<ReviewLikesResponseDTO> getLikesReviews(Long memNum);

    boolean isLikedBy(Long memNum, Long reviewId);

    List<ReviewLikesResponseDTO> getLikesStatusForMovie(Long movieId, Long memNum);
}
