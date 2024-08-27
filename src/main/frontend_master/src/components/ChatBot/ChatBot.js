import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import './css/ChatBot.css';

function ChatBot() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [activeChatRooms, setActiveChatRooms] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showAdminPanel, setShowAdminPanel] = useState(false);

    const api = axios.create({
        baseURL: "http://localhost:8080"
    });

    useEffect(() => {
        const checkUserInfo = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            try {
                const response = await api.get(`/auth/memberinfo`, {
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

    const connectWebSocket = useCallback((roomId, token) => {
        if (stompClient) {
            stompClient.deactivate();
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${api.defaults.baseURL}/ws`),
            connectHeaders: {
                'Authorization': `Bearer ${token}`
            },
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
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
        };

        client.onStompError = (frame) => {
            console.error('STOMP error', frame);
        };

        client.activate();
        setStompClient(client);
    }, [api.defaults.baseURL]);

    const openChatBot = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await api.post('/api/chatrooms/create', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const newChatRoomId = response.data.chatRoomId;
            setChatRoomId(newChatRoomId);
            setMessages([]);
            setInputMessage('');
            setIsChatOpen(true);
            connectWebSocket(newChatRoomId, token);
        } catch (error) {
            console.error("채팅방 생성 실패:", error);
        }
    };

    const closeChatBot = useCallback(() => {
        setIsChatOpen(false);
        setChatRoomId(null);
        setMessages([]);
        if (stompClient) {
            stompClient.deactivate();
            setStompClient(null);
        }
    }, [stompClient]);

    const fetchActiveChatRooms = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await api.get('/api/admin/chatrooms/active', {
                headers: {'Authorization': `Bearer ${token}`}
            });
            setActiveChatRooms(response.data);
        } catch (error) {
            console.error("활성 채팅방 조회 실패:", error);
        }
    };

    const joinChatRoom = async (roomId) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await api.get(`/api/admin/chatrooms/${roomId}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(response.data);
            setChatRoomId(roomId);
            setIsChatOpen(true);
            connectWebSocket(roomId, token);
        } catch (error) {
            console.error("채팅방 참여 실패:", error);
        }
    };

    const sendMessage = async () => {
        if (inputMessage.trim() === '' || !chatRoomId) return;

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            await api.post('/api/chat/message', {
                messageText: inputMessage,
                chatRoomId: chatRoomId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setInputMessage('');
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [stompClient]);

    if (!userRole) return null;

    return (
        <>
            {userRole === 'ADMIN' ? (
                <div className="chatbot-button" onClick={() => { setShowAdminPanel(true); fetchActiveChatRooms(); }}>
                    <button>챗봇 상담 관리</button>
                </div>
            ) : (
                <div className="chatbot-button" onClick={openChatBot}>
                    <button>챗봇 상담</button>
                </div>
            )}

            {showAdminPanel && userRole === 'ADMIN' && (
                <div className="admin-chat-panel">
                    <h2>활성 채팅방 목록</h2>
                    <button onClick={fetchActiveChatRooms}>새로고침</button>
                    <button onClick={() => setShowAdminPanel(false)}>채팅방 목록 닫기</button>
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
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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







// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {useNavigate, useLocation} from 'react-router-dom';
// import axios from 'axios';
// import SockJS from 'sockjs-client';
// import {Stomp} from '@stomp/stompjs';
//
// function ChatBot() {
//     // 페이지 네비게이션을 위한 훅
//     const navigate = useNavigate();
//     // 현재 페이지 위치 정보를 가져오기 위한 훅
//     const location = useLocation();
//     // 오류 상태를 저장하는 상태 변수
//     const [error, setError] = useState(null);
//     // 채팅창 열림/닫힘 상태를 관리하는 상태 변수
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     // 현재 활성화된 채팅방 ID를 저장하는 상태 변수
//     const [chatRoomId, setChatRoomId] = useState(null);
//     // 채팅 메시지 목록을 저장하는 상태 변수
//     const [messages, setMessages] = useState([]);
//     // 메시지 목록의 참조를 저장하는 ref (컴포넌트 리렌더링 없이 값 유지)
//     const messagesRef = useRef([]);
//     // 사용자가 입력 중인 메시지를 저장하는 상태 변수
//     const [inputMessage, setInputMessage] = useState('');
//     // 채팅창의 마지막 요소에 대한 참조 (자동 스크롤을 위해 사용)
//     const messagesEndRef = useRef(null);
//     // WebSocket 클라이언트 객체를 저장하는 상태 변수
//     const [stompClient, setStompClient] = useState(null);
//     // 활성화된 채팅방 목록을 저장하는 상태 변수 (관리자용)
//     const [activeChatRooms, setActiveChatRooms] = useState([]);
//     // 현재 사용자의 역할(관리자/일반 사용자)을 저장하는 상태 변수
//     const [userRole, setUserRole] = useState(null);
//     // 현재 사용자의 ID를 저장하는 상태 변수
//     const [userId, setUserId] = useState(null);
//     // 관리자 패널 표시 여부를 관리하는 상태 변수
//     const [showAdminPanel, setShowAdminPanel] = useState(false);
//
//     // 사용자 권한을 확인하고 설정하는 함수
//     const checkPermission = useCallback(async () => {
//         const token = localStorage.getItem('accessToken');
//         if (!token) {
//             alert("로그인이 필요합니다.");
//             navigate('/login');
//             return;
//         }
//
//         try {
//             const response = await axios.get('/auth/memberinfo', {
//                 headers: {'Authorization': 'Bearer ' + token}
//             });
//             const { memRole, memNum } = response.data;
//             setUserRole(memRole);
//             setUserId(memNum);
//         } catch (error) {
//             console.error('Error fetching user info:', error);
//             alert("오류가 발생했습니다. 다시 로그인해주세요.");
//             navigate('/login');
//         }
//     }, [navigate]);
//
//     // 컴포넌트 마운트 시 사용자 권한 확인
//     useEffect(() => {
//         checkPermission();
//     }, [checkPermission]);
//
//     // 관리자용 채팅 패널을 열고 활성 채팅방 목록을 가져오는 함수
//     const handleAdminChatbotClick = async () => {
//         setShowAdminPanel(true);
//         await fetchActiveChatRooms();
//     };
//
//     // 사용자용 채팅방을 생성하고 여는 함수
//     const openChatBot = async () => {
//         const token = localStorage.getItem('accessToken');
//         if (!token) {
//             alert("로그인이 필요합니다.");
//             navigate('/login');
//             return;
//         }
//
//         try {
//             const response = await axios.post('/api/chatrooms/create', {}, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             const newChatRoomId = response.data.chatRoomId;
//             setChatRoomId(newChatRoomId);
//
//             setMessages([]);
//             messagesRef.current = [];
//             setInputMessage('');
//             setIsChatOpen(true);
//
//             connectWebSocket(newChatRoomId, token);
//         } catch (error) {
//             console.error("채팅방 생성 실패:", error);
//             alert("채팅방을 생성할 수 없습니다.");
//         }
//     };
//
//     // WebSocket 연결을 설정하는 함수
//     const connectWebSocket = (roomId, token) => {
//         if (stompClient) {
//             stompClient.disconnect();
//             setStompClient(null);
//         }
//
//         const socket = new SockJS('/ws');
//         const client = Stomp.over(socket);
//
//         client.connect({'Authorization': `Bearer ${token}`}, () => {
//             console.log(`Connected to WebSocket, subscribing to /topic/chat/${roomId}`);
//
//             client.subscribe(`/topic/chat/${roomId}`, (message) => {
//                 console.log("Received message:", message.body);
//                 const receivedMessage = JSON.parse(message.body);
//                 setMessages(prevMessages => {
//                     const updatedMessages = [...prevMessages];
//                     if (!updatedMessages.some(msg => msg.messageId === receivedMessage.messageId)) {
//                         updatedMessages.push(receivedMessage);
//                     }
//                     messagesRef.current = updatedMessages;
//                     return updatedMessages;
//                 });
//             });
//
//             setStompClient(client);
//         }, (error) => {
//             console.error('WebSocket 연결 실패:', error);
//         });
//     };
//
//     // 채팅방을 닫는 함수
//     const closeChatBot = () => {
//         setIsChatOpen(false);
//         setChatRoomId(null);
//         setMessages([]);
//         messagesRef.current = [];
//         if (stompClient) {
//             stompClient.disconnect();
//             setStompClient(null);
//         }
//     };
//
//     // 활성 채팅방 목록을 가져오는 함수 (관리자용)
//     const fetchActiveChatRooms = async () => {
//         const token = localStorage.getItem('accessToken');
//         try {
//             const response = await axios.get('/api/admin/chatrooms/active', {
//                 headers: {'Authorization': `Bearer ${token}`}
//             });
//             setActiveChatRooms(response.data);
//         } catch (error) {
//             console.error("활성 채팅방 조회 실패:", error);
//         }
//     };
//
//     // 특정 채팅방에 참여하는 함수 (관리자용)
//     const joinChatRoom = async (chatRoomId) => {
//         const token = localStorage.getItem('accessToken');
//         try {
//             const response = await axios.get(`/api/admin/chatrooms/${chatRoomId}/messages`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             setMessages(response.data);
//             messagesRef.current = response.data;
//             setChatRoomId(chatRoomId);
//             setIsChatOpen(true);
//
//             if (stompClient) {
//                 stompClient.disconnect();
//             }
//
//             connectWebSocket(chatRoomId, token);
//         } catch (error) {
//             console.error("채팅방 참여 실패:", error);
//         }
//     };
//
//     // 입력 메시지 변경을 처리하는 함수
//     const handleInputChange = (e) => {
//         setInputMessage(e.target.value);
//     };
//
//     // 메시지를 전송하는 함수
//     const sendMessage = async () => {
//         if (inputMessage.trim() === '') return;
//
//         const token = localStorage.getItem('accessToken');
//         if (!token) {
//             alert("로그인이 필요합니다.");
//             return;
//         }
//
//         try {
//             const response = await axios.post('/api/chat/message', {
//                 messageText: inputMessage,
//                 chatRoomId: chatRoomId
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 }
//             });
//             setInputMessage('');
//
//             const sentMessage = response.data;
//             if (!messagesRef.current.some(msg => msg.messageId === sentMessage.messageId)) {
//                 setMessages(prevMessages => [...prevMessages, sentMessage]);
//                 messagesRef.current = [...messagesRef.current, sentMessage];
//             }
//         } catch (error) {
//             console.error("메시지 전송 실패:", error);
//             alert("메시지를 전송할 수 없습니다.");
//         }
//     };
//
//     // 엔터 키 입력 시 메시지를 전송하는 함수
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             sendMessage();
//         }
//     };
//
//     // 채팅방 ID 변경 시 WebSocket 재연결
//     useEffect(() => {
//         if (chatRoomId && !stompClient?.connected) {
//             const token = localStorage.getItem('accessToken');
//             connectWebSocket(chatRoomId, token);
//         }
//
//         return () => {
//             if (stompClient) {
//                 stompClient.disconnect();
//                 setStompClient(null);
//             }
//         };
//     }, [chatRoomId]);
//
//     // 메시지 목록 업데이트 시 스크롤을 최하단으로 이동
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
//     }, [messages]);
//
//     // 특정 페이지에서 챗봇을 숨기는 함수
//     const isHiddenPath = () => {
//         return location.pathname.startsWith('/Admin') ||
//             location.pathname === '/Login' ||
//             location.pathname === '/SignUp' ||
//             location.pathname === '/FindIdPassword';
//     };
//
//     // 숨겨야 할 페이지면 null 반환 (챗봇 숨김)
//     if (isHiddenPath()) {
//         return null;
//     }
//
//     // 챗봇 UI 렌더링
//     return (
//         <>
//             {/* 사용자 역할에 따라 다른 버튼 표시 */}
//             {userRole === 'ADMIN' ? (
//                 <div className="chatbot-button" onClick={handleAdminChatbotClick}>
//                     <button>챗봇 상담 관리</button>
//                 </div>
//             ) : (
//                 <div className="chatbot-button" onClick={openChatBot}>
//                     <button>챗봇 상담</button>
//                 </div>
//             )}
//
//             {/* 관리자 패널: 활성 채팅방 목록 표시 */}
//             {showAdminPanel && userRole === 'ADMIN' && (
//                 <div className="admin-chat-panel">
//                     <h2>활성 채팅방 목록</h2>
//                     <button onClick={fetchActiveChatRooms}>새로고침</button>
//                     <ul>
//                         {activeChatRooms.map(room => (
//                             <li key={room.chatRoomId}>
//                                 채팅방 ID: {room.chatRoomId} - 사용자: {room.memId}
//                                 <button onClick={() => joinChatRoom(room.chatRoomId)}>참여</button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//
//             {/* 채팅 창: 채팅이 열려있을 때만 표시 */}
//             {isChatOpen && (
//                 <div className="chatbot-window">
//                     {/* 채팅 헤더 */}
//                     <div className="chatbot-header">
//                         {userRole === 'ADMIN' ? (
//                             <>
//                                 <h3>관리자 채팅 -
//                                     사용자: {activeChatRooms.find(room => room.chatRoomId === chatRoomId)?.memId}</h3>
//                             </>
//                         ) : (
//                             <h3>챗봇 상담</h3>
//                         )}
//                         <button onClick={userRole === 'ADMIN' ? () => setIsChatOpen(false) : closeChatBot}>
//                             {userRole === 'ADMIN' ? '나가기' : '닫기'}
//                         </button>
//                     </div>
//                     {/* 메시지 목록 */}
//                     <div className="chatbot-messages">
//                         {messages.map((message, index) => {
//                             const date = message.timeStamp ? new Date(message.timeStamp.replace(' ', 'T')) : null;
//                             const isSelf = message.senderId === userId;
//
//                             return (
//                                 <div key={index} className={`message ${isSelf ? 'self' : 'other'}`}>
//                                     <p>{message.messageText}</p>
//                                     <span className="timestamp">
//                                         {message.timeStamp ? message.timeStamp.toLocaleString() : 'Invalid Date'}
//                                     </span>
//                                 </div>
//                             );
//                         })}
//                         <div ref={messagesEndRef}/>
//                     </div>
//                     {/* 메시지 입력 폼 */}
//                     <div className="chatbot-input">
//                         <input
//                             type="text"
//                             value={inputMessage}
//                             onChange={handleInputChange}
//                             onKeyPress={handleKeyPress}
//                             placeholder="메시지를 입력하세요..."
//                         />
//                         <button onClick={sendMessage}>전송</button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
//
// export default ChatBot;