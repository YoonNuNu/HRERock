package com.movie.rock.movie.service;

import com.movie.rock.movie.data.request.MovieReviewAttractionPointsRequestDTO;
import com.movie.rock.movie.data.request.MovieReviewEmotionPointsRequestDTO;
//import com.movie.rock.movie.data.response.MovieReviewAttractionPointsRatioResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewAttractionPointsResponseDTO;
//import com.movie.rock.movie.data.response.MovieReviewEmotionPointsRatioResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewEmotionPointsResponseDTO;

public interface MovieReviewPointsService {

//    MovieReviewAttractionPointsRatioResponseDTO getAttractionPointRatios(Long movieId);
//
//    MovieReviewEmotionPointsRatioResponseDTO getEmotionPointRatios(Long movieId);

    MovieReviewAttractionPointsResponseDTO getAttractionPoints(Long reviewId);

    MovieReviewEmotionPointsResponseDTO getEmotionPoints(Long reviewId);

    void saveReviewPoints(Long reviewId, MovieReviewAttractionPointsRequestDTO attractionPoints, MovieReviewEmotionPointsRequestDTO emotionPoints);

    void updateReviewPoints(Long reviewId, MovieReviewAttractionPointsRequestDTO attractionPoints, MovieReviewEmotionPointsRequestDTO emotionPoints);
}
