package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.TrailersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrailersRepository extends JpaRepository<TrailersEntity, Long> {
}
