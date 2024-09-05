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
@Slf4j
public class AdminMovieController {

    private final AdminMovieService movieAdminService;

    //통합검색
    @GetMapping("/movie/list/search")
    public ResponseEntity<Page<AdminMovieListResponseDTO>> findByAllSearch(
            @PageableDefault(size = 10, sort = "movieId", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false,name="searchTerm") String searchTerm
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

    //영화 추가 페이지(1) 정보(감독,배우,장르,줄거리,청소년 관람여부,상영시간,제작년도)
    @PostMapping("/movie/list/addDetail2")
    public ResponseEntity<AdminMovieFirstInfoResponseDTO> addMovie2(@RequestBody AdminMovieFirstInfoRequestDTO adminMovieFirstInfoRequestDTO) {
        if (adminMovieFirstInfoRequestDTO.getMovieId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            AdminMovieFirstInfoResponseDTO updatedMovie = movieAdminService.saveFirstInfo(adminMovieFirstInfoRequestDTO.getMovieId(), adminMovieFirstInfoRequestDTO);



            return ResponseEntity.ok(updatedMovie);
        } catch (MovieNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    //영화 추가 페이지2 정보
    @PostMapping("/movie/list/add")
    public ResponseEntity<?> addMovie(@RequestBody AdminMovieSecondInfoRequestDTO adminMovieSecondInfoRequestDTO) {

        try {
            AdminMovieSecondInfoResponseDTO addMovieSave2 = movieAdminService.addCompleteMovie(adminMovieSecondInfoRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(addMovieSave2);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the movie");
        }
    }


    // 영화 정보 조회
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<AdminMovieFirstInfoResponseDTO> getMovieById(@PathVariable("movieId") Long movieId) {
        try {
            AdminMovieFirstInfoResponseDTO movie = movieAdminService.getMovieById(movieId);
            return ResponseEntity.ok(movie);
        } catch (MovieNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 영화 첫 번째 정보 수정
    @PutMapping("/movie/{movieId}/updateFirst")
    public ResponseEntity<?> updateMovieFirst(@PathVariable("movieId") Long movieId, @RequestBody AdminMovieFirstInfoRequestDTO requestDTO) {

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
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the movie");
        }
    }

    // 영화 두 번째 정보 수정
    @PutMapping("/movie/{movieId}/updateSecond")
    public ResponseEntity<?> updateMovieSecond(@PathVariable("movieId") Long movieId,
                                               @RequestBody AdminMovieSecondInfoUpdateRequestDTO dto) {
        try {
            log.info("Received update request for movie ID: {}", movieId);
            log.info("Request body: {}", dto);

            AdminMovieSecondInfoResponseDTO responseDTO = movieAdminService.updateMovieSecond(movieId, dto);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error updating movie: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating movie: " + e.getMessage());
        }
    }

    // 두번째페이지 정보조회
    @GetMapping("/movie/{movieId}/second")
    public ResponseEntity<AdminMovieSecondInfoResponseDTO> getMovieByIdForSecondPage(@PathVariable("movieId") Long movieId) {
        try {
            AdminMovieSecondInfoResponseDTO movie = movieAdminService.getMovieByIdForSecondPage(movieId);
            return ResponseEntity.ok(movie);
        } catch (MovieNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    //영화삭제
    @DeleteMapping("/movie/delete")
    public ResponseEntity<Void> deleteMovies(@RequestBody List<Long> movieIds,
                                             @RequestParam(name = "posterIds") List<Long> posterIds,
                                             @RequestParam(name = "trailerIds") List<Long> trailerIds,
                                             @RequestParam(name = "reviewIds") List<Long> reviewIds) {
        try {
            movieAdminService.deleteMovies(movieIds,posterIds,trailerIds,reviewIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //감독 자동완성
    @GetMapping("/directors/search")
    public ResponseEntity<Page<DirectorResponseDTO>> searchDirectors(
            @RequestParam(name = "query") String query,
            @RequestParam(defaultValue = "0",name = "page") int page,
            @RequestParam(defaultValue = "10",name = "size") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DirectorResponseDTO> directorsPage = movieAdminService.searchDirectors(query, pageable);
        return ResponseEntity.ok(directorsPage);
    }
    //배우 자동완성
    @GetMapping("/actors/search")
    public ResponseEntity<Page<ActorResponseDTO>> searchActors(
            @RequestParam(name = "query") String query,
            @RequestParam(defaultValue = "0",name = "page") int page,
            @RequestParam(defaultValue = "10",name = "size") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ActorResponseDTO> actorsPage = movieAdminService.searchActors(query, pageable);
        return ResponseEntity.ok(actorsPage);
    }
    //장르 자동완성
    @GetMapping("/genres/search")
    public ResponseEntity<Page<GenreResponseDTO>> searchGenres(
            @RequestParam(name = "query") String query,
            @RequestParam(defaultValue = "0",name = "page") int page,
            @RequestParam(defaultValue = "10",name = "size") int size) {
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
