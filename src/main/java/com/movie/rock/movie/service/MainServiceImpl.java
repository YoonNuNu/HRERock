package com.movie.rock.movie.service;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.repository.MainRepository;
import com.movie.rock.movie.data.response.MainResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    //출력갯수 설정
    private final MainRepository mainRepository;
    private static final int MINIMUM_REVIEWS = 5;
    private static final int TOP_TEN = 10;


    @Override
    public List<MainResponseDTO> getUpdatedMoviesWithTrailers() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        String thirtyDaysAgoString = thirtyDaysAgo.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        List<MainResponseDTO> updatedMoviesWithTrailers = mainRepository.findRecentMoviesWithin30days(thirtyDaysAgoString);
//        log.debug("Updated movies within 30 days: {}", updatedMoviesWithTrailers.size());

        if (updatedMoviesWithTrailers.isEmpty()) {
            Pageable pageable = PageRequest.of(0, TOP_TEN);
            updatedMoviesWithTrailers = mainRepository.findTop10ByOrderByMovieIdDesc(pageable);
//            log.debug("Top 5 recent movies: {}", recentMovies.size());
        }

        return updatedMoviesWithTrailers;
    }

    @Override
    public List<MainResponseDTO> getUpdatedMovies() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        String thirtyDaysAgoString = thirtyDaysAgo.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        List<MainResponseDTO> updatedMovies = mainRepository.findRecentMoviesWithin30days(thirtyDaysAgoString);
//        log.debug("Updated movies within 30 days: {}", updatedMovies.size());

        if (updatedMovies.isEmpty()) {
            Pageable pageable = PageRequest.of(0, TOP_TEN);
            updatedMovies = mainRepository.findTop10ByOrderByMovieIdDesc(pageable);
//            log.debug("Top 5 recent movies: {}", recentMovies.size());
        }

        return removeDuplicatePosters(updatedMovies);
    }

//    @Override
//    public List<MainResponseDTO> getTopRatedMovies(int limit) {
//        List<MovieEntity> allMovies = mainRepository.findAll();
//        double overallAverageRating = calculateOverallAverageRating(allMovies);
////        log.info("Overall average rating: {}", overallAverageRating);
//
//        return allMovies.stream()
//                .filter(movie -> movie.getReviews().size() >= MINIMUM_REVIEWS)
//                .map(movie -> createMainResponseDTO(movie, calculateIMDBScore(movie, overallAverageRating)))
//                .sorted(Comparator.comparingDouble(MainResponseDTO::getImdbScore).reversed())
//                .limit(limit)
//                .collect(Collectors.toList());
//    }

    @Override
    public List<MainResponseDTO> getTopRatedMovies() {
        Pageable pageable = PageRequest.of(0, TOP_TEN);
        List<MainResponseDTO> topRatedMovies = mainRepository.findTopRatedMovies(pageable);

        List<MainResponseDTO> sortedMovies = topRatedMovies.stream()
                .sorted(Comparator.comparingDouble(MainResponseDTO::getImdbScore).reversed())
                .limit(TOP_TEN)
                .collect(Collectors.toList());

        return removeDuplicatePosters(sortedMovies);
    }

    private List<MainResponseDTO> removeDuplicatePosters(List<MainResponseDTO> movies) {
        Map<Long, MainResponseDTO> uniqueMovies = new LinkedHashMap<>();
        for (MainResponseDTO movie : movies) {
//            log.debug("Movie: {}, Poster: {}", movie.getMovieId(), movie.getPoster());
            uniqueMovies.compute(movie.getMovieId(), (key, existingMovie) -> {
                if (existingMovie == null || (movie.getPoster() != null && movie.getPoster().getMainPoster())) {
                    return movie;
                }
                return existingMovie;
            });
        }
        return new ArrayList<>(uniqueMovies.values());
    }

    private double calculateOverallAverageRating(List<MovieEntity> movies) {
        return movies.stream()
                .filter(movie -> movie.getReviews().size() >= MINIMUM_REVIEWS)
                .mapToDouble(this::calculateMovieAverageRating)
                .average()
                .orElse(0.0);
    }

    private double calculateMovieAverageRating(MovieEntity movie) {
        return movie.getReviews().stream()
                .mapToDouble(review -> review.getReviewRating())
                .average()
                .orElse(0.0);
    }

    @Override
    public double calculateIMDBScore(MovieEntity movie, double averageRating) {
        int reviewCount = movie.getReviews().size();
        double movieRating = calculateMovieAverageRating(movie);

        return ((double) reviewCount / (reviewCount + MINIMUM_REVIEWS)) * movieRating
                + ((double) MINIMUM_REVIEWS / (reviewCount + MINIMUM_REVIEWS)) * averageRating;
    }

    private MainResponseDTO createMainResponseDTO(MovieEntity movie, double imdbScore) {
        return new MainResponseDTO(
                movie.getMovieId(),
                movie.getMovieTitle(),
                movie.getMovieDescription(),
                movie.getPoster().isEmpty() ? null : movie.getPoster().get(0).getPosters().getPosterId(),
                movie.getPoster().isEmpty() ? null : movie.getPoster().get(0).getPosters().getPosterUrls(),
                !movie.getPoster().isEmpty() && movie.getPoster().get(0).getPosters().getMainPoster(),
                movie.getTrailer().isEmpty() ? null : movie.getTrailer().get(0).getTrailers().getTrailerId(),
                movie.getTrailer().isEmpty() ? null : movie.getTrailer().get(0).getTrailers().getTrailerUrls(),
                !movie.getTrailer().isEmpty() && movie.getTrailer().get(0).getTrailers().getMainTrailer(),
                movie.getCreateDate(),
                imdbScore
        );
    }
}