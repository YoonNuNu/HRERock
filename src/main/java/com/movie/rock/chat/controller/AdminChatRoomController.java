package com.movie.rock.chat.controller;


import com.movie.rock.chat.data.ChatRoomResponseDTO;
import com.movie.rock.chat.data.MessageRequestDTO;
import com.movie.rock.chat.data.MessageResponseDTO;
import com.movie.rock.chat.service.ChatRoomService;
import com.movie.rock.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/chatrooms")
@RequiredArgsConstructor
public class AdminChatRoomController {

    private final ChatRoomService chatRoomService;
    private final MessageService messageService;

    @GetMapping("/active")
    public ResponseEntity<List<ChatRoomResponseDTO>> getActiveChatRooms() {
        List<ChatRoomResponseDTO> activeChatRooms = chatRoomService.getAllActiveChatRooms();
        return ResponseEntity.ok(activeChatRooms);
    }

    @GetMapping("/{chatRoomId}")
    public ResponseEntity<ChatRoomResponseDTO> getChatRoom(@PathVariable("chatRoomId") Long chatRoomId) {
        ChatRoomResponseDTO chatRoom = chatRoomService.getChatRoomById(chatRoomId);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/{chatRoomId}/messages")
    public ResponseEntity<List<MessageResponseDTO>> getChatRoomMessages(@PathVariable("chatRoomId") Long chatRoomId) {
        List<MessageResponseDTO> messages = messageService.getChatRoomMessages(chatRoomId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{chatRoomId}/reply")
    public ResponseEntity<MessageResponseDTO> adminReply(
            @PathVariable("chatRoomId") Long chatRoomId,
            @RequestBody MessageRequestDTO messageRequestDto,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        MessageRequestDTO newRequestDto = new MessageRequestDTO(
                chatRoomId,
                messageRequestDto.getMessageText()
        );
        MessageResponseDTO response = messageService.adminReply(newRequestDto, token);
        return ResponseEntity.ok(response);
    }
}
