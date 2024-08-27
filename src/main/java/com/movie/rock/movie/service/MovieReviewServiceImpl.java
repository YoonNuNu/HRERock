package com.movie.rock.movie.service;

import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.MemberRepository;
import com.movie.rock.member.data.RoleEnum;
import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MovieReviewEntity;
import com.movie.rock.movie.data.entity.ReviewLikesEntity;
import com.movie.rock.movie.data.repository.MovieRepository;
import com.movie.rock.movie.data.repository.MovieReviewRepository;
import com.movie.rock.movie.data.repository.ReviewLikesRepository;
import com.movie.rock.movie.data.request.MovieReviewAttractionPointsRequestDTO;
import com.movie.rock.movie.data.request.MovieReviewEmotionPointsRequestDTO;
import com.movie.rock.movie.data.request.MovieReviewRequestDTO;
import com.movie.rock.movie.data.request.ReviewLikesRequestDTO;
import com.movie.rock.movie.data.response.MovieReviewResponseDTO.ReviewPageResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewResponseDTO.ReviewResponseDTO;
import com.movie.rock.movie.data.response.ReviewLikesResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.movie.rock.common.CommonException.*;

@Service
@Transactional
@RequiredArgsConstructor
public class MovieReviewServiceImpl implements MovieReviewService {

    private final MovieRepository movieRepository;
    private final MovieReviewRepository movieReviewRepository;
    private final MovieReviewPointsService movieReviewPointsService;
    private final ReviewLikesRepository reviewLikesRepository;
    private final MemberRepository memberRepository;

    //전체 리뷰 갯수
    @Override
    @Transactional(readOnly = true)
    public Long getTotalReviews(Long movieId) {
        return movieReviewRepository.countByMovieMovieId(movieId);
    }

    //영화별 리뷰 평균
    @Override
    @Transactional(readOnly = true)
    public double getAverageRating(Long movieId) {
        Double averageRating = movieReviewRepository.getAverageRatingForMovie(movieId);
        return averageRating != null ? averageRating : 0;
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewPageResponseDTO getMovieReviews(Long movieId, int page, MemberEntity member, String sortBy) {
        int pageSize = 5;

        // 전체 리뷰 수 계산 (본인 리뷰 포함)
        long totalReviews = movieReviewRepository.countByMovieMovieId(movieId);

        // 페이지 계산
        int totalPages = (int) Math.ceil((double) totalReviews / pageSize);

        List<ReviewResponseDTO> allReviews = new ArrayList<>();

        // 본인 리뷰 처리
        Optional<MovieReviewEntity> ownReviewOptional = movieReviewRepository.findByMovieMovieIdAndMemberMemNum(movieId, member.getMemNum());
        if (ownReviewOptional.isPresent()) {
            MovieReviewEntity ownReview = ownReviewOptional.get();
            long ownReviewLikesCount = reviewLikesRepository.countLikesByReviewId(ownReview.getReviewId());
            ReviewResponseDTO ownReviewDTO = ReviewResponseDTO.fromEntityWithLikes(ownReview, member, ownReviewLikesCount);
            allReviews.add(ownReviewDTO);
        }

        // 다른 사용자의 리뷰 가져오기
        List<Object[]> otherReviews;
        if ("likes".equals(sortBy)) {
            otherReviews = movieReviewRepository.findByMovieIdWithLikesCountOrderByLikesCountDesc(movieId, member.getMemNum());
        } else {
            otherReviews = movieReviewRepository.findByMovieIdWithLikesCountOrderByCreateDateDesc(movieId, member.getMemNum());
        }

        allReviews.addAll(otherReviews.stream()
                .map(array -> {
                    MovieReviewEntity review = (MovieReviewEntity) array[0];
                    Long likesCount = (Long) array[1];
                    return ReviewResponseDTO.fromEntityWithLikes(review, review.getMember(), likesCount);
                })
                .collect(Collectors.toList()));

        // 페이징 처리
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, allReviews.size());
        List<ReviewResponseDTO> pagedReviews = allReviews.subList(start, end);

        List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                .boxed().collect(Collectors.toList());

        return ReviewPageResponseDTO.builder()
                .reviews(pagedReviews)
                .currentPage(page)
                .pageNumbers(pageNumbers)
                .totalPages(totalPages)
                .hasPrevious(page > 1)
                .hasNext(page < totalPages)
                .totalReviews(totalReviews)
                .averageRating(getAverageRating(movieId))
                .sortBy(sortBy)
                .build();
    }

    //리뷰작성
    @Override
    public ReviewResponseDTO createMovieReview(Long movieId, MovieReviewRequestDTO requestDTO, MemberEntity member) {

        if(member == null) {
            throw new MemberNotFoundException();
        }

        if (movieReviewRepository.existsByMemberMemNumAndMovieMovieId(member.getMemNum(), movieId)) {
            throw new DuplicateReviewException();
        }

        if (requestDTO.getReviewContent().length() > 50) {
            throw new ExceedReviewCharacterException();
        }

        MovieEntity movie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        MovieReviewEntity review = MovieReviewEntity.createWithPoints(
                requestDTO.getReviewContent(),
                requestDTO.getReviewRating(),
                member,
                movie,
                requestDTO.getAttractionPoints(),
                requestDTO.getEmotionPoints()
        );

        MovieReviewEntity savedReview = movieReviewRepository.save(review);

        return ReviewResponseDTO.fromEntity(savedReview, member);
    }

