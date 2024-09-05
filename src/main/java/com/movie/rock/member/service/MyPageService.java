package com.movie.rock.member.service;


import com.movie.rock.member.data.*;
import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.repository.MovieFavorRepository;
import com.movie.rock.movie.data.repository.MovieReviewRepository;
import com.movie.rock.movie.data.repository.MovieWatchHistoryRepository;
import com.movie.rock.movie.data.response.MovieFavorResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewAttractionPointsResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewEmotionPointsResponseDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MyPageService {


    private final MovieReviewRepository movieReviewRepository;
    private final MovieFavorRepository movieFavorRepository;
    private final MovieWatchHistoryRepository movieWatchHistoryRepository;


    //마이페이지 찜한거 불러오기
    public Page<MyPageFavorResponseDTO> getFavoritesMovies(Long memNum, Pageable pageable) {

        Page<MovieFavorEntity> favoritesPage = movieFavorRepository.findByMemberMemNum(memNum, pageable);

        return movieFavorRepository.findFavoriteMoviesWithMainPoster(memNum, pageable);
    }

    //마이페이지 작성 리뷰 불러오기
    public Page<MyPageReviewResponseDTO> getMyReviews(Long memNum, Pageable pageable) {
        Page<Object[]> results = movieReviewRepository.findByMovieReviewMyPage(memNum, pageable);
        return results.map(this::convertToDTO);
    }

    private MyPageReviewResponseDTO convertToDTO(Object[] result) {
        MovieReviewEntity review = (MovieReviewEntity) result[0];
        MovieEntity movie = (MovieEntity) result[1];
        MoviePostersEntity moviePoster = (MoviePostersEntity) result[2];
        MovieReviewEmotionPointsEntity emotionPoints = (MovieReviewEmotionPointsEntity) result[3];
        MovieReviewAttractionPointsEntity attractionPoints = (MovieReviewAttractionPointsEntity) result[4];

        PostersEntity poster = moviePoster != null ? moviePoster.getPosters() : null;

        return new MyPageReviewResponseDTO(
                review.getReviewId(),
                movie.getMovieId(),
                movie.getMovieTitle(),
                poster != null ? poster.getPosterId() : null,
                poster != null ? poster.getPosterUrls() : null,
                poster != null ? poster.getMainPoster() : null,
                review.getReviewContent(),
                review.getCreateDate(),
                review.getModifyDate(),
                review.getReviewRating(),
                review.getMember().getMemNum(),
                emotionPoints != null ? MovieReviewEmotionPointsResponseDTO.fromEntity(emotionPoints) : null,
                attractionPoints != null ? MovieReviewAttractionPointsResponseDTO.fromEntity(attractionPoints) : null
        );
    }
    public Page<MyPageWatchHistoryResponseDTO> getMyPageWatchHistory(Long memNum, Pageable pageable) {
        Page<MovieWatchHistoryEntity> watchHistoryPage = movieWatchHistoryRepository.findAllByMemNumOrderByDateDescPaged(memNum, pageable);
        return watchHistoryPage.map(this::convertToMyPageWatchHistoryResponseDTO);
    }

    private MyPageWatchHistoryResponseDTO convertToMyPageWatchHistoryResponseDTO(MovieWatchHistoryEntity entity) {
        MovieEntity movie = entity.getMovie();
        MoviePostersEntity mainPoster = getMainPoster(movie);

        return MyPageWatchHistoryResponseDTO.builder()
                .watchId(entity.getWatchId())
                .watchTime(entity.getWatchTime())
                .watchDate(entity.getWatchDate())
                .movieId(movie.getMovieId())
                .movieTitle(movie.getMovieTitle())
                .memNum(entity.getMember().getMemNum())
                .posterId(mainPoster != null ? mainPoster.getPosters().getPosterId() : null)
                .posterUrl(mainPoster != null ? mainPoster.getPosters().getPosterUrls() : null)
                .mainPoster(mainPoster != null && mainPoster.getPosters().getMainPoster())
                .totalDuration(entity.getTotalDuration())
                .build();
    }

    private MoviePostersEntity getMainPoster(MovieEntity movie) {
        return movie.getPoster().stream()
                .filter(poster -> poster.getPosters().getMainPoster())
                .findFirst()
                .orElse(null);
    }

    // 리뷰 삭제 로직
    public void deleteReview(Long reviewId, Long memNum) {
        MovieReviewEntity review = movieReviewRepository.findByReviewIdAndMember_MemNum(reviewId, memNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않거나 접근 권한이 없습니다."));

        movieReviewRepository.delete(review);
    }

    // 시청 기록 삭제 로직
    public void deleteWatchHistory(Long watchId,Long memNum){
        movieWatchHistoryRepository.deleteByMemberMemNumAndWatchId(memNum, watchId);
    }
}
