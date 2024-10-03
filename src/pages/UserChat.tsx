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
    senderRole: string; // USER or SUPPORTER
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

            
            clientRef.current?.subscribe('/topic/messages', (stompMessage) => {
                const chatMessage: ChatMessage = JSON.parse(stompMessage.body);
                setMessages((prevMessages) => [...prevMessages, chatMessage]);
            });
        });

        return () => {
            clientRef.current?.disconnect();
        };
    }, []);

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
        <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', bgcolor: 'background.paper' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Kullanıcı Chat</Typography>
                </Toolbar>
            </AppBar>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2, height: '70vh', overflowY: 'auto' }}>
                <List sx={{ maxHeight: 300, overflowY: 'auto', marginBottom: 2 }}>
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
                                    alignSelf: msg.senderRole === 'USER' ? 'flex-end' : 'flex-start',
                                    textAlign: msg.senderRole === 'USER' ? 'right' : 'left',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Box>
    );
};

export default UserChat;
