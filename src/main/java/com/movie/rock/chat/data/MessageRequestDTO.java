package com.movie.rock.chat.data;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MessageRequestDTO {

    @JsonProperty("messageText")
    private String messageText;

    @JsonProperty("chatRoomId")
    private Long chatRoomId;


    @Builder
    public MessageRequestDTO(Long chatRoomId, String messageText){
        this.chatRoomId =chatRoomId;
        this.messageText =messageText;
    }
}
