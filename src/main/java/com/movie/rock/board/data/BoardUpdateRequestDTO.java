package com.movie.rock.board.data;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardUpdateRequestDTO {
    //게시글 수정 정보 요청
    private String boardTitle;
    private String boardContent;

    //인스턴스를 생성하는데 사용 생성자 초기화
    @Builder
    public BoardUpdateRequestDTO(String boardTitle, String boardContent) {
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
    }
}
