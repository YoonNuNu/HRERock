    package com.movie.rock.movie.data.response;

    import lombok.Builder;
    import lombok.Getter;
    import lombok.NoArgsConstructor;

    @Getter
    @NoArgsConstructor
    public class MovieFavorResponseDTO {
        private Long movieId;
        private Long memNum;
        private String movieTitle;
        private boolean isFavorite;
        private Long favorCount;


        public MovieFavorResponseDTO(Long movieId, String movieTitle, boolean isFavorite, Long favorCount, Long memNum) {
            this.movieId = movieId;
            this.movieTitle = movieTitle;
            this.isFavorite = isFavorite;
            this.favorCount = favorCount;
            this.memNum = memNum;
        }

        @Builder
        public static MovieFavorResponseDTO fromEntity(Long movieId, String movieTitle, boolean isFavorite, Long favorCount, Long memNum) {
            return MovieFavorResponseDTO.builder()
                    .movieId(movieId)
                    .movieTitle(movieTitle)
                    .isFavorite(false)
                    .favorCount(favorCount)
                    .memNum(memNum)
                    .build();
        }
    }