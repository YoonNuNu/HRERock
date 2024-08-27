package com.movie.rock.file.data;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardFileDownloadResponseDTO {
    //다운로드
    public String boardFileName;
    public String boardFileType;
    public byte[] context;
    
    //생성자 초기화
    @Builder
    public BoardFileDownloadResponseDTO(String boardFileName, String boardFileType, byte[] context) {
        this.boardFileName = boardFileName;
        this.boardFileType = boardFileType;
        this.context = context;
    }
    
    //초기화한 생성자에 들어갈 데이터
    public static BoardFileDownloadResponseDTO fromFileResource(BoardFileEntity boardFileEntity,
                                                                String contextType, byte[] context) {
        return BoardFileDownloadResponseDTO.builder()
                .boardFileName(boardFileEntity.getBoardOriginFileName())
                .boardFileType(contextType)
                .context(context)
                .build();

    }
}
