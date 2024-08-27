package com.movie.rock.chat.data;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MessageResponseDTO {
    private Long messageId;    // 생성된 메시지의 ID
    private Long chatRoomId;   // 메시지가 속한 채팅방 ID
    private Long senderId;     // 메시지를 보낸 사용자 ID
    private String messageText; // 메시지 내용
    private String timeStamp;  // 메시지 전송 시간

    @Builder
    public MessageResponseDTO(Long messageId, Long chatRoomId, Long senderId, String messageText, String timeStamp){
        this.messageId = messageId;
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.messageText = messageText;
        this.timeStamp = timeStamp;
    }


}
