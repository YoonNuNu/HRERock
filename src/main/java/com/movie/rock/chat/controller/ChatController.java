package com.movie.rock.chat.controller;

import com.movie.rock.chat.data.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    // 클라이언트가 메시지를 보낼 때 호출되는 메서드
    @MessageMapping("/chat.send")
    // 처리 결과를 "/topic/public" 주제로 발행
    @SendTo("/topic/chat/{chatRoomId}")
    public ChatMessage sendMessage(@DestinationVariable Long chatRoomId, @Payload ChatMessage chatMessage) {
        // 받은 메시지를 그대로 반환하여 모든 구독자에게 브로드캐스트
        return chatMessage;
    }

    // 새 사용자가 채팅방에 참여할 때 호출되는 메서드
    @MessageMapping("/chat.addUser")
    // 처리 결과를 "/topic/public" 주제로 발행
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에 사용자 이름을 저장
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        // 사용자 참여 메시지를 모든 구독자에게 브로드캐스트
        return chatMessage;
    }
}