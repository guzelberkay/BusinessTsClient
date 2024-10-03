import React, { useEffect, useRef, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    AppBar,
    Toolbar,
    TextField,
    Button,
    Paper,
} from '@mui/material';

interface ChatMessage {
    id: number;
    senderId: number;
    message: string;
    timestamp: string;
    senderRole: string; 
}

interface UserMessages {
    userId: number;
    messages: ChatMessage[];
    replyMessage: string;
}

const SupporterChat: React.FC = () => {
    const [userMessages, setUserMessages] = useState<UserMessages[]>([]);
    const clientRef = useRef<ReturnType<typeof Stomp.over> | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        clientRef.current = Stomp.over(new WebSocket('ws://localhost:9088/ws'));

        clientRef.current.connect({}, (frame: string) => {
            console.log('Connected: ' + frame);
            clientRef.current?.subscribe('/topic/messages', (stompMessage) => {
                const chatMessage: ChatMessage = JSON.parse(stompMessage.body);
                setUserMessages((prevUserMessages) => {
                    const userIndex = prevUserMessages.findIndex((um) => um.userId === chatMessage.senderId);
                    if (userIndex === -1) {
                        return [...prevUserMessages, { userId: chatMessage.senderId, messages: [chatMessage], replyMessage: '' }];
                    } else {
                        const updatedMessages = [...prevUserMessages[userIndex].messages, chatMessage];
                        const updatedUserMessages = [...prevUserMessages];
                        updatedUserMessages[userIndex].messages = updatedMessages;
                        return updatedUserMessages;
                    }
                });
            });
        });

        fetchMessages();

        return () => {
            clientRef.current?.disconnect();
        };
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:9088/api/chat/messages');
            const data = await response.json();
            const organizedMessages = data.reduce((acc: UserMessages[], msg: ChatMessage) => {
                const userIndex = acc.findIndex((um) => um.userId === msg.senderId);
                if (userIndex === -1) {
                    acc.push({ userId: msg.senderId, messages: [msg], replyMessage: '' });
                } else {
                    acc[userIndex].messages.push(msg);
                }
                return acc;
            }, []);
            setUserMessages(organizedMessages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const sendReply = (userId: number) => {
        const userIndex = userMessages.findIndex(user => user.userId === userId);
        const replyMessage = userMessages[userIndex]?.replyMessage;

        if (replyMessage && token && clientRef.current) {
            const chatMessageDTO = {
                token: token,
                message: replyMessage,
                senderRole: 'SUPPORTER',
                senderId: userId,
            };
            clientRef.current.send('/app/sendMessage', {}, JSON.stringify(chatMessageDTO));
            setUserMessages((prevUserMessages) => {
                const updatedUserMessages = [...prevUserMessages];
                updatedUserMessages[userIndex].replyMessage = ''; 
                return updatedUserMessages;
            });
        }
    };

    const handleReplyChange = (userId: number, message: string) => {
        setUserMessages((prevUserMessages) => {
            const updatedUserMessages = prevUserMessages.map((user) => {
                if (user.userId === userId) {
                    return { ...user, replyMessage: message };
                }
                return user;
            });
            return updatedUserMessages;
        });
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', bgcolor: 'background.paper' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Temsilci Chat</Typography>
                </Toolbar>
            </AppBar>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2, height: '70vh', overflowY: 'auto' }}>
                {userMessages.map((user) => (
                    <Box key={user.userId} sx={{ bgcolor: 'background.default', borderRadius: 1, padding: 2, boxShadow: 2 }}>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>Kullanıcı ID: {user.userId}</Typography>
                        <List sx={{ maxHeight: 300, overflowY: 'auto', marginBottom: 2 }}>
                            {user.messages.map((msg) => (
                                <ListItem
                                    key={msg.id}
                                    sx={{
                                        justifyContent: msg.senderRole === 'SUPPORTER' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <ListItemText
                                        primary={msg.message}
                                        secondary={formatTimestamp(msg.timestamp)}
                                        sx={{
                                            bgcolor: msg.senderRole === 'SUPPORTER' ? '#d1e7dd' : '#cfe2ff',
                                            borderRadius: 1,
                                            padding: 1,
                                            maxWidth: '75%', 
                                            overflowWrap: 'break-word', 
                                            whiteSpace: 'normal', 
                                            alignSelf: msg.senderRole === 'SUPPORTER' ? 'flex-start' : 'flex-end',
                                            textAlign: msg.senderRole === 'SUPPORTER' ? 'right' : 'left',
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder="Cevabınızı yazın..."
                                value={user.replyMessage}
                                onChange={(e) => handleReplyChange(user.userId, e.target.value)}
                                sx={{ mr: 1 }}
                            />
                            <Button variant="contained" color="primary" onClick={() => sendReply(user.userId)}>
                                Gönder
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default SupporterChat;
