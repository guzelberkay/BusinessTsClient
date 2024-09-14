import React from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// Example notifications data
const notifications = [
  { id: 1, text: "New message from John", time: "2 minutes ago" },
  { id: 2, text: "Your report is ready", time: "10 minutes ago" },
  { id: 3, text: "Reminder: Team meeting at 3 PM", time: "30 minutes ago" },
  { id: 4, text: "New comment on your post", time: "1 hour ago" },
];

const DropdownNotification: React.FC = () => {
  return (
    <div>
      {notifications.length === 0 ? (
        <MenuItem>
          <ListItemText primary="No notifications" />
        </MenuItem>
      ) : (
        notifications.map((notification) => (
          <MenuItem key={notification.id}>
            <ListItemText
              primary={notification.text}
              secondary={notification.time}
            />
          </MenuItem>
        ))
      )}
      <Divider />
      <MenuItem>
        <Typography variant="body2" color="text.secondary">
          See all notifications
        </Typography>
      </MenuItem>
    </div>
  );
};

export default DropdownNotification;
