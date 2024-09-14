import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../store";
import { fetchGetAllNotifications, markNotificationAsRead, deleteNotification } from "../../store/feature/notificationSlice";
import { List, ListItemButton, ListItemText, Divider, Grid, Button } from '@mui/material';


export default function SideBarNotifications() {
  const dispatch: AppDispatch = useDispatch();
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<Set<number>>(new Set());

  const notificationList = useAppSelector((state: RootState) => state.notifications.notifications);
  const status = useAppSelector((state: RootState) => state.notifications.status);

  useEffect(() => {
    console.log("status: ",status);
    if (status === 'idle') {
      dispatch(fetchGetAllNotifications());
    }
  }, [dispatch]); 
  

  const handleToggleSelect = (id: number) => {
    const newSet = new Set(selectedNotificationIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedNotificationIds(newSet);
  };

  const handleMarkAsReadClick = () => {
    selectedNotificationIds.forEach((id) => dispatch(markNotificationAsRead(id)));
    setSelectedNotificationIds(new Set());
  };
  
  const handleDeleteClick = () => {
    selectedNotificationIds.forEach((id) => dispatch(deleteNotification(id)));
    setSelectedNotificationIds(new Set());
  };
  

  return (
    <div style={{ width: '300px', padding: '16px' }}>
      <div style={{ height: 600, overflow: 'auto' }}>
        <List>
          {notificationList.length > 0 ? (
            notificationList.map((notif) => (
              <React.Fragment key={notif.id}>
                <ListItemButton
                  selected={selectedNotificationIds.has(notif.id)}
                  onClick={() => handleToggleSelect(notif.id)}
                >
                  <ListItemText
                    primary={notif.message}
                    secondary={`User ID: ${notif.userId} - ${notif.read ? 'Read' : 'Unread'}`} // Updated field name
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <p>No notifications found</p>
          )}
        </List>
      </div>
      <Grid container spacing={2} style={{ marginTop: '16px' }}>
        <Grid item>
          <Button
            onClick={handleDeleteClick}
            variant="contained"
            color="error"
            disabled={selectedNotificationIds.size === 0}
          >
            Delete
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={handleMarkAsReadClick}
            variant="contained"
            color="secondary"
            disabled={selectedNotificationIds.size === 0}
          >
            Mark as Read
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
