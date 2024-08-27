package com.movie.rock.common;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@MappedSuperclass //부모클래스에서 만든 필드를 자식클래스에 조건없이 사용할 수있음
@EntityListeners(AuditingEntityListener.class) //작성일자, 수정일자 자동생성
public class BaseTimeEntity {
    //생성날짜
    @CreatedDate
    @Column(name = "create_date" ,updatable = false)
    public String createDate;

    //수정날짜
    @LastModifiedDate
    @Column(name = "modify_date")
    public String modifyDate;

    //현재시간가져오기
    @PrePersist
    public void createDateNow() {
        this.createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
        this.modifyDate = this.createDate;
    }
    
    //수정날짜 가져오기
    @PreUpdate
    public void modifyDateNow() {
        this.modifyDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
    }

}
