package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.GenresEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenresRepository extends JpaRepository<GenresEntity, Long> {
    Page<GenresEntity> findByGenreNameContaining(String genreName, Pageable pageable);
}