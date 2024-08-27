package com.movie.rock.member.data;


import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MovieReviewEntity;
import com.movie.rock.movie.data.entity.PostersEntity;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewAttractionPointsResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewEmotionPointsResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MyPageReviewResponseDTO {

    private Long reviewId;
    private Long movieId;
    private String movieTitle;
    //    private Long posterId;    //영화 포스터
//    private String posterUrls;
    private PosterResponseDTO poster;
    private String reviewContent;
    private String createDate;
    private String modifyDate;
    private double reviewRating;
    private Long memNum;
    private MovieReviewEmotionPointsResponseDTO emotionPointsResponseDTO;
    private MovieReviewAttractionPointsResponseDTO attractionPointsResponseDTO;

    @Builder
    public MyPageReviewResponseDTO(Long reviewId, Long movieId, String movieTitle,Long posterId, String posterUrl, Boolean mainPoster, String reviewContent
            , String createDate, String modifyDate, double reviewRating, Long memNum,
                                   MovieReviewEmotionPointsResponseDTO emotionPointsResponseDTO, MovieReviewAttractionPointsResponseDTO attractionPointsResponseDTO) {
        this.reviewId = reviewId;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
//        this.posterId = posterId;
//        this.posterUrls = posterUrls;
        this.poster=new PosterResponseDTO(posterId, posterUrl, mainPoster);;
        this.reviewContent = reviewContent;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.reviewRating = reviewRating;
        this.memNum = memNum;
        this.emotionPointsResponseDTO = emotionPointsResponseDTO;
        this.attractionPointsResponseDTO = attractionPointsResponseDTO;
    }
}


