package com.movie.rock.movie.service;

import com.movie.rock.movie.data.request.MovieFavorRequestDTO;
import com.movie.rock.movie.data.response.MovieFavorResponseDTO;

import java.util.List;

public interface MovieFavorService {

    MovieFavorResponseDTO addFavorites(Long memNum, MovieFavorRequestDTO movieFavorRequestDTO);

    MovieFavorResponseDTO removeFavorites(Long memNum, Long movieId);

    MovieFavorResponseDTO getFavoritesStatus(Long memNum, Long movieId);

    List<MovieFavorResponseDTO> getFavoritesMovies(Long memNum);

    Long getTotalFavoritesCount(Long movieId);

    boolean isFavoritedBy(Long movieId, Long memNum);
}
