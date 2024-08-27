package com.movie.rock.chat.service;


import com.movie.rock.chat.data.*;
import com.movie.rock.config.JwtUtil;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final ChatRoomRepository chatRoomRepository;

    private final MessageRepository messageRepository;

    private final MemberRepository memberRepository;

    private final SimpMessagingTemplate messagingTemplate;

    private final JwtUtil jwtUtil;

    //메시지 전송
    public MessageResponseDTO sendMessage(MessageRequestDTO messageRequestDto, String token) {
        String memId = jwtUtil.extractMemberId(token);
        System.out.println("Extracted memId from token: " + memId);

        MemberEntity sender = memberRepository.findByMemId(memId)
                .orElseThrow(() -> new RuntimeException("Sender not found for memId: " + memId));
        System.out.println("Found sender: " + sender.getMemNum());

        ChatRoomEntity chatRoom = chatRoomRepository.findById(messageRequestDto.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        MessageEntity messageEntity = MessageEntity.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .messageText(messageRequestDto.getMessageText())
                .timeStamp(LocalDateTime.now())
                .build();

        messageEntity = messageRepository.save(messageEntity);
        System.out.println("Saved message with senderId: " + messageEntity.getSender().getMemNum());

        MessageResponseDTO responseDto = convertToDto(messageEntity);

        // WebSocket을 통해 메시지 전송
        messagingTemplate.convertAndSend("/topic/chat/" + responseDto.getChatRoomId(), responseDto);

        return responseDto;
    }

    // 메시지 가져오기
    public List<MessageResponseDTO> getChatRoomMessages(Long chatRoomId) {
        List<MessageEntity> messages = messageRepository.findByChatRoomChatRoomIdOrderByTimeStampAsc(chatRoomId);
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private MessageResponseDTO convertToDto(MessageEntity entity) {
        return MessageResponseDTO.builder()
                .messageId(entity.getMessageId())
                .chatRoomId(entity.getChatRoom().getChatRoomId())
                .senderId(entity.getSender().getMemNum())
                .messageText(entity.getMessageText())
                .timeStamp(entity.getTimeStamp().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss")))
                .build();
    }

    //관리자 응답
    public MessageResponseDTO adminReply(MessageRequestDTO messageRequestDto, String token) {
        String memId = jwtUtil.extractMemberId(token);
        MemberEntity admin = memberRepository.findByMemId(memId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // 관리자 권한 확인 로직 추가 필요

        ChatRoomEntity chatRoom = chatRoomRepository.findById(messageRequestDto.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        MessageEntity messageEntity = MessageEntity.builder()
                .chatRoom(chatRoom)
                .sender(admin)
                .messageText(messageRequestDto.getMessageText())
                .timeStamp(LocalDateTime.now())
                .build();

        messageEntity = messageRepository.save(messageEntity);

        MessageResponseDTO responseDto = convertToDto(messageEntity);

        // WebSocket을 통해 메시지 전송
        messagingTemplate.convertAndSend("/topic/chat/" + responseDto.getChatRoomId(), responseDto);

        return responseDto;
    }
}