package com.movie.rock.pythonData.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

@Service
@Slf4j
public class PersonalChartService {
    public void runPersonalPythonScript(Long memNum) {
//        String pythonPath = "venv/bin/python";
        String pythonPath = "C:\\Users\\kwyoo\\Desktop\\Project\\HRERock\\venv\\Scripts\\python.exe";
        String scriptPath = "C:\\Users\\kwyoo\\Desktop\\Project\\HRERock\\src\\main\\python\\personal_main.py";

        ProcessBuilder processBuilder = new ProcessBuilder(pythonPath, scriptPath, memNum.toString());
        processBuilder.redirectErrorStream(true);// 표준 오류와 표준 출력을 결합

        try {
            // Python 스크립트를 실행
            Process process = processBuilder.start();
//            log.info("Python script started successfully.");

            // 프로세스의 표준 출력을 읽기 위한 BufferedReader 생성
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                // 프로세스의 출력을 콘솔에 출력
//                log.info(line);
            }

            // 프로세스가 종료될 때까지 대기하고 종료 코드를 반환
            int exitCode = process.waitFor();
            log.info("Python script executed with exit code: " + exitCode);

        }catch (IOException e) {
            e.printStackTrace();
//            log.error("Failed to start Python script.", e);
        }catch (InterruptedException e) {
//            log.error("InterruptedException occurred while waiting for Python script to finish.", e);
            Thread.currentThread().interrupt(); // Interrupt status를 복구
        }
    }

//    public List<Map<String, String>> getPersonalList(Long memNum) throws IOException {
//        List<String> listTypes = Arrays.asList("personal_actors", "personal_directors");
//        String jsonPath = "src/main/resources/static/json/{listTypes}" + memNum + ".json";
//
//        return readJsonFiles(jsonPath);
//    }

    // 개인 배우 리스트를 가져오는 메소드
    public List<Map<String, String>> getPersonalActorsList(Long memNum) throws IOException {
        String jsonPath = "src/main/resources/static/json/personal_actors_" + memNum + ".json";
        return readJsonFiles(jsonPath);
    }

    // 개인 감독 리스트를 가져오는 메소드
    public List<Map<String, String>> getPersonalDirectorsList(Long memNum) throws IOException {
        String jsonPath = "src/main/resources/static/json/personal_directors_" + memNum + ".json";
        return readJsonFiles(jsonPath);
    }

    private List<Map<String, String>> readJsonFiles(String jsonPath) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        File file = new File(jsonPath);
        if (!file.exists()) {
            return Collections.emptyList();
        }

        return objectMapper.readValue(file, new TypeReference<List<Map<String, String>>>() {});
    }

}
