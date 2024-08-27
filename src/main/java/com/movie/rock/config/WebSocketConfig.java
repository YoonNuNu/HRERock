package com.movie.rock.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // 메시지 브로커에 대한 설정 (ex: /topic/chatroom)
        config.setApplicationDestinationPrefixes("/app"); // 클라이언트에서 메시지 보낼 때 사용할 prefix (ex: /app/chat)
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // WebSocket 엔드포인트
                .setAllowedOrigins("http://localhost:3000") // 허용할 오리진 (React의 개발 서버 URL) 필요시 "http://localhost:8080"
                .withSockJS(); // SockJS 지원
    }
}

