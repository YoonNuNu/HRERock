package com.movie.rock.admin.service;

import com.movie.rock.admin.data.AdminMovieListRepository;
import com.movie.rock.admin.data.request.*;
import com.movie.rock.admin.data.response.*;
import com.movie.rock.common.CommonException.DuplicateUrlException;
import com.movie.rock.common.CommonException.MovieNotFoundException;
import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.repository.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AdminMovieServiceImpl implements AdminMovieService {


    private final MovieRepository movieRepository;

    private final TrailersRepository trailersRepository;

    private final ActorsRepository actorsRepository;

    private final DirectorsRepository directorsRepository;

    private final GenresRepository genresRepository;

    private final AdminMovieListRepository adminMovieListRepository;

    private final PostersRepository postersRepository;

    private final MovieFilmRepository movieFilmRepository;

    private final MovieGenresRepository movieGenresRepository;

    private final MovieActorsRepository movieActorsRepository;

    private final MovieDirectorsRepository movieDirectorsRepository;

    private final MoviePostersRepository moviePostersRepository;

    private final MovieTrailersRepository movieTrailersRepository;

    private final ActorsPhotosRepository actorsPhotosRepository;

    private final DirectorsPhotosRepository directorsPhotosRepository;

    private final MovieReviewRepository movieReviewRepository;

    private final ReviewLikesRepository reviewLikesRepository;

    private final MovieReviewAttractionPointsRepository attractionPointsRepository;

    private final MovieReviewEmotionPointsRepository emotionPointsRepository;

    private final MovieWatchHistoryRepository movieWatchHistoryRepository;

    private final MovieFavorRepository movieFavorRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // 영화관리 페이징 조회
    @Override
    public Page<AdminMovieListResponseDTO> getMovieList(Pageable pageable) {
        // 페이징 처리된 모든 영화를 조회
        Page<MovieEntity> moviePage = movieRepository.findAll(pageable);
        // 각 영화 엔티티를 DTO로 변환하여 반환
        return moviePage.map(movie -> AdminMovieListResponseDTO.fromEntity(movie, movieWatchHistoryRepository));
    }

    // 영화 관리페이지 통합 검색
    @Override
    public Page<AdminMovieListResponseDTO> findByAllSearch(String searchTerm, Pageable pageable) {
        // 검색어를 이용해 영화를 검색
        Page<MovieEntity> result = adminMovieListRepository.findByAllSearch(searchTerm, pageable);
        // 검색 결과를 DTO로 변환하여 반환
        return result.map(movie -> AdminMovieListResponseDTO.fromEntity(movie, movieWatchHistoryRepository));
    }
    //영화 상세보기
    @Override
    public AdminMovieDetailsResponseDTO getMovieDetails(Long movieId) {
        // 주어진 ID로 영화를 찾음. 없으면 예외 발생
        MovieEntity findMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        // 찾은 영화 엔티티를 DTO로 변환하여 반환
        return AdminMovieDetailsResponseDTO.fromEntity(findMovie);
    }
    //영화 추가(첫번째 페이지 이름,아이디)
    @Override
    public AdminMovieFirstInfoTitleResponseDTO saveTitleInfo(AdminMovieFirstInfoTitleRequestDTO requestDTO) {
        MovieEntity movieEntity = MovieEntity.builder()
                .movieTitle(requestDTO.getMovieTitle())
                .build();

        MovieEntity savedEntity = movieRepository.save(movieEntity);
        return AdminMovieFirstInfoTitleResponseDTO.fromEntity(savedEntity);
    }

    // 영화 제목의 중복 여부를 확인 (현재는 항상 false를 반환하여 중복을 허용)
    @Override
    public boolean existsByTitle(String title) {
//        return movieRepository.existsByMovieTitle(title);
        return false;
    }

    // 감독, 배우, 장르 검색 기능
    @Override
    public Page<DirectorResponseDTO> searchDirectors(String query, Pageable pageable) {
        Page<DirectorsEntity> directorsPage = directorsRepository.findByDirectorNameContaining(query, pageable);
        return directorsPage.map(DirectorResponseDTO::fromEntity);
    }

    @Override
    public Page<ActorResponseDTO> searchActors(String query, Pageable pageable) {
        Page<ActorsEntity> actorsPage = actorsRepository.findByActorNameContaining(query, pageable);
        return actorsPage.map(ActorResponseDTO::fromEntity);
    }

    @Override
    public Page<GenreResponseDTO> searchGenres(String query, Pageable pageable) {
        Page<GenresEntity> genresPage = genresRepository.findByGenreNameContaining(query, pageable);
        return genresPage.map(GenreResponseDTO::fromEntity);
    }

    // 영화 ID로 첫 번째 정보 페이지의 데이터를 조회
    @Override
    public AdminMovieFirstInfoResponseDTO getMovieById(Long movieId) {
        // 데이터베이스에서 영화 엔티티를 조회합니다.
        MovieEntity movie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        // 조회한 영화 엔티티를 DTO로 변환하여 반환합니다.
        return AdminMovieFirstInfoResponseDTO.fromEntity(movie);
    }

    // 영화 ID로 두 번째 정보 페이지의 데이터를 조회
    @Override
    public AdminMovieSecondInfoResponseDTO getMovieByIdForSecondPage(Long movieId) {
        MovieEntity movie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        List<MovieTrailersEntity> trailers = movieTrailersRepository.findByMovieMovieId(movieId);
        List<MoviePostersEntity> posters = moviePostersRepository.findByMovieMovieId(movieId);

        // 포스터 처리
        List<PosterResponseDTO> sortedPosters = posters.stream()
                .map(p -> PosterResponseDTO.fromEntity(p.getPosters()))
                .sorted((p1, p2) -> Boolean.compare(
                        Optional.ofNullable(p2.getMainPoster()).orElse(false),
                        Optional.ofNullable(p1.getMainPoster()).orElse(false)
                ))
                .collect(Collectors.toList());

        // 메인 포스터가 없을 경우 첫 번째 포스터를 메인으로 설정
        if (sortedPosters.stream().noneMatch(p -> Boolean.TRUE.equals(p.getMainPoster())) && !sortedPosters.isEmpty()) {
            PosterResponseDTO firstPoster = sortedPosters.get(0);
            sortedPosters.set(0, new PosterResponseDTO(firstPoster.getPosterId(), firstPoster.getPosterUrls(), true));
        }

        // 트레일러 처리
        List<TrailerResponseDTO> sortedTrailers = trailers.stream()
                .map(t -> TrailerResponseDTO.fromEntity(t.getTrailers()))
                .sorted((t1, t2) -> Boolean.compare(
                        Optional.ofNullable(t2.getMainTrailer()).orElse(false),
                        Optional.ofNullable(t1.getMainTrailer()).orElse(false)
                ))
                .collect(Collectors.toList());

        // 메인 트레일러가 없을 경우 첫 번째 트레일러를 메인으로 설정
        if (sortedTrailers.stream().noneMatch(t -> Boolean.TRUE.equals(t.getMainTrailer())) && !sortedTrailers.isEmpty()) {
            TrailerResponseDTO firstTrailer = sortedTrailers.get(0);
            sortedTrailers.set(0, new TrailerResponseDTO(firstTrailer.getTrailerId(), firstTrailer.getTrailerUrls(), true));
        }

        return AdminMovieSecondInfoResponseDTO.builder()
                .movieId(movie.getMovieId())
                .movieTitle(movie.getMovieTitle())
                .trailer(sortedTrailers)
                .poster(sortedPosters)
                .movieFilm(FilmResponseDTO.fromEntity(movie.getMovieFilm()))
                .createDate(movie.getCreateDate())
                .modifyDate(movie.getModifyDate())
                .build();
    }




    // 영화의 첫 번째 정보 페이지 데이터를 저장
    @Override
    @Transactional
    public AdminMovieFirstInfoResponseDTO saveFirstInfo(Long movieId, AdminMovieFirstInfoRequestDTO dto) {
//        log.info("Received data for update: {}", dto);
        movieRepository.updateMovieInfo(
                movieId,
                dto.getMovieTitle(),
                dto.getRunTime(),
                dto.getOpenYear(),
                dto.getMovieRating(),
                dto.getMovieDescription()
        );

        MovieEntity updatedMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        // 관계 엔티티들 업데이트
        updateGenres(updatedMovie, dto.getMovieGenres());
        updateActors(updatedMovie, dto.getMovieActors());
        updateDirectors(updatedMovie, dto.getMovieDirectors());


        return AdminMovieFirstInfoResponseDTO.fromEntity(updatedMovie);
    }


    // 영화와 관련된 장르, 배우, 감독 정보를 업데이트
    private void updateGenres(MovieEntity movie, List<GenreResponseDTO> genreDTOs) {
        // 기존 장르 관계 삭제
        movieGenresRepository.deleteByMovieId(movie.getMovieId());

        if (genreDTOs != null) {
            for (GenreResponseDTO genreDto : genreDTOs) {
                GenresEntity genre = genresRepository.findById(genreDto.getGenreId())
                        .orElseThrow(() -> new RuntimeException("Genre not found with id: " + genreDto.getGenreId()));
                MovieGenresEntity movieGenre = new MovieGenresEntity(movie, genre);
                movieGenresRepository.save(movieGenre);
            }
        }
    }

    private void updateActors(MovieEntity movie, List<ActorResponseDTO> actorDTOs) {
        // 기존 배우 관계 삭제
        movieActorsRepository.deleteByMovieId(movie.getMovieId());

        if (actorDTOs != null) {
            for (ActorResponseDTO actorDto : actorDTOs) {
                ActorsEntity actor = actorsRepository.findById(actorDto.getActorId())
                        .orElseThrow(() -> new RuntimeException("Actor not found with id: " + actorDto.getActorId()));
                MovieActorsEntity movieActor = new MovieActorsEntity(movie, actor);
                movieActorsRepository.save(movieActor);
            }
        }
    }

    private void updateDirectors(MovieEntity movie, List<DirectorResponseDTO> directorDTOs) {
        // 기존 감독 관계 삭제
        movieDirectorsRepository.deleteByMovieId(movie.getMovieId());

        if (directorDTOs != null) {
            for (DirectorResponseDTO directorDto : directorDTOs) {
                DirectorsEntity director = directorsRepository.findById(directorDto.getDirectorId())
                        .orElseThrow(() -> new RuntimeException("Director not found with id: " + directorDto.getDirectorId()));
                MovieDirectorsEntity movieDirector = new MovieDirectorsEntity(movie, director);
                movieDirectorsRepository.save(movieDirector);
            }
        }
    }


    // 영화의 모든 정보를 저장(두 번째 페이지 정보 포함)
    @Override
    @Transactional
    public AdminMovieSecondInfoResponseDTO addCompleteMovie(AdminMovieSecondInfoRequestDTO requestDTO) {
//        log.info("Adding complete movie with ID: {}", requestDTO.getMovieId());
        MovieEntity movie = movieRepository.findById(requestDTO.getMovieId())
                .orElseThrow(MovieNotFoundException::new);
        MovieFilmEntity savedMovieFilm = null;
        // 영화 파일 정보 업데이트
        if (requestDTO.getMovieFilm() != null) {
            MovieFilmEntity movieFilm = MovieFilmEntity.builder()
                    .movieFilm(requestDTO.getMovieFilm().getMovieFilm())
                    .movie(movie)
                    .build();
            savedMovieFilm = movieFilmRepository.save(movieFilm);
//            log.info("Saved movie film: {}", movieFilm);
        }

        // 트레일러 정보 저장
        if (requestDTO.getTrailer() != null && !requestDTO.getTrailer().isEmpty()) {
            boolean hasMainTrailer = false;
            for (TrailersEntity trailerDTO : requestDTO.getTrailer()) {
                if (trailerDTO.getTrailerUrls() != null && !trailerDTO.getTrailerUrls().trim().isEmpty()) {
                    if (trailerDTO.getMainTrailer()) {
                        if (hasMainTrailer) {
                            throw new IllegalArgumentException("Only one main trailer is allowed");
                        }
                        hasMainTrailer = true;
                    }

                    TrailersEntity trailer = new TrailersEntity(null, trailerDTO.getTrailerUrls(), trailerDTO.getMainTrailer());
                    TrailersEntity savedTrailer = trailersRepository.save(trailer);

                    MovieTrailersEntity movieTrailer = new MovieTrailersEntity(savedTrailer, movie);
                    movieTrailersRepository.save(movieTrailer);
//                    log.info("Saved trailer: {}", savedTrailer);
                }
            }
        }

        // 포스터 정보 저장
        if (requestDTO.getPoster() != null && !requestDTO.getPoster().isEmpty()) {
            boolean hasMainPoster = false;
            for (PostersEntity posterDTO : requestDTO.getPoster()) {
                if (posterDTO.getPosterUrls() != null && !posterDTO.getPosterUrls().trim().isEmpty()) {
                    if (posterDTO.getMainPoster()) {
                        if (hasMainPoster) {
                            throw new IllegalArgumentException("Only one main poster is allowed");
                        }
                        hasMainPoster = true;
                    }

                    PostersEntity poster = new PostersEntity(null, posterDTO.getPosterUrls(), posterDTO.getMainPoster());
                    PostersEntity savedPoster = postersRepository.save(poster);

                    MoviePostersEntity moviePoster = new MoviePostersEntity(savedPoster, movie);
                    moviePostersRepository.save(moviePoster);
//                    log.info("Saved poster: {}", savedPoster);
                }
            }
        }

        MovieEntity savedMovie = movieRepository.save(movie);

        List<MovieTrailersEntity> updatedTrailers = movieTrailersRepository.findByMovieMovieId(savedMovie.getMovieId());
        List<MoviePostersEntity> updatedPosters = moviePostersRepository.findByMovieMovieId(savedMovie.getMovieId());

        return AdminMovieSecondInfoResponseDTO.fromEntity(savedMovie, updatedTrailers, updatedPosters, savedMovieFilm);
    }

    //배우 추가
    @Override
    public ActorResponseDTO addActor(AdminActorAddRequestDTO adminActorAddRequestDTO) {
        // 중복 URL 검사 (배우 사진 URL끼리만 비교)
        List<String> duplicateUrls = adminActorAddRequestDTO.getActorPhotos().stream()
                .filter(url -> actorsPhotosRepository.existsByPhotosPhotoUrls(url))
                .collect(Collectors.toList());

        if (!duplicateUrls.isEmpty()) {
            throw new DuplicateUrlException();
        }

        // 배우 추가 로직
        ActorsEntity actorsEntity = AdminActorAddRequestDTO.ofEntity(adminActorAddRequestDTO);
        actorsEntity = actorsRepository.save(actorsEntity);
        return ActorResponseDTO.fromEntity(actorsEntity);
    }


    //감독 추가
    @Override
    public DirectorResponseDTO addDirector(AdminDirectorAddRequestDTO adminDirectorAddRequestDTO) {
        // 중복 URL 검사 (감독 사진 URL끼리만 비교)
        List<String> duplicateUrls = adminDirectorAddRequestDTO.getDirectorPhotos().stream()
                .filter(url -> directorsPhotosRepository.existsByPhotosPhotoUrls(url))
                .collect(Collectors.toList());

        if (!duplicateUrls.isEmpty()) {
            throw new DuplicateUrlException();
        }

        DirectorsEntity directorsEntity = AdminDirectorAddRequestDTO.ofEntity(adminDirectorAddRequestDTO);
        directorsEntity = directorsRepository.save(directorsEntity);
        return DirectorResponseDTO.fromEntity(directorsEntity);
    }

    //장르 추가
    @Override
    public GenreResponseDTO addGenre(AdminGenreRequestDTO adminGenreRequestDTO) {
        GenresEntity genresEntity = AdminGenreRequestDTO.ofEntity(adminGenreRequestDTO);

        genresEntity = genresRepository.save(genresEntity);
        return GenreResponseDTO.fromEntity(genresEntity);
    }

    //예고편 추가
    @Override
    public TrailerResponseDTO addTrailer(AdminTrailerRequestDTO adminTrailerRequestDTO) {
        TrailersEntity movieTrailersEntity = AdminTrailerRequestDTO.ofEntity(adminTrailerRequestDTO);

        movieTrailersEntity = trailersRepository.save(movieTrailersEntity);
        return TrailerResponseDTO.fromEntity(movieTrailersEntity);
    }

    //포스터 추가
    @Override
    public PosterResponseDTO addPoster(AdminPosterRequestDTO adminPosterRequestDTO) {
        PostersEntity moviePostersEntity = AdminPosterRequestDTO.ofEntity(adminPosterRequestDTO);

        moviePostersEntity = postersRepository.save(moviePostersEntity);
        return PosterResponseDTO.fromEntity(moviePostersEntity);
    }

    // 영화의 첫 번째 정보 페이지 데이터를 업데이트
    @Override
    @Transactional
    public AdminMovieFirstInfoResponseDTO updateMovieFirst(Long movieId, AdminMovieFirstInfoRequestDTO dto) {
//        log.info("Updating movie with ID: {}", movieId);
//        log.info("DTO data: {}", dto);

        movieRepository.updateMovieInfo(
                movieId,
                dto.getMovieTitle(),
                dto.getRunTime(),
                dto.getOpenYear(),
                dto.getMovieRating(),
                dto.getMovieDescription()
        );

        // Update relationships
        MovieEntity existingMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);
        updateGenres(existingMovie, dto.getMovieGenres());
        updateActors(existingMovie, dto.getMovieActors());
        updateDirectors(existingMovie, dto.getMovieDirectors());

//        log.info("Movie updated: {}", existingMovie);

        return AdminMovieFirstInfoResponseDTO.fromEntity(existingMovie);
    }


    // 영화의 두 번째 정보 페이지 데이터를 업데이트
    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Override
    public AdminMovieSecondInfoResponseDTO updateMovieSecond(Long movieId, AdminMovieSecondInfoUpdateRequestDTO dto) {
        MovieEntity existingMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        // 영화 제목 업데이트
        movieRepository.updateMovieTitle(movieId, dto.getMovieTitle());

        // 영화 파일 정보 업데이트
        MovieFilmEntity updatedMovieFilm = updateMovieFilm(movieId, dto.getMovieFilm());

        // 트레일러 업데이트
        List<MovieTrailersEntity> updatedTrailers = updateTrailers(existingMovie, dto.getTrailer());

        // 포스터 업데이트
        List<MoviePostersEntity> updatedPosters = updatePosters(existingMovie, dto.getPoster());

        // 변경된 엔티티 다시 조회
        MovieEntity updatedMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        return AdminMovieSecondInfoResponseDTO.fromEntity(updatedMovie, updatedTrailers, updatedPosters, updatedMovieFilm);
    }


    private MovieFilmEntity updateMovieFilm(Long movieId, FilmResponseDTO filmResponseDTO) {
        Optional<MovieFilmEntity> existingFilm = movieFilmRepository.findByMovieMovieId(movieId);

        if (filmResponseDTO != null && filmResponseDTO.getMovieFilm() != null && !filmResponseDTO.getMovieFilm().isEmpty()) {
            if (existingFilm.isPresent()) {
                // 기존 엔티티가 있으면 새로운 엔티티를 생성하여 URL만 업데이트
                MovieFilmEntity updatedFilm = MovieFilmEntity.builder()
                        .filmId(existingFilm.get().getFilmId())
                        .movieFilm(filmResponseDTO.getMovieFilm())
                        .movie(existingFilm.get().getMovie())
                        .build();
                return movieFilmRepository.save(updatedFilm);
            } else {
                // 기존 엔티티가 없으면 새로 생성
                MovieEntity movie = movieRepository.findById(movieId)
                        .orElseThrow(MovieNotFoundException::new);
                MovieFilmEntity newMovieFilm = MovieFilmEntity.builder()
                        .movieFilm(filmResponseDTO.getMovieFilm())
                        .movie(movie)
                        .build();
                return movieFilmRepository.save(newMovieFilm);
            }
        } else if (existingFilm.isPresent()) {
            // 새로운 데이터가 없고 기존 데이터가 있으면 삭제
            movieFilmRepository.delete(existingFilm.get());
        }

        return null;
    }
    private List<MovieTrailersEntity> updateTrailers(MovieEntity movie, List<TrailerResponseDTO> trailerDTOs) {
        List<MovieTrailersEntity> existingTrailers = movieTrailersRepository.findByMovieMovieId(movie.getMovieId());

        for (MovieTrailersEntity existingTrailer : existingTrailers) {
            movieTrailersRepository.delete(existingTrailer);
            trailersRepository.delete(existingTrailer.getTrailers());
        }

        entityManager.flush();
        entityManager.clear();

        List<MovieTrailersEntity> updatedTrailers = new ArrayList<>();
        if (trailerDTOs != null && !trailerDTOs.isEmpty()) {
            for (TrailerResponseDTO trailerDTO : trailerDTOs) {
                if (trailerDTO.getTrailerUrls() != null && !trailerDTO.getTrailerUrls().trim().isEmpty()) {
                    TrailersEntity newTrailer = TrailersEntity.builder()
                            .trailerUrls(trailerDTO.getTrailerUrls())
                            .mainTrailer(trailerDTO.getMainTrailer())
                            .build();
                    TrailersEntity savedTrailer = trailersRepository.save(newTrailer);
                    MovieTrailersEntity movieTrailer = new MovieTrailersEntity(savedTrailer, movie);
                    updatedTrailers.add(movieTrailersRepository.save(movieTrailer));
                }
            }
        }
        return updatedTrailers;
    }
    private List<MoviePostersEntity> updatePosters(MovieEntity movie, List<PosterResponseDTO> posterDTOs) {
        List<MoviePostersEntity> existingPosters = moviePostersRepository.findByMovieMovieId(movie.getMovieId());

        for (MoviePostersEntity existingPoster : existingPosters) {
            moviePostersRepository.delete(existingPoster);
            postersRepository.delete(existingPoster.getPosters());
        }

        entityManager.flush();
        entityManager.clear();

        List<MoviePostersEntity> updatedPosters = new ArrayList<>();
        if (posterDTOs != null && !posterDTOs.isEmpty()) {
            for (PosterResponseDTO posterDTO : posterDTOs) {
                if (posterDTO.getPosterUrls() != null && !posterDTO.getPosterUrls().trim().isEmpty()) {
                    PostersEntity newPoster = PostersEntity.builder()
                            .posterUrls(posterDTO.getPosterUrls())
                            .mainPoster(posterDTO.getMainPoster())
                            .build();
                    PostersEntity savedPoster = postersRepository.save(newPoster);
                    MoviePostersEntity moviePoster = new MoviePostersEntity(savedPoster, movie);
                    updatedPosters.add(moviePostersRepository.save(moviePoster));
                }
            }
        }
        return updatedPosters;
    }

    //삭제
    @Override
    @Transactional
    public void deleteMovies(List<Long> movieIds, List<Long> posterIds, List<Long> trailerIds,List<Long> reviewIds) {
        for (Long movieId : movieIds) {
            // 연관된 엔티티들을 먼저 삭제
            movieTrailersRepository.deleteByMovie_MovieId(movieId);
            moviePostersRepository.deleteByMovie_MovieId(movieId);
            movieGenresRepository.deleteByMovieId(movieId);
            movieActorsRepository.deleteByMovieId(movieId);
            movieDirectorsRepository.deleteByMovieId(movieId);
            movieWatchHistoryRepository.deleteByMovieMovieId(movieId);
            movieFavorRepository.deleteByMovieMovieId(movieId);
            // 마지막으로 영화 자체를 삭제
            movieRepository.deleteById(movieId);
        }

        for (Long trailerId : trailerIds) {
            trailersRepository.deleteByTrailerId(trailerId);
        }

        for (Long posterId: posterIds) {
            postersRepository.deleteByPosterId(posterId);
        }

        for (Long reviewId : reviewIds) {
            reviewLikesRepository.deleteByReviewReviewId(reviewId);
            attractionPointsRepository.deleteByReviewId(reviewId);
            emotionPointsRepository.deleteByReviewId(reviewId);
            movieReviewRepository.deleteById(reviewId);
        }
    }
}