package com.movie.rock.pythonData.controller;

import com.movie.rock.pythonData.data.PythonResponseDTO;
import com.movie.rock.pythonData.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/personal/recommend")
public class RecommendController {

    private final RecommendService recommendService;

    // 포인트 컨텐츠 필터링 추천
    @GetMapping("/{memNum}/points-content")
    public ResponseEntity<List<PythonResponseDTO>> getPointsContentRecommendations(@PathVariable("memNum") Long memNum) {
        return ResponseEntity.ok(recommendService.getPointsContentRecommendations(memNum));
    }

    // 포인트 협업 필터링 추천
    @GetMapping("/{memNum}/points-collab")
    public ResponseEntity<List<PythonResponseDTO>> getPointsCollabRecommendations(@PathVariable("memNum") Long memNum) {
        return ResponseEntity.ok(recommendService.getPointsCollabRecommendations(memNum));
    }

    // 영화 협업 필터링 추천
    @GetMapping("/{memNum}/movie-collab")
    public ResponseEntity<List<PythonResponseDTO>> getMovieCollabRecommendations(@PathVariable("memNum") Long memNum) {
        return ResponseEntity.ok(recommendService.getMovieCollabRecommendations(memNum));
    }

    // 파일 삭제처리
    @PostMapping("/{memNum}/delete-files")
    public ResponseEntity<String> deleteJsonFiles(@RequestBody Map<String, List<String>> requestBody, @PathVariable("memNum") Long memNum) {
        List<String> fileNames = requestBody.get("fileNames");
        String jsonDirectory = "src/main/resources/static/json/";

        try {
            for (String fileName : fileNames) {
                Path jsonPath = Paths.get(jsonDirectory + fileName);
                Files.deleteIfExists(jsonPath);
            }
            return ResponseEntity.ok("Images deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete images");
        }
    }
}