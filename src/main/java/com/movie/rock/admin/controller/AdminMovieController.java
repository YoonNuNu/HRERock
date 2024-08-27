package com.movie.rock.admin.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movie.rock.admin.data.request.*;
import com.movie.rock.admin.data.response.AdminMovieFirstInfoResponseDTO;
import com.movie.rock.admin.data.response.AdminMovieFirstInfoTitleResponseDTO;
import com.movie.rock.admin.data.response.AdminMovieSecondInfoResponseDTO;
import com.movie.rock.admin.data.response.AdminMovieListResponseDTO;
import com.movie.rock.admin.service.AdminMovieService;
import com.movie.rock.common.CommonException.MovieNotFoundException;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
//@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminMovieController {

    private final AdminMovieService movieAdminService;

    //페이징 검색
//    @GetMapping("/movie/list/search")
//    public ResponseEntity<Page<AdminMovieListResponseDTO>> adminSearch(
//            @PageableDefault(size = 10, sort = "movieId", direction = Sort.Direction.DESC) Pageable pageable,
//            @RequestParam String movieTitle,
//            @RequestParam String movieGenres,
//            @RequestParam String directorName
//    ) {
//        AdminMovieListSearchRequestDTO searchData = AdminMovieListSearchRequestDTO.adminMovieListSearchRequestDTO
//                (movieTitle, movieGenres, directorName);
//        Page<AdminMovieListResponseDTO> searchList = movieAdminService.search(searchData, pageable);
//
//        return ResponseEntity.status(HttpStatus.OK).body(searchList);
//    }

    //통합검색
    @GetMapping("/movie/list/search")
    public ResponseEntity<Page<AdminMovieListResponseDTO>> findByAllSearch(
            @PageableDefault(size = 10, sort = "movieId", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String searchTerm
    ) {
        Page<AdminMovieListResponseDTO> searchList = movieAdminService.findByAllSearch(searchTerm, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(searchList);
    }


    // 영화 목록 페이지 렌더링(비동기)
    @GetMapping("/movie/movielist")
    public ResponseEntity<Page<AdminMovieListResponseDTO>> movieList(@PageableDefault(
            size = 10, sort = "movieId", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminMovieListResponseDTO> moviePage = movieAdminService.getMovieList(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(moviePage);
    }

    //영화 추가 페이지(1) 정보(제목)
    @PostMapping("/movie/list/addDetail1")
    public ResponseEntity<?> addMovie1(@RequestBody AdminMovieFirstInfoTitleRequestDTO requestDTO) {
        if (requestDTO.getMovieTitle() == null || requestDTO.getMovieTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Movie title cannot be empty");
        }

        // 이미 존재하는 제목인지 확인
        if (movieAdminService.existsByTitle(requestDTO.getMovieTitle())) {
            return ResponseEntity.badRequest().body("Movie with this title already exists");
        }

        AdminMovieFirstInfoTitleResponseDTO responseDTO = movieAdminService.saveTitleInfo(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }


    @PostMapping("/movie/list/addDetail2")
    public ResponseEntity<AdminMovieFirstInfoResponseDTO> addMovie2(@RequestBody AdminMovieFirstInfoRequestDTO adminMovieFirstInfoRequestDTO) {
        if (adminMovieFirstInfoRequestDTO.getMovieId() == null) {
            return ResponseEntity.badRequest().body(null);
        }
//        log.info("Received request to update movie: {}", adminMovieFirstInfoRequestDTO);

        try {
            AdminMovieFirstInfoResponseDTO updatedMovie = movieAdminService.saveFirstInfo(adminMovieFirstInfoRequestDTO.getMovieId(), adminMovieFirstInfoRequestDTO);

//            log.info("Open Year: {}", updatedMovie.getOpenYear() != null ? updatedMovie.getOpenYear().toString() : "Not Available");
//            log.info("Movie Rating: {}", updatedMovie.getMovieRating() != null ? updatedMovie.getMovieRating() : "Not Available");
//            log.info("Movie Description: {}", updatedMovie.getMovieDescription() != null ? updatedMovie.getMovieDescription() : "Not Available");
//            log.info("Run Time: {}", String.valueOf(updatedMovie.getRunTime())); // 기본형 int는 변환 필요 없음

            return ResponseEntity.ok(updatedMovie);
        } catch (MovieNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
//            log.error("Error updating movie: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    //영화 추가 페이지2 정보
    @PostMapping("/movie/list/add")
    public ResponseEntity<?> addMovie(@RequestBody AdminMovieSecondInfoRequestDTO adminMovieSecondInfoRequestDTO) {
//        log.info("Received request to add movie: {}", adminMovieSecondInfoRequestDTO);

        try {
            AdminMovieSecondInfoResponseDTO addMovieSave2 = movieAdminService.addCompleteMovie(adminMovieSecondInfoRequestDTO);
//            log.info("Movie added successfully: {}", addMovieSave2);
            return ResponseEntity.status(HttpStatus.CREATED).body(addMovieSave2);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
//            log.error("Error adding movie: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the movie");
        }
    }


    // 영화 정보 조회
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<AdminMovieFirstInfoResponseDTO> getMovieById(@PathVariable Long movieId) {
        try {
            AdminMovieFirstInfoResponseDTO movie = movieAdminService.getMovieById(movieId);
//            log.info(movie.getOpenYear().toString());
//            log.info(movie.getMovieRating());
//            log.info(movie.getMovieDescription());
//            log.info(String.valueOf(movie.getRunTime()));
            return ResponseEntity.ok(movie);
        } catch (MovieNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 영화 첫 번째 정보 수정
    @PutMapping("/movie/{movieId}/updateFirst")
    public ResponseEntity<?> updateMovieFirst(@PathVariable Long movieId, @RequestBody AdminMovieFirstInfoRequestDTO requestDTO) {
//        log.info("Received update request for movie ID: {}", movieId);
//        log.info("Request DTO: {}", requestDTO);

        // URL의 movieId를 사용하여 새로운 DTO 객체 생성
        AdminMovieFirstInfoRequestDTO updatedDTO = new AdminMovieFirstInfoRequestDTO(
                movieId,
                requestDTO.getMovieTitle(),
                requestDTO.getMovieGenres(),
                requestDTO.getRunTime(),
                requestDTO.getOpenYear(),
                requestDTO.getMovieRating(),
                requestDTO.getMovieDescription(),
                requestDTO.getMovieActors(),
                requestDTO.getMovieDirectors()
        );

        try {
            AdminMovieFirstInfoResponseDTO responseDTO = movieAdminService.updateMovieFirst(movieId, updatedDTO);
//            log.info("Movie updated successfully. Response: {}", responseDTO);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
//            log.error("Error updating movie: {}", movieId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the movie");
        }
    }

    // 영화 두 번째 정보 수정
    @PutMapping("/movie/{movieId}/updateSecond")
    public ResponseEntity<?> updateMovieSecond(@PathVariable Long movieId, @RequestBody String rawJson) {
//        log.info("Received update request for movie ID: {}", movieId);
//        log.info("Raw JSON: {}", rawJson);

        // JSON을 DTO로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        AdminMovieSecondInfoUpdateRequestDTO requestDTO;
        try {
            requestDTO = objectMapper.readValue(rawJson, AdminMovieSecondInfoUpdateRequestDTO.class);
        } catch (JsonProcessingException e) {
//            log.error("Error parsing JSON: ", e);
            return ResponseEntity.badRequest().body("Invalid JSON format");
        }

        // 기존 로직 수행
        try {
            AdminMovieSecondInfoResponseDTO responseDTO = movieAdminService.updateMovieSecond(movieId, requestDTO);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
//            log.error("Error updating movie: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating movie");
        }
    }

    // 두번째페이지 정보조회
    @GetMapping("/movie/{movieId}/second")
    public ResponseEntity<AdminMovieSecondInfoResponseDTO> getMovieByIdForSecondPage(@PathVariable Long movieId) {
        try {
//            log.info("Received movieId: {}", movieId);  // 로그 추가
            AdminMovieSecondInfoResponseDTO movie = movieAdminService.getMovieByIdForSecondPage(movieId);
//            log.info("Retrieved movie data for second page: {}", movie);
            return ResponseEntity.ok(movie);
        } catch (MovieNotFoundException e) {
//            log.error("Movie not found: {}", movieId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
//            log.error("Error retrieving movie data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    //영화삭제
    @DeleteMapping("/movie/delete")
    public ResponseEntity<Void> deleteMovies(@RequestBody List<Long> movieIds) {
        try {
            movieAdminService.deleteMovies(movieIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
//            log.error("Error deleting movies: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    //자동완성
    @GetMapping("/directors/search")
    public ResponseEntity<Page<DirectorResponseDTO>> searchDirectors(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
//        log.info("Searching directors with query: {}, page: {}, size: {}", query, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<DirectorResponseDTO> directorsPage = movieAdminService.searchDirectors(query, pageable);
        return ResponseEntity.ok(directorsPage);
    }

    @GetMapping("/actors/search")
    public ResponseEntity<Page<ActorResponseDTO>> searchActors(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
//        log.info("Searching actors with query: {}, page: {}, size: {}", query, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<ActorResponseDTO> actorsPage = movieAdminService.searchActors(query, pageable);
        return ResponseEntity.ok(actorsPage);
    }

    @GetMapping("/genres/search")
    public ResponseEntity<Page<GenreResponseDTO>> searchGenres(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
//        log.info("Searching genres with query: {}, page: {}, size: {}", query, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<GenreResponseDTO> genresPage = movieAdminService.searchGenres(query, pageable);
        return ResponseEntity.ok(genresPage);
    }

    //배우 추가
    @PostMapping("/admin/actor/add")
    public ResponseEntity<ActorResponseDTO> addActor(@RequestBody AdminActorAddRequestDTO addActorDTO) {
        ActorResponseDTO addedActor = movieAdminService.addActor(addActorDTO);
        return ResponseEntity.ok(addedActor);
    }
    //감독 추가
    @PostMapping("/admin/director/add")
    public ResponseEntity<DirectorResponseDTO> addDirector(@RequestBody AdminDirectorAddRequestDTO addDirectorDTO) {
        DirectorResponseDTO addedDirector = movieAdminService.addDirector(addDirectorDTO);
        return ResponseEntity.ok(addedDirector);
    }
}
