package com.movie.rock.movie.service;

import com.movie.rock.movie.data.response.MoviePlayResponseDTO;

public interface MoviePlayService {
    MoviePlayResponseDTO getMoviePlay(Long movieId, Long memNum);
}
