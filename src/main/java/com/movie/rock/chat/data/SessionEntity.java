package com.movie.rock.chat.data;


import com.movie.rock.common.BaseTimeEntity;
import com.movie.rock.member.data.MemberEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "chat_session")
public class SessionEntity extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name = "mem_num")
    private MemberEntity member;

    @Column(name = "session_token",nullable = false)
    private String sessionToken;


    public  SessionEntity(Long sessionId,MemberEntity member,String sessionToken){
        this.sessionId =sessionId;
        this.member =member;
        this.sessionToken =sessionToken;
    }

}
