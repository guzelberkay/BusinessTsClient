import React, { useEffect, useRef, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import { addMessage, clearMessages, setCurrentToken } from '../store/feature/chatSlice'; 
import { useDispatch, useSelector } from 'react-redux';
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
import { AppDispatch, RootState } from '../store'; 

interface ChatMessage {
    id: number;
    senderId: number;
    message: string;
    timestamp: string;
    senderRole: string; // USER or SUPPORTER
}

const UserChat: React.FC = () => {
    const [newMessage, setNewMessage] = useState<string>('');
    const clientRef = useRef<ReturnType<typeof Stomp.over> | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch<AppDispatch>();

    const messages = useSelector((state: RootState) => state.chatSlice.messages);
    const currentToken = useSelector((state: RootState) => state.chatSlice.currentToken);

    useEffect(() => {
        if (token !== currentToken) {
            dispatch(clearMessages()); 
            dispatch(setCurrentToken(token)); 
        }

        clientRef.current = Stomp.over(new WebSocket('ws://localhost:9088/ws'));
        clientRef.current.connect({}, (frame: string) => {
            console.log('Connected: ' + frame);

            clientRef.current?.subscribe('/topic/messages', (stompMessage) => {
                const chatMessage: ChatMessage = JSON.parse(stompMessage.body);
                dispatch(addMessage(chatMessage)); 
            });
        });

        return () => {
            clientRef.current?.disconnect();
        };
    }, [dispatch, token, currentToken]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (newMessage && token && clientRef.current) {
            const chatMessageDTO = {
                token: token,
                message: newMessage,
                senderRole: 'USER',
            };
            clientRef.current.send('/app/sendMessage', {}, JSON.stringify(chatMessageDTO));
            setNewMessage('');
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Canlı Destek</Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                <List>
                    {messages.map((msg) => (
                        <ListItem
                            key={msg.id}
                            sx={{
                                justifyContent: msg.senderRole === 'USER' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <ListItemText
                                primary={msg.message}
                                secondary={formatTimestamp(msg.timestamp)}
                                sx={{
                                    bgcolor: msg.senderRole === 'USER' ? '#d1e7dd' : '#cfe2ff',
                                    borderRadius: 1,
                                    padding: 1,
                                    maxWidth: '75%',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    textAlign: msg.senderRole === 'USER' ? 'right' : 'left',
                                }}
                            />
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, borderTop: '1px solid #ccc' }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ mr: 1 }}
                />
                <Button variant="contained" color="primary" onClick={sendMessage}>
                    Gönder
                </Button>
            </Box>
        </Paper>
    );
};

export default UserChat;
