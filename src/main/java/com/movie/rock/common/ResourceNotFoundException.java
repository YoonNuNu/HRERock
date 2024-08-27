package com.movie.rock.common;

//예외처리 핸들러
public class ResourceNotFoundException extends RuntimeException{
    //객체 직렬화 역직렬화
    private static final long serialVersionUID = 1L;

    //RuntimeException(message)
    //resourceName-찾을 수 없는 자원명
    String resourceName;

    //fieldName-필드 이름
    String fieldName;

    //fieldValue-필드 값
    String fieldValue;

    //생성자 주입
    public ResourceNotFoundException(String resourceName,String fieldName, String fieldValue) {
        super(String.format("%s is not found[%s: %s]",resourceName,fieldName,fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
