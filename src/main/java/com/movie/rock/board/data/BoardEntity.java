package com.movie.rock.board.data;

import com.movie.rock.common.BaseTimeEntity;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.file.data.BoardFileEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "board")
public class BoardEntity extends BaseTimeEntity {

    //공지사항 id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    //공지사항 제목
    @Column(name = "board_title", nullable = false)
    private String boardTitle;

    //공지사항 내용
    @Column(name = "board_content", nullable = false, columnDefinition = "TEXT")
    private String boardContent;

//    공지사항 글생성 시간
//    @Column(name = "BOARD_DATE", nullable = false)
//    private Date BoardDate;

    //공지사항 조회수
    @Column(name = "board_view_count", nullable = false)
    private int boardViewCount;

    //유저번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mem_num")
    private MemberEntity member;

    //공지사항 파일
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @BatchSize(size = 5)
    public List<BoardFileEntity> files = new ArrayList<>();

    @Builder
    public BoardEntity(Long boardId,String boardTitle, String boardContent, int boardViewCount, MemberEntity member, List<BoardFileEntity> files) {
        this.boardId = boardId;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
        this.boardViewCount = boardViewCount;
        this.member = member;
    }

    //조회수 증가
    public void upViewCount() {
        this.boardViewCount++;
    }

    //수정
    public void BoardUpdate(String boardTitle, String boardContent) {
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
    }

    //member + Board 연관관계 메서드 
    //member테이블에서 해당 memId가 쓴 공지사항을 가져올려고 씀
    public void setMappingMember(MemberEntity memberEntity) {
        this.member = memberEntity;
        memberEntity.getBoards().add(this);
    }
}
