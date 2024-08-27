package com.movie.rock.board.data;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardSearchRequestDTO {
    //검색 DTO
    //글제목, 글내용, 글쓴이 검색조건
    private String boardTitle;
    private String boardContent;

    //초기화
    @Builder
    public BoardSearchRequestDTO(String boardTitle, String boardContent) {
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
    }

    //검색할 떄 쓰는 데이터
    public static BoardSearchRequestDTO BoardSearchData(String boardTitle, String boardContent) {
        return BoardSearchRequestDTO.builder()
                .boardTitle(boardTitle)
                .boardContent(boardContent)
                .build();
    }

}