    //리뷰수정
    @Override
    public ReviewResponseDTO updateMovieReview(Long movieId, Long reviewId, MovieReviewRequestDTO requestDTO, MemberEntity member) {
        MovieReviewEntity existingReview = movieReviewRepository.findByIdWithMemberAndMovie(movieId, reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        if (requestDTO.getReviewContent().length() > 50) {
            throw new ExceedReviewCharacterException();
        }

        if (!existingReview.getMember().getMemNum().equals(member.getMemNum())) {
            throw new UnauthorizedAccessException();
        }

        // 요청 DTO에 포인트 정보가 없으면 빈 값(모든 포인트가 false)으로 설정
        MovieReviewAttractionPointsRequestDTO attractionPoints = requestDTO.getAttractionPoints() != null ?
                requestDTO.getAttractionPoints() : MovieReviewAttractionPointsRequestDTO.createEmpty();
        MovieReviewEmotionPointsRequestDTO emotionPoints = requestDTO.getEmotionPoints() != null ?
                requestDTO.getEmotionPoints() : MovieReviewEmotionPointsRequestDTO.createEmpty();

        existingReview.update(
                requestDTO.getReviewContent(),
                requestDTO.getReviewRating(),
                attractionPoints,
                emotionPoints
        );

        MovieReviewEntity savedReview = movieReviewRepository.save(existingReview);

        return ReviewResponseDTO.fromEntity(savedReview, member);
    }

    //리뷰삭제
    @Override
    public DeleteReviewResult deleteMovieReview(Long movieId, Long reviewId, MemberEntity member) {
        MovieReviewEntity review = movieReviewRepository.findByIdWithMemberAndMovie(movieId, reviewId)
                .orElseThrow(ReviewNotFoundException::new);

//          삭제 권한 간단하게 한거
        if (member.getMemRole() != RoleEnum.ADMIN && !review.getMember().getMemNum().equals(member.getMemNum())) {
            throw new UnauthorizedAccessException();
        }

        // 리뷰와 관련된 모든 '좋아요' 삭제
        reviewLikesRepository.deleteByReviewReviewId(reviewId);

//        reviewLikesRepository.deleteByReviewReviewIdAndMemberMemNum(reviewId, member.getMemNum());
        movieReviewRepository.delete(review);
        // 삭제 후 현재 페이지의 리뷰 수 확인
        int pageSize = 5; // 페이지당 리뷰 수
        long totalReviews = movieReviewRepository.countByMovieMovieId(movieId);

        // 페이지 계산
        int currentPage = 1;
        if (totalReviews > 0) {
            currentPage = (int)(totalReviews / pageSize);
            if (totalReviews % pageSize > 0) {
                currentPage++;
            }
        }
        return new DeleteReviewResult(currentPage, totalReviews);
    }

    // 결과를 반환하기 위한 내부 클래스
    public static class DeleteReviewResult {
        public final int currentPage;
        public final long totalReviews;

        public DeleteReviewResult(int currentPage, long totalReviews) {
            this.currentPage = currentPage;
            this.totalReviews = totalReviews;
        }
    }

    @Override
    @Transactional
    public ReviewLikesResponseDTO addLikes(Long memNum, ReviewLikesRequestDTO reviewLikesRequestDTO) {
       MovieReviewEntity review = movieReviewRepository.findById(reviewLikesRequestDTO.getReviewId())
               .orElseThrow(ReviewNotFoundException::new);

       MemberEntity member = memberRepository.findByMemNum(memNum)
               .orElseThrow(MemberNotFoundException::new);

       if (!isLikedBy(memNum, review.getReviewId())) {
           ReviewLikesEntity reviewLikes = new ReviewLikesEntity(member,review);
           reviewLikesRepository.save(reviewLikes);
       }

        return getLikesStatus(memNum, review.getReviewId());
    }

    @Override
    @Transactional
    public ReviewLikesResponseDTO removeLikes(Long memNum, Long reviewId) {
        movieReviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        reviewLikesRepository.deleteByReviewReviewIdAndMemberMemNum(reviewId, memNum);

        return getLikesStatus(memNum, reviewId);
    }

    @Override
    public List<ReviewLikesResponseDTO> getLikesStatusForMovie(Long movieId, Long memNum) {
        List<MovieReviewEntity> reviews = movieReviewRepository.findByMovieMovieId(movieId);
        return reviews.stream()
                .map(review -> {
                    boolean isLiked = reviewLikesRepository.existsByReviewReviewIdAndMemberMemNum(review.getReviewId(), memNum);
                    int likeCount = reviewLikesRepository.countLikesByReviewId(review.getReviewId());
                    return new ReviewLikesResponseDTO(review.getReviewId(), memNum, isLiked, likeCount);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean isLikedBy(Long memNum, Long reviewId) {
        return reviewLikesRepository.existsByReviewReviewIdAndMemberMemNum(reviewId, memNum);
    }

    @Override
    public ReviewLikesResponseDTO getLikesStatus(Long memNum, Long reviewId) {
        MovieReviewEntity review = movieReviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);
        MemberEntity member = memberRepository.findByMemNum(memNum)
                .orElseThrow(MemberNotFoundException::new);
        boolean isLiked = isLikedBy(memNum, review.getReviewId());
        int likeCount = reviewLikesRepository.countLikesByReviewId(reviewId);

        return new ReviewLikesResponseDTO(
                review.getReviewId(),
                member.getMemNum(),
                isLiked,
                likeCount
        );
    }
}
