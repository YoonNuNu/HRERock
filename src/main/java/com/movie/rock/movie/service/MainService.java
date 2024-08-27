package com.movie.rock.movie.service;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.response.MainResponseDTO;

import java.util.List;

public interface MainService {

//    List<MovieContinueWatchingResponseDTO> getContinueWatchingMoviesList(Long memNum);

    List<MainResponseDTO> getUpdatedMoviesWithTrailers();

    List<MainResponseDTO> getUpdatedMovies();

    double calculateIMDBScore(MovieEntity movie, double averageRating);

    List<MainResponseDTO> getTopRatedMovies();
}
