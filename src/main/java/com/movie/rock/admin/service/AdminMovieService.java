package com.movie.rock.admin.service;

import com.movie.rock.admin.data.request.*;
import com.movie.rock.admin.data.response.*;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminMovieService {

    //AdminMovieListController -> 페이징 처리한 영화목록 조회
    Page<AdminMovieListResponseDTO> getMovieList(Pageable pageable);

    //MovieAdminServiceImpl -> 영화 상세보기
    AdminMovieDetailsResponseDTO getMovieDetails(Long movieId);
    //MovieAdminServiceImpl -> 배우 추가
    ActorResponseDTO addActor(AdminActorAddRequestDTO adminActorAddRequestDTO);

    //MovieAdminServiceImpl -> 감독 추가
    DirectorResponseDTO addDirector(AdminDirectorAddRequestDTO adminDirectorAddRequestDTO);

    //MovieAdminServiceImpl -> 장르 추가
    GenreResponseDTO addGenre(AdminGenreRequestDTO adminGenreRequestDTO);

    //MovieAdminServiceImpl -> 예고편 추가
    TrailerResponseDTO addTrailer(AdminTrailerRequestDTO adminTrailerRequestDTO);

    //MovieAdminServiceImpl -> 포스터 추가
    PosterResponseDTO addPoster(AdminPosterRequestDTO adminPosterRequestDTO);

    //영화 아이디,이름 저장
    AdminMovieFirstInfoTitleResponseDTO saveTitleInfo(AdminMovieFirstInfoTitleRequestDTO adminMovieFirstInfoTitleRequestDTO);

    //영화 첫번째 추가페이지(이름,아이디 제외)
    AdminMovieFirstInfoResponseDTO saveFirstInfo(Long movieId,AdminMovieFirstInfoRequestDTO adminMovieFirstInfoRequestDTO);

    //영화 두번째 추가 페이지(통합 업로드)
    AdminMovieSecondInfoResponseDTO addCompleteMovie(AdminMovieSecondInfoRequestDTO adminMovieSecondInfoRequestDTO);

    //MovieAdminServiceImpl -> 영화 삭제
    void deleteMovies(List<Long> movieIds, List<Long> posterIds, List<Long> trailerIds,List<Long> reviewIds);

    //영화수정
    AdminMovieFirstInfoResponseDTO updateMovieFirst(Long movieId,AdminMovieFirstInfoRequestDTO adminMovieFirstInfoRequestDTO);

    //영화 두번째 추가 페이지수정
    AdminMovieSecondInfoResponseDTO updateMovieSecond(Long movieId,AdminMovieSecondInfoUpdateRequestDTO adminMovieSecondInfoUpdateRequestDTO);

    //영화 검색
//    Page<AdminMovieListResponseDTO> search(AdminMovieListSearchRequestDTO searchData, Pageable pageable);

    //통합 검색
    Page<AdminMovieListResponseDTO> findByAllSearch(String searchTerm, Pageable pageable);


    //영화 제목 중복검색
    boolean existsByTitle(String movieTitle);

    Page<DirectorResponseDTO> searchDirectors(String query, Pageable pageable);
    Page<ActorResponseDTO> searchActors(String query, Pageable pageable);
    Page<GenreResponseDTO> searchGenres(String query, Pageable pageable);


    AdminMovieFirstInfoResponseDTO getMovieById(Long movieId);


    AdminMovieSecondInfoResponseDTO getMovieByIdForSecondPage(Long movieId);

}