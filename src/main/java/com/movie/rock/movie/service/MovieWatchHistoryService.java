package com.movie.rock.movie.service;

import com.movie.rock.movie.data.response.MovieWatchHistoryResponseDTO.WatchHistoryListResponseDTO;

import java.util.List;

import static com.movie.rock.movie.data.request.MovieWatchHistoryRequestDTO.*;

public interface MovieWatchHistoryService {

    WatchHistoryListResponseDTO getContinueWatchingMovies(Long memNum);

    WatchHistoryListResponseDTO getRecentWatchedMovies(Long memNum);

    void updateWatchingProgress(Long memNum, Long movieId, Long watchId, Long watchTIme, Long totalDuration);
}
