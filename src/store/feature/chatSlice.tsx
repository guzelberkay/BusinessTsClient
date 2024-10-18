import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
    id: number;
    senderId: number;
    message: string;
    timestamp: string;
    senderRole: string;
}

interface ChatState {
    messages: ChatMessage[];
    currentToken: string | null;
}

const initialState: ChatState = {
    messages: [],
    currentToken: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setCurrentToken: (state, action: PayloadAction<string | null>) => {
            state.currentToken = action.payload; // Mevcut token'ı ayarla
        },
    },
});

export const { addMessage, setMessages, clearMessages, setCurrentToken } = chatSlice.actions;

export default chatSlice.reducer;
