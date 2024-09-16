import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../store";
import {
  fetchGetAllNotifications,
  fetchGetAllUnreadNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../store/feature/notificationSlice";
import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  userId: string;
}

const SideBarNotifications: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState("dateDesc");
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const notificationList = useAppSelector((state: RootState) => state.notifications.notifications);
  const status = useAppSelector((state: RootState) => state.notifications.status);

  useEffect(() => {
    if (status === "idle") {
      if (showUnreadOnly) {
        dispatch(fetchGetAllUnreadNotifications());
      } else {
        dispatch(fetchGetAllNotifications());
      }
    }
  }, [dispatch, showUnreadOnly, status]);

  const handleToggleSelect = (id: number) => {
    if (selectionMode) {
      const newSet = new Set(selectedNotificationIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setSelectedNotificationIds(newSet);
    }
  };

  const handleSelectionModeToggle = () => {
    setSelectionMode(!selectionMode);
    if (!selectionMode) {
      setSelectedNotificationIds(new Set());
    }
  };

  const handleShowUnreadToggle = () => {
    setShowUnreadOnly(!showUnreadOnly);
  };

  const handleDeleteClick = () => {
    if (selectedNotificationIds.size > 0) {
      dispatch(deleteNotification(Array.from(selectedNotificationIds))).then(() => {
        setSelectedNotificationIds(new Set());
        setSelectionMode(false);
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (selectionMode) return;

    setSelectedNotification(notification);
    setOpen(true);
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id)).then(() => {
        const updatedNotification = { ...notification, isRead: true };
        setSelectedNotification(updatedNotification);
      });
    }
  };

  const handleDeleteNotification = () => {
    if (selectedNotification) {
      // Pass an array with a single ID
      dispatch(deleteNotification([selectedNotification.id])).then(() => {
        setOpen(false); // Close dialog after deletion
        setSelectedNotification(null); // Clear selected notification
      }).catch((error) => {
        // Optionally handle errors
        console.error('Failed to delete notification:', error);
      });
    }
  };
  

  const sortedNotifications = [...notificationList].sort((a, b) => {
    switch (sortOrder) {
      case "dateAsc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "dateDesc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const filteredNotifications = sortedNotifications.filter(
    (notif) =>
      (notif.title && notif.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notif.message && notif.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayedNotifications = showUnreadOnly
    ? filteredNotifications.filter(notif => !notif.isRead)
    : filteredNotifications;

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOrder(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ width: "100%", padding: 4, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
        <Typography variant="h5" gutterBottom>
          Notifications
        </Typography>

        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="dateDesc">Date: Newest First</MenuItem>
              <MenuItem value="dateAsc">Date: Oldest First</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Checkbox
              checked={selectionMode}
              onChange={handleSelectionModeToggle}
              disabled={filteredNotifications.length === 0}
            />
            <Typography>Select Mode</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowUnreadToggle}
            >
              {showUnreadOnly ? "Show All Notifications" : "Show Unread Only"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClick}
              disabled={selectedNotificationIds.size === 0}
            >
              Delete Selected
            </Button>
          </Box>
        </Box>

        <List sx={{ overflow: 'auto', maxHeight: '100%' }}>
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notif) => (
              <React.Fragment key={notif.id}>
                <ListItemButton
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    backgroundColor: notif.isRead ? 'background.paper' : 'action.hover',
                    borderRadius: 1,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    padding: 2,
                    '&:hover': {
                      backgroundColor: 'action.selected'
                    }
                  }}
                >
                  <Checkbox
                    checked={selectedNotificationIds.has(notif.id)}
                    onChange={() => handleToggleSelect(notif.id)}
                    disabled={!selectionMode}
                  />
                  <ListItemText
                    primary={notif.title || "No Title"}
                    secondary={new Date(notif.createdAt).toLocaleDateString()}
                    sx={{ color: notif.isRead ? 'text.primary' : 'text.secondary' }}
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No notifications found
            </Typography>
          )}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedNotification?.title}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
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
    </Box>
  );
};

export default SideBarNotifications;
