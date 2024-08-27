package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.DirectorsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectorsRepository extends JpaRepository<DirectorsEntity, Long> {
    Page<DirectorsEntity> findByDirectorNameContaining(String directorName, Pageable pageable);
}