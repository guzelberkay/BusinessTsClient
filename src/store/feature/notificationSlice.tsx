import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import RestApis from '../../config/RestApis';

interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isDeleted: boolean;
}

// State type
interface NotificationsState {
  notifications: Notification[];
  status: 'idle' | 'loading' | 'failed';
}

// Initial state
const initialState: NotificationsState = {
  notifications: [],
  status: 'idle',
};

// Fetch all notifications
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
      console.log('Fetched notifications:', data);
      return data as Notification[];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }
);

// Fetch unread notifications
export const fetchGetAllUnreadNotifications = createAsyncThunk(
  'notifications/fetchGetAllUnreadNotifications',
  async () => {
    try {
      const response = await fetch(`${RestApis.notification_service}/getallunreadnotifications`, {
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
      return data as Notification[];
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
      throw error;
    }
  }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id: number) => {
    try {
      const response = await fetch(`${RestApis.notification_service}/read?notificationId=${id}`, {
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

// Delete notification
// Slice - Thunks
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotifications',
  async (notificationIds: number[]) => {
    try {
      const response = await fetch(`${RestApis.notification_service}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationIds),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok: ${errorData}`);
      }
      return notificationIds;
    } catch (error) {
      console.error('Failed to delete notifications:', error);
      throw error;
    }
  }
);


// Slice - Reducers
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
      .addCase(fetchGetAllUnreadNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.status = 'idle';
        state.notifications = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<number>) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.isRead = true;
          console.log("Updated notification to read:", notification);
        }
      })
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<number[]>) => {
        const idsToDelete = new Set(action.payload);
        state.notifications = state.notifications.filter((n) => !idsToDelete.has(n.id));
      });
  },
});

export default notificationSlice.reducer;
