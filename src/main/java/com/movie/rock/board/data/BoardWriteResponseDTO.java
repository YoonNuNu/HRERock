package com.movie.rock.board.data;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardWriteResponseDTO {
    //글쓰기 정보
    //공지사항 게시글 등록
    private Long boardId;
    private String boardTitle;
    private String boardContent;
    public String createDate;

    //생성자 초기화
    @Builder
    public BoardWriteResponseDTO(Long boardId, String boardTitle, String boardContent, String createDate) {
        this.boardId = boardId;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
        this.createDate = createDate;
    }

    //초기화된 BoardWriteResponseDto에 받을 데이터 반환
    public static BoardWriteResponseDTO fromEntity(BoardEntity boardEntity) {
        return BoardWriteResponseDTO.builder()
                .boardId(boardEntity.getBoardId())
                .boardTitle(boardEntity.getBoardTitle())
                .boardContent(boardEntity.getBoardContent())
                .createDate(boardEntity.getCreateDate())
                .build();
    }

}
