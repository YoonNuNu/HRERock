package com.movie.rock.admin.service;

import com.movie.rock.admin.data.AdminMovieListRepository;
import com.movie.rock.admin.data.request.*;
import com.movie.rock.admin.data.response.*;
import com.movie.rock.common.CommonException.DuplicateUrlException;
import com.movie.rock.common.CommonException.MovieNotFoundException;
import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.repository.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
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


    // 페이징 처리된 영화 목록을 조회
    @Override
    public Page<AdminMovieListResponseDTO> getMovieList(Pageable pageable) {
        Page<MovieEntity> moviePage = movieRepository.findAll(pageable);
        return moviePage.map(AdminMovieListResponseDTO::fromEntity);
    }

    // 영화 제목, 감독 이름, 장르로 영화를 검색
//    @Override
//    public Page<AdminMovieListResponseDTO> search(AdminMovieListSearchRequestDTO searchData
//            , Pageable pageable) {
//        Page<MovieEntity> result = null;
//        if (!searchData.getMovieTitle().isEmpty()) {  //영화 제목 검색
//            result = adminMovieListRepository.findAllMovieTitle(searchData.getMovieTitle(), pageable);
//        } else if (!searchData.getDirectorName().isEmpty()) { //영화 감독 검색
//            result = adminMovieListRepository.findAllByDirectorName(searchData.getDirectorName(), pageable);
//        } else if (!searchData.getMovieGenres().isEmpty()) {    //영화 장르 검색
//            result = adminMovieListRepository.findAllGenres(searchData.getMovieGenres(), pageable);
//        }
//        List<AdminMovieListResponseDTO> adminMovieList = result.getContent().stream()
//                .map(AdminMovieListResponseDTO::fromEntity)
//                .collect(Collectors.toList());
//        return new PageImpl<>(adminMovieList, pageable, result.getTotalElements());
//    }

    //통합검색
    @Override
    public Page<AdminMovieListResponseDTO> findByAllSearch(String searchTerm, Pageable pageable) {
        Page<MovieEntity> result = adminMovieListRepository.findByAllSearch(searchTerm, pageable);
        return result.map(AdminMovieListResponseDTO::fromEntity);
    }

    //영화 상세보기
    @Override
    public AdminMovieDetailsResponseDTO getMovieDetails(Long movieId) {
        MovieEntity findMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

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

        // 영화 파일 정보 업데이트
        if (requestDTO.getMovieFilm() != null) {
            MovieFilmEntity movieFilm = MovieFilmEntity.builder()
                    .movieFilm(requestDTO.getMovieFilm().getMovieFilm())
                    .movie(movie)
                    .build();
            movieFilmRepository.save(movieFilm);
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
//        log.info("Saved complete movie: {}", savedMovie);

        List<MovieTrailersEntity> updatedTrailers = movieTrailersRepository.findByMovieMovieId(savedMovie.getMovieId());
        List<MoviePostersEntity> updatedPosters = moviePostersRepository.findByMovieMovieId(savedMovie.getMovieId());

        return AdminMovieSecondInfoResponseDTO.fromEntity(savedMovie, updatedTrailers, updatedPosters);
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
    @Transactional
    @Override
    public AdminMovieSecondInfoResponseDTO updateMovieSecond(Long movieId, AdminMovieSecondInfoUpdateRequestDTO dto) {
//        log.info("Updating movie with ID: {}", movieId);
//        log.info("Update data: {}", dto);
        MovieEntity existingMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        // 영화 제목 업데이트
        movieRepository.updateMovieTitle(movieId, dto.getMovieTitle());

        // 영화 파일 정보 업데이트
        updateMovieFilm(movieId, dto.getMovieFilm());

        // 트레일러 업데이트
        updateTrailers(existingMovie, dto.getTrailer());

        // 포스터 업데이트
        updatePosters(existingMovie, dto.getPoster());

        // 변경된 엔티티 다시 조회
        MovieEntity updatedMovie = movieRepository.findById(movieId)
                .orElseThrow(MovieNotFoundException::new);

        List<MovieTrailersEntity> trailers = movieTrailersRepository.findByMovieMovieId(movieId);
        List<MoviePostersEntity> posters = moviePostersRepository.findByMovieMovieId(movieId);

        return AdminMovieSecondInfoResponseDTO.fromEntity(updatedMovie, trailers, posters);
    }


    private void updateTrailers(MovieEntity movie, List<TrailerResponseDTO> trailerDTOs) {
        if (trailerDTOs != null && !trailerDTOs.isEmpty()) {
            movieTrailersRepository.deleteByMovie_MovieId(movie.getMovieId());

            boolean hasMainTrailer = false;
            for (TrailerResponseDTO trailerDTO : trailerDTOs) {
                if (trailerDTO.getTrailerUrls() != null && !trailerDTO.getTrailerUrls().trim().isEmpty()) {
                    boolean isMainTrailer = trailerDTO.getMainTrailer() != null && trailerDTO.getMainTrailer() && !hasMainTrailer;
                    if (isMainTrailer) {
                        hasMainTrailer = true;
                    }

                    TrailersEntity newTrailer = TrailersEntity.builder()
                            .trailerId(null)
                            .trailerUrls(trailerDTO.getTrailerUrls())
                            .mainTrailer(isMainTrailer)
                            .build();
                    TrailersEntity savedTrailer = trailersRepository.save(newTrailer);

                    MovieTrailersEntity movieTrailer = new MovieTrailersEntity(savedTrailer, movie);
                    movieTrailersRepository.save(movieTrailer);
                }
            }
        }
    }

    private void updatePosters(MovieEntity movie, List<PosterResponseDTO> posterDTOs) {
        if (posterDTOs != null && !posterDTOs.isEmpty()) {
            moviePostersRepository.deleteByMovie_MovieId(movie.getMovieId());

            boolean hasMainPoster = false;
            for (PosterResponseDTO posterDTO : posterDTOs) {
                if (posterDTO.getPosterUrls() != null && !posterDTO.getPosterUrls().trim().isEmpty()) {
                    boolean isMainPoster = posterDTO.getMainPoster() != null && posterDTO.getMainPoster() && !hasMainPoster;
                    if (isMainPoster) {
                        hasMainPoster = true;
                    }

                    PostersEntity newPoster = PostersEntity.builder()
                            .posterId(null)
                            .posterUrls(posterDTO.getPosterUrls())
                            .mainPoster(isMainPoster)
                            .build();
                    PostersEntity savedPoster = postersRepository.save(newPoster);

                    MoviePostersEntity moviePoster = new MoviePostersEntity(savedPoster, movie);
                    moviePostersRepository.save(moviePoster);
                }
            }
        }
    }

    private void updateMovieFilm(Long movieId, FilmResponseDTO filmResponseDTO) {
        if (filmResponseDTO != null) {
            Optional<MovieFilmEntity> existingMovieFilm = movieFilmRepository.findByMovieMovieId(movieId);
            if (existingMovieFilm.isPresent()) {
                // 기존 엔티티가 있으면 업데이트
                int updatedRows = movieFilmRepository.updateMovieFilm(movieId, filmResponseDTO.getMovieFilm());
                if (updatedRows == 0) {
                    throw new RuntimeException("Failed to update movie film");
                }
            } else {
                // 기존 엔티티가 없으면 새로 생성
                int insertedRows = movieFilmRepository.insertMovieFilm(movieId, filmResponseDTO.getMovieFilm());
                if (insertedRows == 0) {
                    throw new RuntimeException("Failed to insert movie film");
                }
            }
        }
    }

    //삭제
    @Override
    @Transactional
    public void deleteMovies(List<Long> movieIds) {
        for (Long movieId : movieIds) {
            movieRepository.deleteById(movieId);
        }
    }
}
