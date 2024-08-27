package com.movie.rock.movie.service;

import com.movie.rock.common.CommonService;
import com.movie.rock.common.CommonException.MovieNotFoundException;
import com.movie.rock.common.CommonException.R_RatedCommonException;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.MemberRepository;
import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.repository.MovieRepository;
import com.movie.rock.movie.data.response.MovieDetailResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.movie.rock.common.CommonException.*;

@Service
@RequiredArgsConstructor
public class MovieDetailServiceImpl implements MovieDetailService {

    private final MovieRepository movieRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional(readOnly = true)
    public MovieDetailResponseDTO getMovieDetail(Long movieId, Long memNum) {
        MovieEntity movie = movieRepository.findByMovieId(movieId)
                .orElseThrow(MovieNotFoundException::new);

        MemberEntity member = memberRepository.findByMemNum(memNum)
                .orElseThrow(MemberNotFoundException::new);

        int age = CommonService.AgeCalculator.calcuateAge(member.getMemBirth());

        if (movie.getMovieRating().equals("청소년 관람 불가") && age < 19) {
            throw new R_RatedCommonException();
        }

        MovieDetailResponseDTO response = MovieDetailResponseDTO.fromEntity(movie);

        return MovieDetailResponseDTO.fromEntity(movie);
    }
}
