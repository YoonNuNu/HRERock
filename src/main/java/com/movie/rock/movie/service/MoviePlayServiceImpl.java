package com.movie.rock.movie.service;

import com.movie.rock.movie.data.entity.MovieFilmEntity;
import com.movie.rock.movie.data.entity.MovieWatchHistoryEntity;
import com.movie.rock.movie.data.repository.MovieFilmRepository;
import com.movie.rock.movie.data.repository.MovieWatchHistoryRepository;
import com.movie.rock.movie.data.response.MoviePlayResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import static com.movie.rock.common.CommonException.*;

@Service
@RequiredArgsConstructor
public class MoviePlayServiceImpl implements MoviePlayService {

    private final MovieFilmRepository movieFilmRepository;
    private final MovieWatchHistoryRepository movieWatchHistoryRepository;

    @Override
    public MoviePlayResponseDTO getMoviePlay(Long movieId, Long memNum) {
        MovieFilmEntity film = movieFilmRepository.findByMovieMovieId(movieId)
                .orElseThrow(MovieNotFoundException::new);

        MovieWatchHistoryEntity watchHistory = movieWatchHistoryRepository
                .findLatestByMemNumAndMovieId(memNum, movieId)
                .orElse(null);

        return MoviePlayResponseDTO.builder()
                .movieFilm(film.getMovieFilm())
                .watchTime(watchHistory != null ? watchHistory.getWatchTime() : 0L)
                .build();
    }
}
