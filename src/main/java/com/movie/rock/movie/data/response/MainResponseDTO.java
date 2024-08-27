package com.movie.rock.movie.data.response;

import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.TrailerResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class MainResponseDTO {
    //포스터, 제목, 줄거리, 장르, 런타임
    //트레일러 무비아이디
    private Long movieId;
    private String movieTitle;
    private String movieDescription;
    private PosterResponseDTO poster;
    private String createDate;
    private TrailerResponseDTO trailer;
    private double imdbScore;

    @Builder
    public MainResponseDTO(Long movieId, String movieTitle, String movieDescription, Long posterId, String posterUrl, Boolean mainPoster,
                           Long trailerId, String trailerUrl,Boolean mainTrailer, String createDate, double imdbScore) {

        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.movieDescription = movieDescription;
        this.poster = new PosterResponseDTO(posterId, posterUrl, mainPoster);
        this.trailer = new TrailerResponseDTO(trailerId, trailerUrl, mainTrailer);
        this.createDate = createDate;
        this.imdbScore = imdbScore;
    }

//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        MainResponseDTO that = (MainResponseDTO) o;
//        return Objects.equals(movieId, that.movieId);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(movieId);
//    }
}
