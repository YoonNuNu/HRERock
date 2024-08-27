package com.movie.rock.chat.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity,Long>{
    List<MessageEntity> findByChatRoomChatRoomIdOrderByTimeStampAsc(Long chatRoomId);


}
