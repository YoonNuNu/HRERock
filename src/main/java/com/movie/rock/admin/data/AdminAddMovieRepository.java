package com.movie.rock.admin.data;


import com.movie.rock.movie.data.entity.MovieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminAddMovieRepository extends JpaRepository<MovieEntity,Long> {

//    <Optional>MovieEntity findByMovieId(Long movieId);
}