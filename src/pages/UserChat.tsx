import React, { useEffect, useRef, useState } from 'react';
import { Stomp } from '@stomp/stompjs';

interface ChatMessage {
    id: number;
    senderId: number;
    message: string;
    timestamp: string;
    senderRole: string; 
}

const UserChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const clientRef = useRef<ReturnType<typeof Stomp.over> | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        clientRef.current = Stomp.over(new WebSocket('ws://localhost:9088/ws'));

        clientRef.current.connect({}, (frame: string) => {
            console.log('Connected: ' + frame);

            // Subscribe to receive messages
            clientRef.current?.subscribe('/topic/messages', (stompMessage) => {
                const chatMessage: ChatMessage = JSON.parse(stompMessage.body);
                setMessages((prevMessages) => [...prevMessages, chatMessage]);
            });
        });

        // Clean up on unmount
        return () => {
            clientRef.current?.disconnect();
        };
    }, []);
    
  return (
    <div>UserChat</div>
  )
}

export default UserChat