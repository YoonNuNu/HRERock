package com.movie.rock.chat.controller;


import com.movie.rock.chat.data.ChatRoomResponseDTO;
import com.movie.rock.chat.service.ChatRoomService;
import com.movie.rock.config.JwtUtil;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.member.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatrooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    private final JwtUtil jwtUtil;

    private final CustomUserDetailsService customUserDetailsService;

    @PostMapping("/create")
    public ResponseEntity<ChatRoomResponseDTO> createChatRoom(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // "Bearer " 제거
        String memId = jwtUtil.extractMemberId(token);

        CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(memId);
        Long memNum = userDetails.getMemNum();

        ChatRoomResponseDTO chatRoom = chatRoomService.createOrReopenChatRoom(memNum);
        return ResponseEntity.ok(chatRoom);
    }

    @PostMapping("/{chatRoomId}/close")
    public ResponseEntity<ChatRoomResponseDTO> closeChatRoom(@PathVariable("chatRoomId") Long chatRoomId) {
        ChatRoomResponseDTO closedRoom = chatRoomService.closeChatRoom(chatRoomId);
        return ResponseEntity.ok(closedRoom);
    }
}
