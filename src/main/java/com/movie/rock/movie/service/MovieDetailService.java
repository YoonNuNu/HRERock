package com.movie.rock.movie.service;

import com.movie.rock.movie.data.response.MovieDetailResponseDTO;

public interface MovieDetailService {
    MovieDetailResponseDTO getMovieDetail(Long movieId, Long memNum);
}
