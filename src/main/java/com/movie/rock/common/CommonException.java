package com.movie.rock.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter // 이 어노테이션이 모든 필드에 대한 getter 메서드를 생성합니다.
public class CommonException extends RuntimeException {

    private final String errCode;
    private final HttpStatus status;

    public CommonException(String message, String errCode, HttpStatus status) {
        super(message);
        this.errCode = errCode;
        this.status = status;
    }

    public static class DuplicateReviewException extends CommonException {
        public DuplicateReviewException() {
            super("이미 리뷰를 작성했습니다.", "ERR_DUPLICATE_REVIEW", HttpStatus.BAD_REQUEST);
        }
    }

    //확인완료
    public static class MovieNotFoundException extends CommonException {
        public MovieNotFoundException() {
            super("영화가 존재하지 않습니다.", "ERR_MOVIE_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    public static class ReviewNotFoundException extends CommonException {
        public ReviewNotFoundException() {
            super("리뷰를 찾을 수 없습니다.", "ERR_REVIEW_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    public static class UnauthorizedAccessException extends CommonException {
        public UnauthorizedAccessException() { super("접근권한이 없습니다.", "ERR_UNAUTHORIZED", HttpStatus.FORBIDDEN); }
    }

    public static class MemberNotFoundException extends CommonException {
        public MemberNotFoundException() { super("회원을 찾을 수 없습니다.", "ERR_MEMBER_NOT_FOUND", HttpStatus.NOT_FOUND); }
    }

    public static class FilmNotFoundException extends CommonException {
        public FilmNotFoundException() { super("영화 재생 필름을 찾을 수 없습니다.", "ERR_FILM_NOT_FOUND", HttpStatus.NOT_FOUND); }
    }

    public static class FavoritesNotFoundException extends CommonException {
        public FavoritesNotFoundException() { super("찜한 영화를 찾을 수 없습니다.", "ERR_FAVORITES_NOT_FOUND", HttpStatus.NOT_FOUND); }
    }

    public static class DuplicateActorException extends CommonException {
        public DuplicateActorException() { super("동일한 배우가 있습니다.", "ERR_DUPLICATE_ACTOR", HttpStatus.BAD_REQUEST); }
    }

    public static class DuplicateDirectorException extends CommonException {
        public DuplicateDirectorException() { super("동일한 배우가 있습니다.", "ERR_DUPLICATE_DIRECTOR", HttpStatus.BAD_REQUEST); }
    }

    public static class InvalidActorPhotoTypeException extends CommonException {
        public InvalidActorPhotoTypeException() { super("배우 사진 타입이 아닙니다.", "ERR_INVALID_ACTOR_PHOTO_TYPE", HttpStatus.BAD_REQUEST); }
    }

    public static class InvalidDirectorPhotoTypeException extends CommonException {
        public InvalidDirectorPhotoTypeException() { super("감독 사진 타입이 아닙니다.", "ERR_INVALID_DIRECTOR_PHOTO_TYPE", HttpStatus.BAD_REQUEST); }
    }

    public static class PostersByMovieNotFoundException extends CommonException {
        public PostersByMovieNotFoundException() { super("해당 영화의 포스터를 찾을 수 없습니다.", "ERR_POSTERS_NOT_FOUND", HttpStatus.NOT_FOUND); }
    }

    //확인완료
    public static class R_RatedCommonException extends CommonException {
        public R_RatedCommonException() { super("청소년 관람 불가 등급의 영화입니다.", "ERR_R_RATED_MOVIE", HttpStatus.BAD_REQUEST); }
    }

    public static class ExceedReviewCharacterException extends CommonException {
        public ExceedReviewCharacterException() { super("리뷰는 50자 내로 작성해야 합니다.", "ERR_EXCEED_CHARACTER", HttpStatus.BAD_REQUEST); }
    }

    public static class TokenExpiredException extends CommonException {
        public TokenExpiredException() { super("로그인 세션이 만료되었습니다. 다시 로그인해주세요", "ERR_TOKEN_EXPIRED", HttpStatus.BAD_REQUEST); }
    }

    public static class InvalidTokenException extends CommonException {
        public InvalidTokenException() { super("유효하지 않은 토큰입니다.", null, HttpStatus.BAD_REQUEST); }
    }

    public static class AttractionPointsNotFoundException extends CommonException {
        public AttractionPointsNotFoundException() { super("매력 포인트를 찾을 수 없습니다.", null, HttpStatus.NOT_FOUND); }
    }

    public static class EmotionPointsNotFoundException extends CommonException {
        public EmotionPointsNotFoundException() { super("감정 포인트를 찾을 수 없습니다.", null, HttpStatus.NOT_FOUND); }
    }

    public static class DuplicateUrlException extends CommonException{
        public DuplicateUrlException() { super("중복된 URL 주소입니다.", "ERR_DUPLICATE_URL", HttpStatus.BAD_REQUEST); }
    }
}