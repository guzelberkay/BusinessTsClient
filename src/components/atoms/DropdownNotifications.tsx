import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { fetchGetAllNotifications, markNotificationAsRead, deleteNotification } from "../../store/feature/notificationSlice";
import { RootState, AppDispatch } from "../../store";

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  userId: string;
}

const DropdownNotification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    dispatch(fetchGetAllNotifications());
  }, [dispatch]);

  // Sort and slice the notifications
  const sortedNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleClickOpen = (notification: Notification) => {
    setSelectedNotification(notification);
    setOpen(true);
    if (!notification.isRead) {
      // Optional: Mark as read when opening the dialog
      dispatch(markNotificationAsRead(notification.id)).then(() => {
        const updatedNotification = { ...notification, isRead: true };
        setSelectedNotification(updatedNotification);
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
  };


  const handleDeleteNotification = () => {
    if (selectedNotification) {
      dispatch(deleteNotification([selectedNotification.id])).then(() => {
        setOpen(false); 
        setSelectedNotification(null); // Clear selected notification
      }).catch((error) => {
       
        console.error('Failed to delete notification:', error);
      });
    }
  };

  return (
    <div>
      {sortedNotifications.length === 0 ? (
        <MenuItem>
          <ListItemText primary="No notifications" />
        </MenuItem>
      ) : (
        sortedNotifications.map((notification) => (
          <MenuItem key={notification.id} onClick={() => handleClickOpen(notification)}>
            <ListItemText
              primary={notification.title}
              secondary={new Date(notification.createdAt).toLocaleTimeString()}
            />
          </MenuItem>
        ))
      )}
      <Divider />
      <MenuItem component={Link} to="/notifications">
        <Typography variant="body2" color="text.secondary">
          Tüm Bildirimleri Gör
        </Typography>
      </MenuItem>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedNotification?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedNotification?.message}</Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 2 }}
          >
            {selectedNotification && new Date(selectedNotification.createdAt).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            onClick={handleDeleteNotification}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DropdownNotification;
