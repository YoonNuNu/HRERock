package com.movie.rock.movie.data.response;

import com.movie.rock.movie.data.entity.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

public class MovieInfoResponseDTO {

    @Getter
    @NoArgsConstructor
    public static class ActorResponseDTO {

        private Long actorId;
        private String actorName;
        private Integer actorBirth;
        private List<PhotoResponseDTO> actorPhoto;

        @Builder
        public ActorResponseDTO(Long actorId, String actorName, Integer actorBirth, List<PhotoResponseDTO> actorPhoto) {
            this.actorId = actorId;
            this.actorName = actorName;
            this.actorBirth = actorBirth;
            this.actorPhoto = actorPhoto;
        }

        public static ActorResponseDTO fromEntity(ActorsEntity actors) {
            if (actors == null) {
                return null;
            }
            List<PhotoResponseDTO> photos = actors.getActorPhotos().stream()
                    .map(photoEntity -> PhotoResponseDTO.fromEntity(photoEntity.getPhotos()))
                    .collect(Collectors.toList());

            return ActorResponseDTO.builder()
                    .actorId(actors.getActorId())
                    .actorName(actors.getActorName())
                    .actorBirth(actors.getActorBirth())
                    .actorPhoto(photos)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class DirectorResponseDTO {

        private Long directorId;
        private String directorName;
        private Integer directorBirth;
        private List<PhotoResponseDTO> directorPhoto;

        @Builder
        public DirectorResponseDTO(Long directorId, String directorName, Integer directorBirth, List<PhotoResponseDTO> directorPhoto) {
            this.directorId = directorId;
            this.directorName = directorName;
            this.directorBirth = directorBirth;
            this.directorPhoto = directorPhoto;
        }

        public static DirectorResponseDTO fromEntity(DirectorsEntity director) {
            if (director == null) {
                return null;
            }
            List<PhotoResponseDTO> photos = director.getDirectorPhotos().stream()
                    .map(photoEntity -> PhotoResponseDTO.fromEntity(photoEntity.getPhotos()))
                    .collect(Collectors.toList());

            return DirectorResponseDTO.builder()
                    .directorId(director.getDirectorId())
                    .directorName(director.getDirectorName())
                    .directorBirth(director.getDirectorBirth())
                    .directorPhoto(photos)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class GenreResponseDTO {
        private Long genreId;
        private String genreName;

        @Builder
        public GenreResponseDTO(Long genreId, String genreName) {
            this.genreId = genreId;
            this.genreName = genreName;
        }

        public static GenreResponseDTO fromEntity(GenresEntity genres) {
            if (genres == null) {
                return null;
            }
            return GenreResponseDTO.builder()
                    .genreId(genres.getGenreId())
                    .genreName(genres.getGenreName())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class PosterResponseDTO {
        private Long posterId;
        private String posterUrls;
        private Boolean mainPoster;

        @Builder
        public PosterResponseDTO(Long posterId, String posterUrls, Boolean mainPoster) {
            this.posterId = posterId;
            this.posterUrls = posterUrls;
            this.mainPoster = mainPoster;
        }

        public static PosterResponseDTO fromEntity(PostersEntity poster) {
            if (poster == null) {
                return null;
            }
            return PosterResponseDTO.builder()
                    .posterId(poster.getPosterId())
                    .posterUrls(poster.getPosterUrls())
                    .mainPoster(poster.getMainPoster())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class TrailerResponseDTO {
        private Long trailerId;
        private String trailerUrls;
        private Boolean mainTrailer;

        @Builder
        public TrailerResponseDTO(Long trailerId, String trailerUrls, Boolean mainTrailer) {
            this.trailerId = trailerId;
            this.trailerUrls = trailerUrls;
            this.mainTrailer = mainTrailer;
        }

        public static TrailerResponseDTO fromEntity(TrailersEntity trailer) {
            if (trailer == null) {
                return null;
            }
            return TrailerResponseDTO.builder()
                    .trailerId(trailer.getTrailerId())
                    .trailerUrls(trailer.getTrailerUrls())
                    .mainTrailer(trailer.getMainTrailer())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class FilmResponseDTO {
        private Long filmId;
        private String movieFilm;

        @Builder
        public FilmResponseDTO(Long filmId, String movieFilm) {
            this.filmId = filmId;
            this.movieFilm = movieFilm;
        }

        public static FilmResponseDTO fromEntity(MovieFilmEntity movieFilm) {
            if (movieFilm == null) {
                return null;
            }
            return FilmResponseDTO.builder()
                    .filmId(movieFilm.getFilmId())
                    .movieFilm(movieFilm.getMovieFilm())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class PhotoResponseDTO {
        private Long photoId;
        private String photoUrl;

        @Builder
        public PhotoResponseDTO(Long photoId, String photoUrl) {
            this.photoId = photoId;
            this.photoUrl = photoUrl;
        }

        public static PhotoResponseDTO fromEntity(PhotosEntity photos) {
            if (photos == null) {
                return null;
            }
            return PhotoResponseDTO.builder()
                    .photoId(photos.getPhotoId())
                    .photoUrl(photos.getPhotoUrls()) // photos.getPhotoUrls() -> photos.getPhotoUrl()로 변경
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class ActorsPhotosResponseDTO {
        private PhotosEntity photos;
        private ActorsEntity actors;

        @Builder
        public ActorsPhotosResponseDTO(PhotosEntity photos, ActorsEntity actors) {
            this.photos = photos;
            this.actors = actors;
        }

        public static ActorsPhotosResponseDTO fromEntity(ActorsPhotosEntity actorsPhotos) {
            if (actorsPhotos == null) {
                return null;
            }
            return ActorsPhotosResponseDTO.builder()
                    .photos(actorsPhotos.getPhotos())
                    .actors(actorsPhotos.getActor())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class DirectorsPhotosResponseDTO {
        private PhotosEntity photos;
        private DirectorsEntity directors;

        @Builder
        public DirectorsPhotosResponseDTO(PhotosEntity photos, DirectorsEntity directors) {
            this.photos = photos;
            this.directors = directors;
        }

        public static DirectorsPhotosResponseDTO fromEntity(DirectorsPhotosEntity directorsPhotos) {
            if (directorsPhotos == null) {
                return null;
            }
            return DirectorsPhotosResponseDTO.builder()
                    .photos(directorsPhotos.getPhotos())
                    .directors(directorsPhotos.getDirector())
                    .build();
        }
    }
}
