package com.movie.rock.movie.service;

import com.movie.rock.common.CommonException.AttractionPointsNotFoundException;
import com.movie.rock.common.CommonException.EmotionPointsNotFoundException;
import com.movie.rock.movie.data.entity.MovieReviewAttractionPointsEntity;
import com.movie.rock.movie.data.entity.MovieReviewEmotionPointsEntity;
import com.movie.rock.movie.data.entity.MovieReviewEntity;
import com.movie.rock.movie.data.repository.MovieReviewAttractionPointsRepository;
import com.movie.rock.movie.data.repository.MovieReviewEmotionPointsRepository;
import com.movie.rock.movie.data.repository.MovieReviewRepository;
import com.movie.rock.movie.data.request.MovieReviewAttractionPointsRequestDTO;
import com.movie.rock.movie.data.request.MovieReviewEmotionPointsRequestDTO;
import com.movie.rock.movie.data.response.MovieReviewAttractionPointsResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewEmotionPointsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.movie.rock.common.CommonException.*;

@Service
@Transactional
@RequiredArgsConstructor
public class MovieReviewPointsServiceImpl implements MovieReviewPointsService {

    private final MovieReviewAttractionPointsRepository attractionPointsRepository;
    private final MovieReviewEmotionPointsRepository emotionPointsRepository;
    private final MovieReviewRepository movieReviewRepository;

    @Override
    public MovieReviewAttractionPointsResponseDTO getAttractionPoints(Long reviewId) {
        MovieReviewAttractionPointsEntity attractionPoints = attractionPointsRepository.findByReviewId(reviewId)
                .orElseThrow(AttractionPointsNotFoundException::new);
        return MovieReviewAttractionPointsResponseDTO.fromEntity(attractionPoints);
    }

    @Override
    public MovieReviewEmotionPointsResponseDTO getEmotionPoints(Long reviewId) {
        MovieReviewEmotionPointsEntity emotionPoints = emotionPointsRepository.findByReviewId(reviewId)
                .orElseThrow(EmotionPointsNotFoundException::new);
        return MovieReviewEmotionPointsResponseDTO.fromEntity(emotionPoints);
    }

    @Override
    public void saveReviewPoints(Long reviewId, MovieReviewAttractionPointsRequestDTO attractionPoints, MovieReviewEmotionPointsRequestDTO emotionPoints) {
        MovieReviewEntity review = movieReviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        MovieReviewAttractionPointsEntity attractionPointsEntity = MovieReviewAttractionPointsEntity.createFromDTO(attractionPoints, review);
        MovieReviewEmotionPointsEntity emotionPointsEntity = MovieReviewEmotionPointsEntity.createFromDTO(emotionPoints, review);

        attractionPointsRepository.save(attractionPointsEntity);
        emotionPointsRepository.save(emotionPointsEntity);
    }



    @Override
    public void updateReviewPoints(Long reviewId, MovieReviewAttractionPointsRequestDTO attractionPoints, MovieReviewEmotionPointsRequestDTO emotionPoints) {
        MovieReviewAttractionPointsEntity attractionEntity = attractionPointsRepository.findByReviewId(reviewId)
                .orElseThrow(AttractionPointsNotFoundException::new);
        MovieReviewEmotionPointsEntity emotionEntity = emotionPointsRepository.findByReviewId(reviewId)
                .orElseThrow(EmotionPointsNotFoundException::new);

        attractionEntity.update(attractionPoints);
        emotionEntity.update(emotionPoints);

        attractionPointsRepository.save(attractionEntity);
        emotionPointsRepository.save(emotionEntity);
    }
}
