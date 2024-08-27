package com.movie.rock.pythonData.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.pythonData.data.PythonResponseDTO;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<PythonResponseDTO> getPointsContentRecommendations(Long memNum) {
        return getRecommendations(memNum, "points_content_recommend");
    }

    public List<PythonResponseDTO> getMovieCollabRecommendations(Long memNum) {
        return getRecommendations(memNum, "movie_collab_recommend");
    }

    public List<PythonResponseDTO> getPointsCollabRecommendations(Long memNum) {
        return getRecommendations(memNum, "points_collab_recommend");
    }

    private void runRecommendationScript(Long memNum) throws IOException, InterruptedException {
        String pythonPath = "C:\\Users\\kwyoo\\Desktop\\Project\\HRERock\\venv\\Scripts\\python.exe";
        String scriptPath = "C:\\Users\\kwyoo\\Desktop\\Project\\HRERock\\src\\main\\python\\recommend_main.py";

        ProcessBuilder processBuilder = new ProcessBuilder(pythonPath, scriptPath, memNum.toString());
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Python script failed. Exit code: " + exitCode + ". Output: " + output.toString());
        }
    }

    private List<PythonResponseDTO> getRecommendations(Long memNum, String recommendationType) {
        try {
            runRecommendationScript(memNum); // recommendationType 제거
            return readRecommendations(memNum, recommendationType);
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return List.of();
        }
    }

    private List<PythonResponseDTO> readRecommendations(Long memNum, String recommendationType) throws IOException {
        String jsonPath = String.format("src/main/resources/static/json/%s_%d.json", recommendationType, memNum);
        List<Map<String, Object>> recommendations = readJsonFile(jsonPath);

        if (recommendations.isEmpty()) {
            return List.of(); // 빈 리스트 반환
        }

        return recommendations.stream()
                .map(this::convertToPythonResponseDTO)
                .filter(dto -> dto != null) // Null이 아닌 객체만 필터링
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> readJsonFile(String jsonPath) throws IOException {
        File file = new File(jsonPath);
        if (!file.exists()) {
            return List.of();
        }

        JsonNode rootNode = objectMapper.readTree(file);
        if (rootNode.isArray()) {
            // JSON이 배열 형태일 때
            return objectMapper.convertValue(rootNode, new TypeReference<List<Map<String, Object>>>() {});
        } else {
            return List.of();
        }
    }

    private PythonResponseDTO convertToPythonResponseDTO(Map<String, Object> movieData) {
        if (movieData == null || movieData.isEmpty()) {
            return null;
        }

        Map<String, Object> posterData = (Map<String, Object>) movieData.get("main_poster");

        if (posterData == null || posterData.isEmpty()) {
            return null;
        }

        PosterResponseDTO posterResponseDTO = PosterResponseDTO.builder()
                .posterUrls((String) posterData.get("url"))
                .mainPoster((Boolean) posterData.get("main_poster"))
                .build();

        return PythonResponseDTO.builder()
                .movieId(((Number) movieData.get("movie_id")).longValue())
                .movieTitle((String) movieData.get("movie_title"))
                .mainPosterUrl(posterResponseDTO)
                .build();
    }
}
