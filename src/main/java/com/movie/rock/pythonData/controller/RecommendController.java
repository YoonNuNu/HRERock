package com.movie.rock.pythonData.controller;

import com.movie.rock.pythonData.data.PythonResponseDTO;
import com.movie.rock.pythonData.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/personal/recommend")
public class RecommendController {

    private final RecommendService recommendService;

    @GetMapping("/{memNum}/points-content")
    public ResponseEntity<List<PythonResponseDTO>> getPointsContentRecommendations(@PathVariable("memNum") Long memNum) {
        return ResponseEntity.ok(recommendService.getPointsContentRecommendations(memNum));
    }

    @GetMapping("/{memNum}/movie-collab")
    public ResponseEntity<List<PythonResponseDTO>> getMovieCollabRecommendations(@PathVariable("memNum") Long memNum) {
        return ResponseEntity.ok(recommendService.getMovieCollabRecommendations(memNum));
    }

    @GetMapping("/{memNum}/points-collab")
    public ResponseEntity<List<PythonResponseDTO>> getPointsCollabRecommendations(@PathVariable("memNum") Long memNum) {
        return ResponseEntity.ok(recommendService.getPointsCollabRecommendations(memNum));
    }
}