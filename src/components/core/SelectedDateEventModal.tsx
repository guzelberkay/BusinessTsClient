import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SelectedDateEventModalProps {
  open: boolean;
  onClose: () => void;
  start: string;
  end: string;
  onCreateEvent: (title: string, start: string, end: string) => void; // Yeni prop
}

const SelectedDateEventModal: React.FC<SelectedDateEventModalProps> = ({ open, onClose, start, end, onCreateEvent }) => {
  const [title, setTitle] = useState<string>(''); // Başlık durumu

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Etkinlik Oluştur
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }} // Kapatma butonunu konumlandır
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
      <label style={{ fontSize: '14px',color:'#091057' }}>Başlık</label>
        <TextField
          
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Başlık güncelleme
          sx={{ mb: 2 }} // Alt boşluk
        />
        <Typography variant="body1" component="div">
          Başlangıç Tarihi: {start}
        </Typography>
        <Typography variant="body1" component="div" sx={{ mt: 1 }}>
          Bitiş Tarihi: {end}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            onCreateEvent(title, start, end); // Etkinlik oluşturma fonksiyonu
            setTitle(''); // Başlığı sıfırla
            onClose(); // Modalı kapat
          }}
          disabled={!title} // Başlık boşsa butonu devre dışı bırak
        >
          Etkinlik Oluştur
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default SelectedDateEventModal;
