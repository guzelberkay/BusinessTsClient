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
  List, ListItemButton, ListItemText, Divider,
  Button, Typography, Paper, Box, MenuItem,
  Select, InputLabel, FormControl, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Checkbox,
} from "@mui/material";

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  userId: string;
}

export default function SideBarNotifications() {
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
  }, [dispatch, showUnreadOnly]);

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
    <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ width: "100%", padding: 4 }}>
        <Box sx={{ height: 600, overflow: "auto" }}>
          <Typography variant="h6" gutterBottom>
            Bildirimler
          </Typography>

          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="dateDesc">Tarih: Önce En Yeni</MenuItem>
              <MenuItem value="dateAsc">Tarih: Önce En Eski</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={selectionMode}
              onChange={handleSelectionModeToggle}
              sx={{ mr: 2 }}
              disabled={filteredNotifications.length === 0}
            />
            <Typography>Seçim Modu</Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleShowUnreadToggle}
            sx={{ mb: 2, mr: 2 }}
          >
            {showUnreadOnly ? "Tüm Bildirimler" : "Okunmayanlar"}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteClick}
            disabled={selectedNotificationIds.size === 0}
            sx={{ mb: 2 }}
          >
            Seçili Bildirimleri Sil
          </Button>

          <List>
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notif) => (
                <React.Fragment key={notif.id}>
                  <ListItemButton
                    onClick={() => handleNotificationClick(notif)}
                    sx={{
                      backgroundColor: notif.isRead ? 'white' : 'grey.300',
                      borderRadius: 1,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      padding: 1
                    }}
                  >
                    <Checkbox
                      checked={selectedNotificationIds.has(notif.id)}
                      onChange={() => handleToggleSelect(notif.id)}
                      sx={{ mr: 2 }}
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
                Hiçbir bildirim bulunamadı
              </Typography>
            )}
          </List>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedNotification?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            {selectedNotification?.message}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 2 }}
          >
            {selectedNotification &&
              new Date(selectedNotification.createdAt).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Kapat
          </Button>
          <Button
            onClick={() => {
              if (selectedNotification) {
                dispatch(deleteNotification(selectedNotification.id));
                handleClose();
              }
            }}
            color="error"
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
