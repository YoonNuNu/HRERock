package com.movie.rock.movie.data.repository;

import com.movie.rock.member.data.MyPageFavorResponseDTO;
import com.movie.rock.movie.data.entity.MovieFavorEntity;
import com.movie.rock.movie.data.pk.MovieFavorPK;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieFavorRepository extends JpaRepository<MovieFavorEntity, MovieFavorPK> {

    //영화 Id에 대한 찜 엔티티 조회
//    List<MovieFavorEntity> findByMovieMovieId(Long movieId);

    //찜 총 갯수
    @Query("SELECT COUNT(mf) FROM MovieFavorEntity mf WHERE mf.movie.movieId = :movieId")
    Long countByMovieMovieId(@Param("movieId") Long movieId);

    //찜 존재여부
    boolean existsByMemberMemNumAndMovieMovieId(Long memNum, Long movieId);

    //찜 제거
    void deleteByMemberMemNumAndMovieMovieId(Long memNum, Long movieId);

    //회원 찜 리스트
    List<MovieFavorEntity> findByMemberMemNum(Long memNum);

    //마이페이지 회원찜
    Page<MovieFavorEntity> findByMemberMemNum(Long memNum, Pageable pageable);

    //마이페이지 찜하기 메인포스터 가져오기
    @Query("SELECT new com.movie.rock.member.data.MyPageFavorResponseDTO(m.movieId, m.movieTitle, " +
            "p.posters.posterId, p.posters.posterUrls, p.posters.mainPoster, mf.member.memNum, true) " +
            "FROM MovieFavorEntity mf " +
            "JOIN mf.movie m " +
            "LEFT JOIN m.poster p " +
            "WHERE mf.member.memNum = :memNum " +
            "AND (p.posters.mainPoster = true OR p.posters IS NULL OR NOT EXISTS(SELECT 1 FROM MoviePostersEntity mp WHERE mp.movie = m AND mp.posters.mainPoster = true)) " +
            "ORDER BY m.createDate DESC")
    Page<MyPageFavorResponseDTO> findFavoriteMoviesWithMainPoster(@Param("memNum") Long memNum, Pageable pageable);
}
