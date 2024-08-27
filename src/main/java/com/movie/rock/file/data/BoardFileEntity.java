package com.movie.rock.file.data;

import com.movie.rock.board.data.BoardEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "BoardFile")
public class BoardFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_file_id")
    public Long boardFileId;

    @Column(name = "board_origin_file_Name")
    public String boardOriginFileName;

    @Column(name = "board_file_type")
    public String boardFileType;

    @Column(name = "board_file_path")
    public String boardFilePath;

    //일대다관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    public BoardEntity board;
    
    
    //boardId는 리포지토리에서 사용할 수 있어서 뺴고 생성자를 초기화한다
    @Builder
    public BoardFileEntity(Long boardFileId, String boardOriginFileName,
                           String boardFileType, String boardFilePath) {
        this.boardFileId = boardFileId;
        this.boardOriginFileName = boardOriginFileName;
        this.boardFileType = boardFileType;
        this.boardFilePath = boardFilePath;
    }

    //BoardEntity와 연관관계설정(리포지토리에서 사용할 수 있으므로)
    public void setMappingBoard(BoardEntity board) {
        this.board = board;
    }

}
