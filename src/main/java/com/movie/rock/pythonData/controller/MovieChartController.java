package com.movie.rock.pythonData.controller;

import com.movie.rock.pythonData.service.MovieChartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/movies")
public class MovieChartController {

    private final MovieChartService movieChartService;

    // 리뷰 성별 차트
    @GetMapping("/{movieId}/gender-chart")
    public ResponseEntity<byte[]> genderChart(@PathVariable("movieId") Long movieId) throws IOException {
        movieChartService.runMoviePythonScript(movieId);
        return getMovieChartResponseEntity(movieId, "gender_chart");
    }

    // 리뷰 나이대 차트
    @GetMapping("/{movieId}/age-chart")
    public ResponseEntity<byte[]> ageChart(@PathVariable("movieId") Long movieId) throws IOException {
        movieChartService.runMoviePythonScript(movieId);
        return getMovieChartResponseEntity(movieId, "age_chart");
    }

    // 리뷰 매력 포인트 차트
    @GetMapping("/{movieId}/attraction-chart")
    public ResponseEntity<byte[]> attractionChart(@PathVariable("movieId") Long movieId) throws IOException {
        movieChartService.runMoviePythonScript(movieId);
        return getMovieChartResponseEntity(movieId, "attraction_chart");
    }

    // 리뷰 감정 포인트 차트
    @GetMapping("/{movieId}/emotion-chart")
    public ResponseEntity<byte[]> emotionChart(@PathVariable("movieId") Long movieId) throws IOException {
        movieChartService.runMoviePythonScript(movieId);  // Execute the Python script
        return getMovieChartResponseEntity(movieId, "emotion_chart");
    }

    // 이미지 가져오기
    private ResponseEntity<byte[]> getMovieChartResponseEntity(Long movieId, String chartType) throws IOException {
        // 파일 경로
        Path path = Paths.get("src/main/resources/static/images/" + chartType + "_" + movieId + ".png");

        // 파일 존재 확인
        if (Files.notExists(path)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // byte 배열로 묶기
        byte[] imageBytes = Files.readAllBytes(path);

        // http 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        // 이미지 반환
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    //파일 삭제처리
    @PostMapping("/{movieId}/delete-image")
    public ResponseEntity<String> deleteImages(@RequestBody Map<String, List<String>> requestBody, @PathVariable("movieId") String movieId) {
        List<String> fileNames = requestBody.get("fileNames");
        String baseDirectory = "src/main/resources/static/images/";

        try {
            for (String fileName : fileNames) {
                Path path = Paths.get(baseDirectory + fileName);
                Files.deleteIfExists(path);
            }
            return ResponseEntity.ok("Images deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete images");
        }
    }
}