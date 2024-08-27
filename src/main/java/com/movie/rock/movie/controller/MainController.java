package com.movie.rock.movie.controller;

import com.movie.rock.movie.data.response.MainResponseDTO;
import com.movie.rock.movie.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user/main")
@RequiredArgsConstructor
public class MainController {

    private final MainService mainService;

    @GetMapping("/updated-trailers")
    public ResponseEntity<List<MainResponseDTO>> getUpdatedTrailers() {
        List<MainResponseDTO> updatedMoviesWithTrailers = mainService.getUpdatedMoviesWithTrailers();

        return ResponseEntity.ok(updatedMoviesWithTrailers);
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<MainResponseDTO>> getTopRatedMovies() {
        List<MainResponseDTO> topRatedMovies = mainService.getTopRatedMovies();
        //갯수 회의
        return ResponseEntity.ok(topRatedMovies);
    }

    @GetMapping("/updated")
    public ResponseEntity<List<MainResponseDTO>> getUpdatedMovies() {
        List<MainResponseDTO> updatedMovies = mainService.getUpdatedMovies();

        return ResponseEntity.ok(updatedMovies);
    }
}
