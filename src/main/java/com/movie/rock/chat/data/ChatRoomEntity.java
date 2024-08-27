package com.movie.rock.chat.data;


import com.movie.rock.common.BaseTimeEntity;
import com.movie.rock.member.data.MemberEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat")
@Getter
@NoArgsConstructor
public class ChatRoomEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_Room_id")
    private Long chatRoomId;

    @ManyToOne(fetch = FetchType.LAZY)   //추후 수정
    @JoinColumn(name = "mem_num")
    private MemberEntity member;

    @Column(name = "chat_status")
    private String status;

    @Column(name = "closed_time")
    private LocalDateTime closedTime;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<MessageEntity> messages;

    @Builder
    public ChatRoomEntity(Long chatRoomId, MemberEntity member, String status,LocalDateTime closedTime,List<MessageEntity> messages) {
        this.chatRoomId = chatRoomId;
        this.member = member;
        this.status = status;
        this.closedTime = closedTime;
        this.messages = messages;
    }

    //상태변경메서드
    public void closeChatRoom(LocalDateTime closedTime){
            this.status = "closed";
            this.closedTime = closedTime;
    }

    public void reopenChatRoom() {
        this.status = "active";
        this.closedTime = null;
    }
}