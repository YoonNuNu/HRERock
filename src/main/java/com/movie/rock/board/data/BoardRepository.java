package com.movie.rock.board.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    // 리스트보기
    @Query("SELECT b FROM BoardEntity b")
    Page<BoardEntity> findAllBoardsList(Pageable pageable);

    // 검색(제목)
    @Query("SELECT b FROM BoardEntity b " +
            "WHERE b.boardTitle LIKE %:boardTitle%")
    Page<BoardEntity> findByTitle(@Param("boardTitle") String boardTitle, Pageable pageable);

    // 검색(내용)
    @Query("SELECT b FROM BoardEntity b " +
            "WHERE b.boardContent LIKE %:boardContent%")
    Page<BoardEntity> findByContent(@Param("boardContent") String boardContent, Pageable pageable);

    // 상세보기
    @Query("SELECT b FROM BoardEntity b " +
            "WHERE b.boardId = :boardId")
    Optional<BoardEntity> findByBoardId(@Param("boardId") Long boardId);




}
