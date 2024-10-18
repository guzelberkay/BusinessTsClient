import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  DialogActions,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: { title: string; startTime: string; endTime: string; allDay: boolean }) => void;
}

const EventModal: React.FC<EventModalProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [allDay, setAllDay] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // To track form errors

  const handleSubmit = () => {
    // Validate fields
    if (!title || !startTime || !endTime) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    // Validate that startTime is before endTime
    if (new Date(startTime) >= new Date(endTime)) {
      setError('Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.');
      return;
    }

    // No errors, proceed with form submission
    setError(null);
    onSubmit({ title, startTime, endTime, allDay });
    resetForm();
    onClose(); // Close the modal after successful submit
  };

  const resetForm = () => {
    setTitle('');
    setStartTime('');
    setEndTime('');
    setAllDay(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Etkinlik Oluştur
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }} // Position the close button
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>} {/* Show error if present */}
        <label style={{ fontSize: '14px',color:'#091057' }}>Başlık</label>
        <TextField
          autoFocus
          margin="dense"
         
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label style={{ fontSize: '14px',color:'#091057' }}>Başlangıç Tarihi</label>
        <TextField
          margin="dense"
          
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label style={{ fontSize: '14px',color:'#091057' }}>Bitiş Tarihi</label>
        <TextField
          margin="dense"
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Oluştur
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
