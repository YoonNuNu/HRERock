package com.movie.rock.file.controller;

import com.movie.rock.file.data.BoardFileDownloadResponseDTO;
import com.movie.rock.file.data.BoardFileEntity;
import com.movie.rock.file.data.BoardFileUploadResponseDTO;
import com.movie.rock.file.service.BoardFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class BoardFileController {
    private final BoardFileService boardFileService;

    //업로드
    @PostMapping("/admin/boardUpload/{boardId}")
    public ResponseEntity<List<BoardFileUploadResponseDTO>> boardUpload(
            @PathVariable("boardId") Long boardId, @RequestParam(name = "files") List<MultipartFile> files) throws IOException {
        List<BoardFileUploadResponseDTO> saveFiles = boardFileService.boardFileUpload(boardId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveFiles);
    }

    //다운로드
    @GetMapping("/admin/boardDownload")
    public ResponseEntity<Resource> boardDownLoad(
            @RequestParam(name = "boardFileId") Long boardFileId) throws IOException{
        BoardFileDownloadResponseDTO downFile = boardFileService.boardDownload(boardFileId);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.parseMediaType(downFile.getBoardFileType()))//헤더를 설정 파일형식
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; fileName=\"" + downFile.getBoardFileName() + "\"")
                .body(new ByteArrayResource(downFile.getContext()));

    }

    @PutMapping("/admin/boardFileUpdate/{fileId}")
    public ResponseEntity<?> updateBoardFile(@PathVariable("fileId") Long fileId, @RequestParam(name="file") MultipartFile file) {
        try {
            BoardFileEntity updatedFile = boardFileService.updateFile(fileId, file);
            BoardFileUploadResponseDTO responseDTO = BoardFileUploadResponseDTO.fromEntity(updatedFile);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 수정 중 오류 발생");
        }
    }

    //삭제
    @DeleteMapping("admin/boardDelete")
    public ResponseEntity<Long> boardDelete(@RequestParam(name = "boardFileId") Long boardFileId) {
        boardFileService.delete(boardFileId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
