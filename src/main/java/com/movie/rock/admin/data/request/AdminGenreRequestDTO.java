package com.movie.rock.admin.data.request;


import com.movie.rock.movie.data.entity.GenresEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminGenreRequestDTO {

    private Long genreId;
    private String genreName;

    //생성자
    private AdminGenreRequestDTO(Long genreId,String genreName){
        this.genreId = genreId;
        this.genreName = genreName;
    }

    //생성자에 넣을 데이터
    @Builder
    public static GenresEntity ofEntity(AdminGenreRequestDTO adminGenreRequestDTO){
        return  GenresEntity.builder()
                .genreId(adminGenreRequestDTO.getGenreId())
                .genreName(adminGenreRequestDTO.getGenreName())
                .build();
    }
}
