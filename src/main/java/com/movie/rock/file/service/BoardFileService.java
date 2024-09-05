package com.movie.rock.file.service;

import com.movie.rock.board.data.BoardEntity;
import com.movie.rock.board.data.BoardRepository;
import com.movie.rock.common.ResourceNotFoundException;
import com.movie.rock.file.data.BoardFileDownloadResponseDTO;
import com.movie.rock.file.data.BoardFileUploadResponseDTO;
import com.movie.rock.file.data.BoardFileEntity;
import com.movie.rock.file.data.BoardFileRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardFileService {
    //업로드,다운로드

    public final BoardRepository boardRepository;
    public final BoardFileRepository boardFileRepository;

    //폴더경로
    @Value("${project.folderPath}")
    public String FOLDER_PATH;

    //업로드 메서드
    public List<BoardFileUploadResponseDTO> boardFileUpload(Long boardId, List<MultipartFile> multipartFiles) throws IOException {
        //게시글 찾기(boardId)
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow(
                () -> new ResourceNotFoundException("Board","Board id",String.valueOf(boardId))
        );

        //파일들 list로 생성
        List<BoardFileEntity> boardFileEntities = new ArrayList<>();

        //가지고온 file들이 없을떄 까지 돌림
        for(MultipartFile multipartFile : multipartFiles) {
            //이름가져오기(오리지넣)
            String boardFileName = multipartFile.getOriginalFilename();

            //중복이 되지않기위해 처리
            String randomId = UUID.randomUUID().toString();

            //파일 이름샐성(저장소에서 보여줄 파일이름),boardFileName.substring(boardFileName.indexOf(".")) = 확장자
            String repositoryBoardFile = "POST_" + boardEntity.getBoardId() + "_" +
                    randomId.concat(boardFileName.substring(boardFileName.indexOf(".")));

            //최종경로 / File.separator : OS에 따른 구분자
            String osPath = FOLDER_PATH + File.separator + repositoryBoardFile;

            //폴더가없으면 생성 있으면 삽입
            File bf =new File(FOLDER_PATH);
            if(!bf.exists()) {
                bf.mkdir();
            }

            //복사해서 저장소에 저장
            Files.copy(multipartFile.getInputStream(), Paths.get(osPath));

            //파일엔티티객체생성
            BoardFileEntity saveFile = BoardFileEntity.builder()
                    .boardOriginFileName(multipartFile.getOriginalFilename())
                    .boardFilePath(repositoryBoardFile)
                    .boardFileType(multipartFile.getContentType())
                    .build();

            saveFile.setMappingBoard(boardEntity);

            //db에저장
            boardFileEntities.add(boardFileRepository.save(saveFile));
        }

        List<BoardFileUploadResponseDTO> dtos = boardFileEntities.stream()
                .map(BoardFileUploadResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return dtos;
    }

    //다운로드
    public BoardFileDownloadResponseDTO boardDownload(Long boardFileId) throws IOException{
        //해당게시글 찾기
        BoardFileEntity file = boardFileRepository.findById(boardFileId).orElseThrow(
                () -> new ResourceNotFoundException("BoardFile","BoardFile id",String.valueOf(boardFileId))
        );

        //업로드 경로 찾기
        String filepath = FOLDER_PATH  + File.separator + file.getBoardFilePath();

        //타입 가지고 오기
        String contextType = boardFileType(file.getBoardFileType());

        //파일 바이트 배열로 담기 (새로운 객체를 생성 후 파일경로의 파일의 내용을 담는다)
        byte[] context = Files.readAllBytes(new File(filepath).toPath());

        return BoardFileDownloadResponseDTO.fromFileResource(file, contextType ,context);

    }

    //파일삭제
    public void delete(Long boardFileId) {
        //해당 boardId찾기
        BoardFileEntity boardFileEntity = boardFileRepository.findById(boardFileId).orElseThrow(
                ()-> new ResourceNotFoundException("BoardFile","BoardFile id", String.valueOf(boardFileId))
        );

        //객체생성
        String boardFilePath = FOLDER_PATH + File.separator + boardFileEntity.getBoardFilePath();
        File boardFile = new File(boardFilePath);

        //파일이 있다면 삭제
        if(boardFile.exists()) {
            boardFile.delete();
        }
        //db에서 삭제
        boardFileRepository.delete(boardFileEntity);
    }

    // 파일 수정 메서드 추가
    public BoardFileEntity updateFile(Long fileId, MultipartFile newFile) throws IOException {
        BoardFileEntity existingFile = boardFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("BoardFile", "BoardFile id", String.valueOf(fileId)));

        // 기존 파일 삭제
        String oldFilePath = FOLDER_PATH + File.separator + existingFile.getBoardFilePath();
        Files.deleteIfExists(Paths.get(oldFilePath));

        // 새 파일 저장
        String boardFileName = newFile.getOriginalFilename();
        String randomId = UUID.randomUUID().toString();
        String repositoryBoardFile = "POST_" + existingFile.getBoard().getBoardId() + "_" +
                randomId + boardFileName.substring(boardFileName.lastIndexOf("."));

        String newFilePath = FOLDER_PATH + File.separator + repositoryBoardFile;

        // 폴더가 없으면 생성
        File bf = new File(FOLDER_PATH);
        if (!bf.exists()) {
            bf.mkdirs();
        }

        // 새 파일 저장
        Files.copy(newFile.getInputStream(), Paths.get(newFilePath), StandardCopyOption.REPLACE_EXISTING);

        // 엔티티 업데이트
        existingFile.setBoardOriginFileName(boardFileName);
        existingFile.setBoardFilePath(repositoryBoardFile);
        existingFile.setBoardFileType(newFile.getContentType());

        return boardFileRepository.save(existingFile);
    }

    //타입 설정 메서드
    private String boardFileType(String boardFileType) {
        switch (boardFileType){
            case "image/png":
                return MediaType.IMAGE_PNG_VALUE;
            case "image/jpeg":
                return MediaType.IMAGE_JPEG_VALUE;
            case "text/plain":
                return MediaType.TEXT_PLAIN_VALUE;
            case "application/vnd.ms-excel": //엑셀
                return "application/vnd.ms-excel";
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": // Microsoft Office 엑셀
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "application/x-hwp": // 한글
                return "application/x-hwp";
            case "application/x-hwpml": //한글 워드 프로세서의 XML 기반 파일
                return "application/x-hwpml";
            default:
                return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }


}
