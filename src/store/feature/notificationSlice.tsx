import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import RestApis from '../../config/RestApis';

interface Notification {
  id: number;
  userId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isDeleted: boolean;
}

// State türü
interface NotificationsState {
  notifications: Notification[];
  status: 'idle' | 'loading' | 'failed';
}

// Başlangıç durumu
const initialState: NotificationsState = {
  notifications: [],
  status: 'idle',
};

// Bildirimleri getirme
export const fetchGetAllNotifications = createAsyncThunk(
    'notifications/fetchGetAllNotifications',
    async () => {
      try {
        const response = await fetch(`${RestApis.notification_service}/getallnotifications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response from server:', errorData);
          throw new Error(`Network response was not ok: ${errorData}`);
        }
  
        const data = await response.json();
        console.log('Fetched notifications:', data); // Log the fetched data
        return data as Notification[];
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
      }
    }
  );
  
  

// Bildirimi okuma
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id: number) => {
    try {
      const response = await fetch(`${RestApis.notification_service}/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok: ${errorData}`);
      }
      return id;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }
);

// Bildirimi silme
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: number) => {
    try {
      const response = await fetch(`${RestApis.notification_service}/${id}/delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok: ${errorData}`);
      }
      return id;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }
);

// Slice oluşturma
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetAllNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGetAllNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.status = 'idle';
        state.notifications = action.payload;
      })
      
      .addCase(fetchGetAllNotifications.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<number>) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<number>) => {
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      });
  },
});

export default notificationSlice.reducer;
