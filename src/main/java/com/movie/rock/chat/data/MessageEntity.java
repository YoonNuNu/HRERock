package com.movie.rock.chat.data;


import com.movie.rock.common.BaseTimeEntity;
import com.movie.rock.member.data.MemberEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "chat_message")
public class MessageEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @ManyToOne
    @JoinColumn(name = "chat_Room_id")
    private ChatRoomEntity chatRoom;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private MemberEntity sender;  //member테이블에 추가

    @Column(name = "message_text")
    private String messageText;

    @Column(name = "time_stamp")
    private LocalDateTime timeStamp;

    @Builder
    public MessageEntity(Long messageId,ChatRoomEntity chatRoom,MemberEntity sender,String messageText,LocalDateTime timeStamp){
        this.messageId = messageId;
        this.chatRoom = chatRoom;
        this.sender = sender;
        this.messageText = messageText;
        this.timeStamp = timeStamp;
    }
}