package com.movie.rock.movie.service;

import com.movie.rock.common.CommonException.MemberNotFoundException;
import com.movie.rock.common.CommonException.MovieNotFoundException;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.MemberRepository;
import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MoviePostersEntity;
import com.movie.rock.movie.data.entity.MovieWatchHistoryEntity;
import com.movie.rock.movie.data.repository.MovieRepository;
import com.movie.rock.movie.data.repository.MovieWatchHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.movie.rock.movie.data.response.MovieWatchHistoryResponseDTO.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieWatchHistoryServiceImpl implements MovieWatchHistoryService {

    private final MovieWatchHistoryRepository movieWatchHistoryRepository;
    private final MemberRepository memberRepository;
    private final MovieRepository movieRepository;

    private static final int DESC_SIZE = 10;

    @Override
    public WatchHistoryListResponseDTO getContinueWatchingMovies(Long memNum) {
        Pageable pageable = PageRequest.of(0, DESC_SIZE);
        List<MovieWatchHistoryEntity> watchHistoryList = movieWatchHistoryRepository.findUnfinishedByMemNumOrderByDateDesc(memNum, pageable);
//        log.info("Found {} continue watching movies for member: {}", watchHistoryList.size(), memNum);
        return createWatchHistoryListResponseDTO(watchHistoryList);
    }

    @Override
    public WatchHistoryListResponseDTO getRecentWatchedMovies(Long memNum) {
        Pageable pageable = PageRequest.of(0, DESC_SIZE);
        List<MovieWatchHistoryEntity> watchHistoryList = movieWatchHistoryRepository.findAllByMemNumOrderByDateDesc(memNum, pageable);
//        log.info("Found {} recent watched movies for member: {}", watchHistoryList.size(), memNum);
        return createWatchHistoryListResponseDTO(watchHistoryList);
    }


    @Override
    @Transactional
    public void updateWatchingProgress(Long memNum, Long movieId, Long watchId, Long watchTime, Long totalDuration) {
        MemberEntity member = memberRepository.findByMemNum(memNum)
                .orElseThrow(MemberNotFoundException::new);
        MovieEntity movie = movieRepository.findByMovieId(movieId)
                .orElseThrow(MovieNotFoundException::new);

        MovieWatchHistoryEntity watchHistory = movieWatchHistoryRepository
                .findLatestByMemNumAndMovieId(memNum, movieId)
                .orElse(null);

        if (watchHistory == null) {
            watchHistory = createNewWatchHistory(member, movie, watchId, watchTime, totalDuration);
        } else {
            watchHistory.updateWatchTimeAndDate(watchTime, totalDuration);
        }

        movieWatchHistoryRepository.save(watchHistory);
//        log.info("Watch history updated for member {} and movie {}: time = {}, totalDuration = {}",
//                memNum, movieId, watchTime, totalDuration);
    }

    private WatchHistoryListResponseDTO createWatchHistoryListResponseDTO(List<MovieWatchHistoryEntity> watchHistoryList) {
        List<WatchHistoryResponseDTO> dtoList = watchHistoryList.stream()
                .map(this::createWatchHistoryResponseDTO)
                .collect(Collectors.toList());
        return new WatchHistoryListResponseDTO(dtoList);
    }

    private MovieWatchHistoryEntity createNewWatchHistory(MemberEntity member, MovieEntity movie, Long watchId,Long watchTime, Long totalDuration) {
        return MovieWatchHistoryEntity.builder()
                .watchId(watchId)
                .watchTime(watchTime)
                .watchDate(LocalDateTime.now())
                .totalDuration(totalDuration)
                .member(member)
                .movie(movie)
                .build();
    }

    private WatchHistoryResponseDTO createWatchHistoryResponseDTO(MovieWatchHistoryEntity movieWatchHistoryEntity) {
        MovieEntity movie = movieWatchHistoryEntity.getMovie();

        // 메인 포스터 불러오기
        MoviePostersEntity mainPoster = movie.getPoster().stream()
                .filter(poster -> poster.getPosters().getMainPoster())
                .findFirst()
                .orElse(null);

        Long totalDuration = movieWatchHistoryEntity.getTotalDuration(); // 파일의 총 길이
        Long watchTime = movieWatchHistoryEntity.getWatchTime(); // 시청한 시간

        // 유효성 검사를 추가하여 계산 시 발생할 수 있는 오류를 방지합니다
        double progressPercentage = 0.0;
        boolean isCompleted = false;
        if (totalDuration != null && totalDuration > 0) {
            progressPercentage = (double) watchTime / totalDuration;
            isCompleted = progressPercentage >= 0.9; //90%이상이만 isCompleted
        }

//        log.info("Movie: {}, watchTime: {}, totalDuration: {}, progressPercentage: {}",
//                movie.getMovieTitle(), watchTime, totalDuration, progressPercentage);

        return WatchHistoryResponseDTO.builder()
                .watchId(movieWatchHistoryEntity.getWatchId())
                .watchTime(watchTime)
                .watchDate(movieWatchHistoryEntity.getWatchDate())
                .movieId(movie.getMovieId())
                .movieTitle(movie.getMovieTitle())
                .posterId(mainPoster != null ? mainPoster.getPosters().getPosterId() : null)
                .posterUrl(mainPoster != null ? mainPoster.getPosters().getPosterUrls() : null)
                .mainPoster(mainPoster != null && mainPoster.getPosters().getMainPoster())
                .totalDuration(totalDuration)
                .progressPercentage(progressPercentage)
                .isCompleted(isCompleted)
                .build();
    }

    private MovieWatchHistoryEntity updateExistingWatchHistory(MovieWatchHistoryEntity watchHistory, Long watchTime, Long totalDuration) {
        return watchHistory.updateWatchTimeAndDate(watchTime, totalDuration);
    }
}