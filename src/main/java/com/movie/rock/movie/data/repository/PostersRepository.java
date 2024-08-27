package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.PostersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostersRepository extends JpaRepository<PostersEntity, Long> {
}
