package com.movie.rock.pythonData.data;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PythonResponseDTO {
    private Long movieId;
    private String movieTitle;
    private PosterResponseDTO mainPosterUrl;

    @Builder
    public PythonResponseDTO(Long movieId, String movieTitle, PosterResponseDTO mainPosterUrl) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.mainPosterUrl = mainPosterUrl;
    }

    public static PythonResponseDTO fromEntity(MovieEntity movie) {
        return PythonResponseDTO.builder()
                .movieId(movie.getMovieId())
                .movieTitle(movie.getMovieTitle())
                .mainPosterUrl(movie.getPoster().stream()
                        .map(mp -> mp.getPosters())
                        .filter(p -> p != null)
                        .map(PosterResponseDTO::fromEntity)
                        .sorted((p1, p2) -> {
                            if(p1.getMainPoster() == p2.getMainPoster()) return 0;
                            if(p1.getMainPoster() == null) return 1;
                            if(p2.getMainPoster() == null) return -1;
                            return p2.getMainPoster().compareTo(p1.getMainPoster());
                        }).findFirst()
                        .orElse(null))
                .build();
    }
}
