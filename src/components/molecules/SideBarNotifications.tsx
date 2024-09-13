import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, Grid } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Veri tipi tanımlamaları
interface Notification {
  id: number;
  notificationType: string;
  notificationText: string;
  isRead: boolean;
  url: string;
}

const columns: GridColDef[] = [
  {
    field: 'notificationType',
    headerName: 'Type',
    flex: 1,
    headerAlign: 'center',
    renderCell: (params) => {
      const colorMap: Record<string, string> = {
        INFO: '#2196F3',
        WARNING: '#FF9800',
        ERROR: '#F44336',
        SUCCESS: '#4CAF50',
        ASSIST: '#673AB7',
      };
      return (
        <div style={{ color: colorMap[params.value] }}>
          {params.value}
        </div>
      );
    },
  },
  {
    field: 'notificationText',
    headerName: 'Text',
    flex: 3,
    headerAlign: 'center',
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // API çağrısı ile bildirimleri çek
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications/123'); // Kullanıcı ID'sini uygun şekilde değiştirin
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleRowClick = (params: any) => {
    if (params.row.url) {
      navigate(params.row.url); // TestPage yönlendirme
    }
  };

  const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
    setSelectedRowIds(newSelectionModel as number[]);
  };

  const handleDeleteClick = async () => {
    if (selectedRowIds.length > 0) {
      try {
        await Promise.all(
          selectedRowIds.map((id) =>
            fetch(`/api/notifications/${id}/delete`, {
              method: 'PATCH',
            })
          )
        );
        const newNotifications = notifications.filter(
          (notif) => !selectedRowIds.includes(notif.id)
        );
        setNotifications(newNotifications);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Notifications deleted successfully.',
          timer: 1500,
        });
      } catch (error) {
        console.error('Error deleting notifications:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error deleting notifications.',
          timer: 1500,
        });
      } finally {
        setSelectedRowIds([]);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No Selection',
        text: 'Please select at least one notification to delete.',
        timer: 1500,
      });
    }
  };

  const handleMarkAsReadClick = async () => {
    if (selectedRowIds.length > 0) {
      try {
        await Promise.all(
          selectedRowIds.map((id) =>
            fetch(`/api/notifications/${id}/read`, {
              method: 'PATCH',
            })
          )
        );
        const updatedNotifications = notifications.map((notif) =>
          selectedRowIds.includes(notif.id) ? { ...notif, isRead: true } : notif
        );
        setNotifications(updatedNotifications);
        Swal.fire({
          icon: 'success',
          title: 'Marked as Read!',
          text: 'Selected notifications marked as read.',
          timer: 1500,
        });
      } catch (error) {
        console.error('Error marking notifications as read:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error marking notifications as read.',
          timer: 1500,
        });
      } finally {
        setSelectedRowIds([]);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No Selection',
        text: 'Please select at least one notification to mark as read.',
        timer: 1500,
      });
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', padding: '0' }}>
      <DataGrid
        rows={notifications}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        onRowClick={handleRowClick}
        rowSelectionModel={selectedRowIds}
        getRowClassName={(params) => (params.row.isRead ? '' : 'MuiDataGrid-row--highlighted')}
        sx={{
          '& .MuiDataGrid-row--highlighted': {
            backgroundColor: '#C8E6C9', // Pale green highlight for unread notifications
          },
        }}
      />
      <Grid container spacing={2} style={{ marginTop: '16px', padding: '0' }}>
        <Grid item>
          <Button
            onClick={handleDeleteClick}
            variant="contained"
            color="error"
            disabled={selectedRowIds.length === 0}
          >
            Delete
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={handleMarkAsReadClick}
            variant="contained"
            color="secondary"
            disabled={selectedRowIds.length === 0}
          >
            Mark as Read
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotificationsPage;
