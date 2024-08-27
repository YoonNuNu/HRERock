package com.movie.rock.chat.data;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private Long roomId;
    private String timestamp;

    @Builder
    public ChatMessage(MessageType type,String content,String sender,Long roomId,String timestamp) {
        this.type = type;
        this.content = content;
        this.sender = sender;
        this.roomId = roomId;
        this.timestamp = timestamp;
    }


    public enum MessageType {   // 메시지의 유형(파일,이미지)가 아닌 상태를 나타내는것
        CHAT,   //일반 채팅 메시지, 즉 사용자가 입력한 텍스트 메시
        JOIN,   //사용자가 채팅방에 참여했음을 나타내는 메시지
        LEAVE   //사용자가 채팅방을 떠났음을 나타내는 메시지
    }
}
