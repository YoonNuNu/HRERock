import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

//css
import './css/ChatBot.css';
import styled from "styled-components";
import ChatImg from "./images/chat_image.png"




//■ChatBot ----------------------------------------------------
function ChatBot() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [activeChatRooms, setActiveChatRooms] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showAdminPanel, setShowAdminPanel] = useState(false);

    useEffect(() => {
        const checkUserInfo = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            try {
                const response = await axios.get('/auth/memberinfo', {
                    headers: {'Authorization': 'Bearer ' + token}
                });
                const { memRole, memNum } = response.data;
                setUserRole(memRole);
                setUserId(memNum);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        checkUserInfo();
    }, []);

    const handleAdminChatbotClick = async () => {
        setShowAdminPanel(true);
        await fetchActiveChatRooms();
    };

    const openChatBot = async () => {
        console.log("opnechatbot 함수 호출됨");

        const token = localStorage.getItem('accessToken');
        if (!token){ return; }
        try {
            const response = await axios.post('/api/chatrooms/create', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const newChatRoomId = response.data.chatRoomId;
            setChatRoomId(newChatRoomId);
            setMessages([]);
            messagesRef.current = [];
            setInputMessage('');
            setIsChatOpen(true);
            connectWebSocket(newChatRoomId, token);
            console.log("채팅방 생성 성공");

        } catch (error) {
            console.error("채팅방 생성 실패:", error);
        }
    };

    const connectWebSocket = (roomId, token) => {
        if (stompClient) {
            stompClient.disconnect();
        }

        // 백엔드 서버의 포트를 명확히 지정
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({'Authorization': `Bearer ${token}`}, () => {
            console.log(`Connected to WebSocket, subscribing to /topic/chat/${roomId}`);

            client.subscribe(`/topic/chat/${roomId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages(prevMessages => {
                    if (!prevMessages.some(msg => msg.messageId === receivedMessage.messageId)) {
                        return [...prevMessages, receivedMessage];
                    }
                    return prevMessages;
                });
            });

            setStompClient(client);
        }, (error) => {
            console.error('WebSocket 연결 실패:', error);
        });
    };



    const closeChatBot = () => {
        setIsChatOpen(false);
        setChatRoomId(null);
        setMessages([]);
        messagesRef.current = [];
        if (stompClient) {
            stompClient.disconnect();
            setStompClient(null);
        }
    };

    const fetchActiveChatRooms = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('/api/admin/chatrooms/active', {
                headers: {'Authorization': `Bearer ${token}`}
            });
            setActiveChatRooms(response.data);
            console.log("활성 채팅방 조회 성공:", response.data);

        } catch (error) {
            console.error("활성 채팅방 조회 실패:", error);
        }
    };

    const joinChatRoom = async (chatRoomId) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(`/api/admin/chatrooms/${chatRoomId}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(response.data);
            messagesRef.current = response.data;
            setChatRoomId(chatRoomId);
            setIsChatOpen(true);
            connectWebSocket(chatRoomId, token);
        } catch (error) {
            console.error("채팅방 참여 실패:", error);
        }
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await axios.post('/api/chat/message', {
                messageText: inputMessage,
                chatRoomId: chatRoomId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setInputMessage('');

            // 서버 응답의 메시지를 사용하여 상태 업데이트
            // 로컬에서 메시지를 추가하지 않고, WebSocket을 통해 받은 메시지만 사용
            // setMessages(prevMessages => [...prevMessages, response.data]);
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    useEffect(() => {
        if (chatRoomId) {
            const token = localStorage.getItem('accessToken');
            connectWebSocket(chatRoomId, token);
        }

        return () => {
            if (stompClient) {
                stompClient.disconnect();
                setStompClient(null);
            }
        };
    }, [chatRoomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    if (!userRole) return null;



    //■HTML ---------------------------------
    return (
        <>
            {userRole === 'ADMIN' ? (
                <div className="chatbot-button" onClick={handleAdminChatbotClick}>
                    <button>
                        <img src={ChatImg} />
                    </button>
                </div>
            ) : (
                <div className="chatbot-button" onClick={openChatBot}>
                    <button>
                        <img src={ChatImg} />
                    </button>
                </div>
            )}

            {showAdminPanel && userRole === 'ADMIN' && (
                <div className="admin-chat-panel">
                    <h2>활성 채팅방 목록</h2>
                    <button onClick={fetchActiveChatRooms}>새로고침</button>
                    <button onClick={() => setShowAdminPanel(false)}>닫기</button>
                    <ul>
                        {activeChatRooms.map(room => (
                            <li key={room.chatRoomId}>
                                채팅방 ID: {room.chatRoomId} - 사용자: {room.memId}
                                <button onClick={() => joinChatRoom(room.chatRoomId)}>참여</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isChatOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        {userRole === 'ADMIN' ? (
                            <h3>관리자 채팅 - 사용자: {activeChatRooms.find(room => room.chatRoomId === chatRoomId)?.memId}</h3>
                        ) : (
                            <h3>챗봇 상담</h3>
                        )}
                        <button onClick={userRole === 'ADMIN' ? () => setIsChatOpen(false) : closeChatBot}>
                            {userRole === 'ADMIN' ? '나가기' : '닫기'}
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.senderId === userId ? 'self' : 'other'}`}>
                                <p>{message.messageText}</p>
                                <span className="timestamp">
                                    {message.timeStamp ? new Date(message.timeStamp).toLocaleString() : 'Invalid Date'}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="메시지를 입력하세요..."
                        />
                        <button onClick={sendMessage}>전송</button>
                    </div>
                </div>
            )}
        </>
    );
}
export default ChatBot;
