package com.movie.rock.file.data;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardDetailsFileResponseDTO {
    //상세보기 파일처리
    public Long boardFileId;
    public String boardOriginFileName;
    public String boardFileType;
    
    //생성자 초기화
    @Builder
    public BoardDetailsFileResponseDTO(Long boardFileId, String boardOriginFileName, String boardFileType) {
        this.boardFileId = boardFileId;
        this.boardOriginFileName = boardOriginFileName;
        this.boardFileType = boardFileType;
    }

    //생성자에 입력할 데이터
    public static BoardDetailsFileResponseDTO fromEntity(BoardFileEntity boardFileEntity) {
        return BoardDetailsFileResponseDTO.builder()
                .boardFileId(boardFileEntity.boardFileId)
                .boardOriginFileName(boardFileEntity.boardOriginFileName)
                .boardFileType(boardFileEntity.boardFileType)
                .build();
    }
}
