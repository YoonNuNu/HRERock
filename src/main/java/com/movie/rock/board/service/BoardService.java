package com.movie.rock.board.service;

import com.movie.rock.board.data.*;
import com.movie.rock.common.ResourceNotFoundException;
import com.movie.rock.member.data.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor //오토와이드는 변경시 요소에 대한 안정성이 떨어질수 있으므로 @RequiredArgsConstructor씀
public class BoardService {
    //의존성 주입
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    //페이징 리스트보기
    public Page<BoardListResponseDTO> getAllBoards(Pageable pageable) {
        Page<BoardEntity> boards = boardRepository.findAllBoardsList(pageable);
        List<BoardListResponseDTO> list = boards.getContent().stream()
                .map(BoardListResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(list,pageable,boards.getTotalElements());
    }

    //공지사항 검색 매개변수 = 서치dto, pageable(페이징 처리)
    public Page<BoardListResponseDTO> boardSearch(BoardSearchRequestDTO boardSearchRequestData, Pageable pageable) {
        Page<BoardEntity> result = null;
        //제목으로 찾기
        if(!boardSearchRequestData.getBoardTitle().isEmpty()) {
            result = boardRepository.findByTitle(boardSearchRequestData.getBoardTitle(),pageable);
        }else if(!boardSearchRequestData.getBoardContent().isEmpty()) { //내용으로 찾기
            result = boardRepository.findByContent(boardSearchRequestData.getBoardContent(), pageable);
        }
        //찾은것을 리스트로 담기
        List<BoardListResponseDTO> list =result.getContent().stream().map(
                BoardListResponseDTO::fromEntity
        ).collect(Collectors.toList());

        return new PageImpl<>(list,pageable,result.getTotalElements());
    }

    //게시글 등록(관리자)
    public BoardWriteResponseDTO boardWrite(BoardWriteRequestDTO boardWriteRequestDto) {
        //BoardWriteResponseDto의 ofEntity는 정적메서드(static)이므로 
        // BoardWriteDto boardWriteRequestDto = new BoardWriteDto()를 생략가능
        BoardEntity boardEntity = BoardWriteRequestDTO.ofEntity(boardWriteRequestDto);
        BoardEntity boardSave = boardRepository.save(boardEntity);

        //BoardWriteResponseDto의 fromEntity의 형식으로 boardSave데이터 넣고 반환
        return BoardWriteResponseDTO.fromEntity(boardSave);
    }

    //게시글 상세보기(모든사람)
    public BoardDetailsResponseDTO boardDetail(Long boardId) {
        //boardEntity의 findBoard =  boardRepository에서 findByDetailBoardId(boardId)통해 해당 게시글(boardId,title,content)을 가져온다
        BoardEntity findBoard = boardRepository.findByBoardId(boardId)
                .orElseThrow(//예외처리 boardId를 못찾았을때
                        () -> new ResourceNotFoundException("Board","Board Id",String.valueOf(boardId))
                );

        //조회수 증가
        findBoard.upViewCount();

        //BoardDetailsResponseDto의 fromEntity를  findBoard데이터 넣고 반환
        return BoardDetailsResponseDTO.fromEntity(findBoard);
    }

    //게시글 수정(관리자)
    public BoardDetailsResponseDTO boardUpdate(Long boardId, BoardUpdateRequestDTO boardUpdateRequestDto) {
        BoardEntity boardUpdate = boardRepository.findByBoardId(boardId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Board","Board Id",String.valueOf(boardId))
                );
        //게시글 수정 메서드는 boardEntity에
        boardUpdate.BoardUpdate(boardUpdateRequestDto.getBoardTitle(),boardUpdateRequestDto.getBoardContent());
        return BoardDetailsResponseDTO.fromEntity(boardUpdate);
    }

    //게시글 삭제(관리자)
    public void boardDelete(Long boardId) {
        boardRepository.deleteById(boardId);
    }

    //게시글 삭제(여러개 삭제)
    public void boardListDelete(List<Long> boardId) {
        boardRepository.deleteAllById(boardId);
    }
}
