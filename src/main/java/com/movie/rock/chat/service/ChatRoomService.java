package com.movie.rock.chat.service;


import com.movie.rock.chat.data.ChatRoomEntity;
import com.movie.rock.chat.data.ChatRoomRepository;
import com.movie.rock.chat.data.ChatRoomResponseDTO;
import com.movie.rock.chat.data.MessageRepository;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository; //
    private final MemberRepository memberRepository;

    //채팅방 생성
    @Transactional
    public ChatRoomResponseDTO createOrReopenChatRoom(Long memNum) {
//        log.info("Creating or reopening chat room for member: {}", memNum);

        Optional<ChatRoomEntity> existingRoom = chatRoomRepository.findByMemberMemNumAndStatus(memNum, "active");

        if (existingRoom.isPresent()) {
//            log.info("Active chat room already exists: {}", existingRoom.get());
            return ChatRoomResponseDTO.fromEntity(existingRoom.get());
        }

        Optional<ChatRoomEntity> closedRoom = chatRoomRepository.findByMemberMemNumAndStatus(memNum, "closed");

        if (closedRoom.isPresent()) {
            ChatRoomEntity roomToReopen = closedRoom.get();
            log.info("Reopening closed chat room: {}", roomToReopen);
            roomToReopen.reopenChatRoom();
            chatRoomRepository.save(roomToReopen);
            return ChatRoomResponseDTO.fromEntity(roomToReopen);
        }

        MemberEntity member = memberRepository.findById(memNum)
                .orElseThrow(() -> new RuntimeException("User not found"));
//        log.info("Creating new chat room for member: {}", member);

        ChatRoomEntity newRoom = ChatRoomEntity.builder()
                .member(member)
                .status("active")
                .closedTime(null)
                .build();

        try {
            newRoom = chatRoomRepository.save(newRoom);
            log.info("Saved new chat room: {}", newRoom);
        } catch (Exception e) {
            log.error("Error saving new chat room", e);
            throw e;
        }

        return ChatRoomResponseDTO.fromEntity(newRoom);
    }

    @Transactional
    public ChatRoomResponseDTO closeChatRoom(Long chatRoomId) {
//        log.info("Closing chat room with ID: {}", chatRoomId);
        ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        chatRoomEntity.closeChatRoom(LocalDateTime.now());
        chatRoomRepository.save(chatRoomEntity);
//        log.info("Closed chat room: {}", chatRoomEntity);

        return ChatRoomResponseDTO.fromEntity(chatRoomEntity);
    }

    // 활성 채팅방 목록 조회
    @Transactional(readOnly = true)
    public List<ChatRoomResponseDTO> getAllActiveChatRooms() {
        List<ChatRoomEntity> activeChatRooms = chatRoomRepository.findByStatus("active");
        return activeChatRooms.stream()
                .map(ChatRoomResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 채팅방 조회(관리자)
    @Transactional(readOnly = true)
    public ChatRoomResponseDTO getChatRoomById(Long chatRoomId) {
        ChatRoomEntity chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        return ChatRoomResponseDTO.fromEntity(chatRoom);
    }


}
