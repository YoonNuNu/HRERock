package com.movie.rock.pythonData.controller;

import com.movie.rock.pythonData.service.PersonalChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/user/personal")
@Slf4j
public class PersonalChartController {

    private final PersonalChartService personalChartService;

    // 개인 시청 장르 차트
    @GetMapping("/{memNum}/personal_genres-chart")
    public ResponseEntity<byte[]> personalGenresChart(@PathVariable("memNum") Long memNum) throws IOException {
//        log.info("Received request for personal genre chart for member number: {}", memNum);
        personalChartService.runPersonalPythonScript(memNum);

        return getPersonalChartResponseEntity(memNum, "personal_genres");
    }

    // 개인 리뷰 매력 포인트 차트
    @GetMapping("/{memNum}/personal_attraction-chart")
    public ResponseEntity<byte[]> personalAttractionChart(@PathVariable("memNum") Long memNum) throws IOException {
//        log.info("Received request for personal genre chart for member number: {}", memNum);
        personalChartService.runPersonalPythonScript(memNum);

        return getPersonalChartResponseEntity(memNum, "personal_attraction");
    }

    // 개인 리뷰 감정 포인트 차트
    @GetMapping("/{memNum}/personal_emotion-chart")
    public ResponseEntity<byte[]> personalEmotionChart(@PathVariable("memNum") Long memNum) throws IOException {
//        log.info("Received request for personal genre chart for member number: {}", memNum);
        personalChartService.runPersonalPythonScript(memNum);

        return getPersonalChartResponseEntity(memNum, "personal_emotion");
    }

    // 개인 리뷰 기반 배우 리스트
    @GetMapping("/{memNum}/personal_actors-list")
    public ResponseEntity<List<Map<String, String>>> personalActorsList(@PathVariable("memNum") Long memNum) throws IOException {
        personalChartService.runPersonalPythonScript(memNum);
        List<Map<String, String>> actorsList = personalChartService.getPersonalActorsList(memNum);

        return ResponseEntity.ok(actorsList);
    }

    // 개인 리뷰 기반 감독 리스트
    @GetMapping("/{memNum}/personal_directors-list")
    public  ResponseEntity<List<Map<String, String>>> personalDirectorsList(@PathVariable("memNum") Long memNum) throws IOException {
        personalChartService.runPersonalPythonScript(memNum);
        List<Map<String, String>> directorsList = personalChartService.getPersonalDirectorsList(memNum);

        return ResponseEntity.ok(directorsList);
    }

    // 이미지 가져오기
    private ResponseEntity<byte[]> getPersonalChartResponseEntity(Long memNum, String chartType) throws IOException {
//        log.info("Requested chart type: {}", chartType);
        Path path = Paths.get("src/main/resources/static/images/" + chartType + "_" + memNum + ".png");

        if (Files.notExists(path)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        byte[] imageBytes = Files.readAllBytes(path);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    //파일 삭제처리
    @PostMapping("/{memNum}/delete")
    public ResponseEntity<String> deleteImages(@RequestBody Map<String, List<String>> requestBody, @PathVariable("memNum") Long memNum) {
        List<String> fileNames = requestBody.get("fileNames");
        String imagesDirectory = "src/main/resources/static/images/";
        String jsonDirectory = "src/main/resources/static/json/";

        try {
            for (String fileName : fileNames) {
                Path imagePath = Paths.get(imagesDirectory + fileName);
                Files.deleteIfExists(imagePath);

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
