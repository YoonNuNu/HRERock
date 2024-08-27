package com.movie.rock.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

//예외처리를 위한 컨트롤러 - API개발용(MemberException.Class)
@RestControllerAdvice
public class CommonExceptionHandler {

    @ExceptionHandler(CommonException.class)
    public ResponseEntity<Map<String, String>> handleCommonException(CommonException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("errCode", ex.getErrCode());
        return new ResponseEntity<>(body, ex.getStatus());
    }

//    @ExceptionHandler(UnauthorizedAccessException.class)
//    public String handleUnauthorizedAccess(UnauthorizedAccessException ue) {
//        return "redirect:/login";
//    }
}