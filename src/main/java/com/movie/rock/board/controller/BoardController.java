package com.movie.rock.board.controller;

import com.movie.rock.board.data.*;
import com.movie.rock.board.service.BoardService;
import com.movie.rock.member.data.MemberEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;

    //리스트보기 페이지 이동
    @GetMapping("/admin/board")
    public String adminBoardPage() {
        return "notice";
    }

    //글작성하기 페이지 이동
    @GetMapping("/admin/write")
    public String adminBoardWritePage() {
        return "post_write";
    }

    //글상세페이지 이동
    @GetMapping("/admin/{boardId}/Detail")
    public String adminBoardDetailPage() {
        return "post_view";
    }

    //리스트보기 관리자
    @GetMapping("/admin/boardList")
    public ResponseEntity<Page<BoardListResponseDTO>> adminBoardList (
            @PageableDefault(size = 10, sort = "boardId", direction = Sort.Direction.DESC) Pageable pageable){
        Page<BoardListResponseDTO> adminListDto = boardService.getAllBoards(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(adminListDto);
    }


    //검색
    @GetMapping("/admin/boardSearch")
    public ResponseEntity<Page<BoardListResponseDTO>> adminBoardSearch(
            @PageableDefault(size = 5, sort = "boardId", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam("boardTitle") String boardTitle,
            @RequestParam("boardContent") String boardContent) {
        BoardSearchRequestDTO boardSearchData = BoardSearchRequestDTO.BoardSearchData(boardTitle,boardContent);
        Page<BoardListResponseDTO> boardSearch = boardService.boardSearch(boardSearchData, pageable);

        return ResponseEntity.status(HttpStatus.OK).body(boardSearch);
    }



    //해당 게시글 상세보기(관리자)
    @GetMapping("/admin/{boardId}")
    public ResponseEntity<BoardDetailsResponseDTO> adminBoardDetail(@PathVariable("boardId") Long boardId) {
        BoardDetailsResponseDTO boardFind = boardService.boardDetail(boardId);

        return ResponseEntity.status(HttpStatus.OK).body(boardFind);
    }


    //게시글 작성
    //@AuthenticationPrincipal 현재 인증된 정보를 가져옴
    @PostMapping("/admin/boardWrite")
    public ResponseEntity<BoardWriteResponseDTO> adminBoardWrite(@RequestBody BoardWriteRequestDTO boardWriteRequestDto,
                                                                 @AuthenticationPrincipal MemberEntity memberEntity) {
        // 현재 실행 중인 스레드를 가져옵니다.
        Thread currentThread = Thread.currentThread();
        log.info("현재 실행중인 스레드: " + currentThread.getName());
        BoardWriteResponseDTO boardSaveDto = boardService.boardWrite(boardWriteRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(boardSaveDto);
    }

    //해달 게시글 수정
    @PatchMapping("/admin/{boardId}/boardUpdate")
    public ResponseEntity<BoardDetailsResponseDTO> adminBoardUpdate(@PathVariable("boardId") Long boardId,
                                                                    @RequestBody BoardUpdateRequestDTO boardUpdateRequestDto) {
        BoardDetailsResponseDTO boardUpdate = boardService.boardUpdate(boardId,boardUpdateRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(boardUpdate);

    }

    //해당 게시물 삭제
    @DeleteMapping("/admin/{boardId}/delete")
    public ResponseEntity<Long> boardDelete(@PathVariable("boardId") Long boardId) {
        boardService.boardDelete(boardId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

//    //리스트에서 게시물 삭제(여러개)
//    @DeleteMapping("admin/{boardId}/listdelete")
//    public ResponseEntity<Long> boardListDelete(@PathVariable("boardId") Long boardId) {
//        boardService.boardDelete(boardId);
//        return ResponseEntity.status(HttpStatus.OK).build();
//    }

    @DeleteMapping("admin/listdelete")
    public ResponseEntity<Void> boardListDelete(@RequestBody List<Long> boardIds) {
        for (Long boardId : boardIds) {
            boardService.boardDelete(boardId);
        }
        return ResponseEntity.ok().build();
    }


}
