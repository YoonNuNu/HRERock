package com.movie.rock.chat.data;

import com.movie.rock.common.BaseTimeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.transaction.annotation.Transactional;


@Getter
@NoArgsConstructor
@Transactional
public class ChatRoomResponseDTO{
    private Long chatRoomId;    //채팅방 ID
    private Long userId;        // 사용자 번호(memNum)
    private String memId;       // 사용자 ID
    private String status;      // 채팅방 상태(active,close)
    private String createDate;     //생성 날짜
    
    
    @Builder
    public ChatRoomResponseDTO(Long chatRoomId,Long userId,String memId,String status, String createDate){
        this.chatRoomId = chatRoomId;
        this.userId = userId;
        this.memId = memId;
        this.status = status;
        this.createDate = createDate;
        
    }

    public static ChatRoomResponseDTO fromEntity(ChatRoomEntity chatRoomEntity) {
        return ChatRoomResponseDTO.builder()
                .chatRoomId(chatRoomEntity.getChatRoomId())
                .userId(chatRoomEntity.getMember() != null ? chatRoomEntity.getMember().getMemNum() : null)
                .memId(chatRoomEntity.getMember() != null ? chatRoomEntity.getMember().getMemId() : null)
                .status(chatRoomEntity.getStatus())
                .createDate(chatRoomEntity.getCreateDate())
                .build();
    }
}
