package com.movie.rock.movie.service;

import com.movie.rock.common.CommonException.MemberNotFoundException;
import com.movie.rock.common.CommonException.MovieNotFoundException;
import com.movie.rock.common.CommonException.PostersByMovieNotFoundException;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.MemberRepository;
import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.MovieFavorEntity;
import com.movie.rock.movie.data.entity.PostersEntity;
import com.movie.rock.movie.data.repository.MovieFavorRepository;
import com.movie.rock.movie.data.repository.MoviePostersRepository;
import com.movie.rock.movie.data.repository.MovieRepository;
import com.movie.rock.movie.data.request.MovieFavorRequestDTO;
import com.movie.rock.movie.data.response.MovieFavorResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieFavorServiceImpl implements MovieFavorService {

    private static final Logger log = LoggerFactory.getLogger(MovieFavorServiceImpl.class);
    private final MovieFavorRepository movieFavorRepository;
    private final MovieRepository movieRepository;
    private final MoviePostersRepository moviePostersRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public MovieFavorResponseDTO addFavorites(Long memNum, MovieFavorRequestDTO movieFavorRequestDTO) {
        MovieEntity movie = movieRepository.findByMovieId(movieFavorRequestDTO.getMovieId())
                .orElseThrow(MovieNotFoundException::new);

        MemberEntity member = memberRepository.findByMemNum(memNum)
                .orElseThrow(MemberNotFoundException::new);

        if (!isFavoritedBy(movie.getMovieId(), memNum)) {
            MovieFavorEntity movieFavor = new MovieFavorEntity(member, movie);
            movieFavorRepository.save(movieFavor);
        }

        return getFavoritesStatus(memNum, movie.getMovieId());
    }

    @Override
    @Transactional
    public MovieFavorResponseDTO removeFavorites(Long memNum, Long movieId) {
        movieRepository.findByMovieId(movieId)
                .orElseThrow(MovieNotFoundException::new);

        movieFavorRepository.deleteByMemberMemNumAndMovieMovieId(memNum, movieId);

        return getFavoritesStatus(memNum, movieId);
    }

    @Override
    public List<MovieFavorResponseDTO> getFavoritesMovies(Long memNum) {
        List<MovieFavorEntity> favorites = movieFavorRepository.findByMemberMemNum(memNum);

        return favorites.stream()
                .map(favor -> getFavoritesStatus(memNum, favor.getMovie().getMovieId()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavoritedBy(Long movieId, Long memNum) {
        return movieFavorRepository.existsByMemberMemNumAndMovieMovieId(memNum, movieId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalFavoritesCount(Long movieId) {
        Long count = movieFavorRepository.countByMovieMovieId(movieId);
//        log.info("Total favorites count for movie {}: {}", movieId, count);
        return Math.max(0, count);
    }

    @Override
    public MovieFavorResponseDTO getFavoritesStatus(Long memNum, Long movieId) {
        MovieEntity movie = movieRepository.findByMovieId(movieId)
                .orElseThrow(MovieNotFoundException::new);
        MemberEntity member = memberRepository.findByMemNum(memNum)
                .orElseThrow(MemberNotFoundException::new);
        Boolean isFavorite = isFavoritedBy(movieId, memNum);
        Long totalFavorCount = getTotalFavoritesCount(movieId);

        PosterResponseDTO posterDTO = getMoviePoster(movie);

        return new MovieFavorResponseDTO(
                movie.getMovieId(),
                movie.getMovieTitle(),
                isFavorite,
                totalFavorCount,
                member.getMemNum()
        );
    }

    private PosterResponseDTO getMoviePoster(MovieEntity movie) {
        // 메인 포스터 찾기
        Optional<PostersEntity> mainPoster = movie.getPoster().stream()
                .map(mp -> mp.getPosters())
                .filter(poster -> poster != null && poster.getMainPoster())
                .findAny();

        // 메인 포스터가 있으면 반환, 없으면 아무 포스터나 반환
        return mainPoster
                .or(() -> movie.getPoster().stream()
                        .map(mp -> mp.getPosters())
                        .filter(poster -> poster != null)
                        .findAny())
                .map(poster -> new PosterResponseDTO(
                        poster.getPosterId(),
                        poster.getPosterUrls(),
                        poster.getMainPoster()
                ))
                .orElse(null);
    }
}