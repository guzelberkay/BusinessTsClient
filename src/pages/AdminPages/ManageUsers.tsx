import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  ListItemText,
  ListItem,
  List,
  Tooltip,
  ListItemButton,
  FormControl,
  Switch
} from '@mui/material';
import { AppDispatch, useAppSelector } from '../../store';
import { useDispatch } from 'react-redux';
import { fetchAddRoleToUser, fetchChangeUserEmail, fetchChangeUserPassword, fetchUpdateUserStatus, fetchUserList } from '../../store/feature/userSlice';
import { IUser } from '../../model/IUser';
import { IRole } from '../../model/IRole';
import { fetchAsiggableRoleList } from '../../store/feature/roleSlice';

function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); // E-posta düzenleme ve Şifre Değiştirme için yeni durum
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [newEmail, setNewEmail] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const userList: IUser[] = useAppSelector((state) => state.userSlice.userList);
  const availableRoles: IRole[] = useAppSelector((state) => state.roleSlice.assigableRoleList);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserList()).then((data) => {
      if (data.payload.code === 200) {
        console.log(data.payload.data);
      }
    });
  }, [dispatch]);

  const filteredUsers = userList.filter(user =>
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (userId: number) => {
    dispatch(fetchAsiggableRoleList(userId)).then((data) => {
      if (data.payload.code === 200) {
        console.log(data.payload.data);
      }
    });
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(0);
    setSelectedRoleId(null);
  };

  const handleOpenConfirmationDialog = (roleId: number) => {
    setSelectedRoleId(roleId);
    setOpenConfirmationDialog(true);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
    setSelectedRoleId(null);
  };

  const handleAddRole = () => {
    if (selectedRoleId !== null) {
      dispatch(fetchAddRoleToUser({ userId: selectedUserId, roleId: selectedRoleId })).then((data) => {
        if (data.payload.code === 200) {
          dispatch(fetchUserList());
        }
      });
    }
    handleCloseDialog();
    handleCloseConfirmationDialog();
  };

  // E-posta düzenleme işlemleri için işlevler
  const handleOpenEditDialog = (user: IUser) => {
    setSelectedUserId(user.id);
    setNewEmail(user.email); // Kullanıcının mevcut e-postasını al
    setOpenEditDialog(true); // E-posta düzenleme pop-up'ını aç
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUserId(0);
    setNewEmail('');
  };

  const handleEditEmail = () => {
    dispatch(fetchChangeUserEmail({ id: selectedUserId, email: newEmail })).then((data) => {
      if (data.payload.code === 200) {
        dispatch(fetchUserList());
      }
    });
    handleCloseEditDialog(); 
  };

  const handleEditPassword = () => {
    dispatch(fetchChangeUserPassword({ userId: selectedUserId, password: newPassword })).then((data) => {
      if (data.payload.code === 200) {
        alert(data.payload.message);
        dispatch(fetchUserList());
        setNewPassword('');
      }
    })
    handleCloseEditDialog(); 
  };

  const handleStatusChange = (user: IUser) => {
    if (user.status === 'ACTIVE') {
        dispatch(fetchUpdateUserStatus({ userId: user.id, status: 'INACTIVE' })).then((data) => {
            if (data.payload.code === 200) {
                dispatch(fetchUserList());
            }
        });
    } else {
        dispatch(fetchUpdateUserStatus({ userId: user.id, status: 'ACTIVE' })).then((data) => {
            if (data.payload.code === 200) {
                dispatch(fetchUserList());
            }
        });
    }
    
  };

  return (
    <div>
      <TextField
        label="Soy isme göre ara"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Soy isim</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Kullanıcı Durumu</TableCell>
              <TableCell>Roller</TableCell>
              <TableCell>Eylemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.userRoles.join(', ')}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    style={{ marginRight: 8 }} 
                    onClick={() => handleOpenDialog(user.id)}
                  >
                    Rol Ekle
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    style={{ marginRight: 8 }} 
                    onClick={() => handleOpenEditDialog(user)} // E-posta düzenleme pop-up'ını aç
                  >
                    Düzenle
                  </Button>
                  <Switch
                    checked={user.status === 'ACTIVE'}
                    onChange={() => handleStatusChange(user)}
                    color="success"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rol Ekleme Pop-up Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Rol Ekle</DialogTitle>
        <DialogContent>
          <List>
            {availableRoles.map((role) => (
              <ListItem key={role.roleId}>
                <Tooltip title={role.roleDescription} placement="right">
                  <ListItemButton onClick={() => handleOpenConfirmationDialog(role.roleId)}>
                    <ListItemText 
                      primary={role.roleName} 
                      secondary={role.roleDescription ? role.roleDescription.slice(0, 50) : 'No description available'} 
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Çık</Button>
        </DialogActions>
      </Dialog>

      {/* Onay Diyaloğu */}
      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Onay</DialogTitle>
        <DialogContent>
          <p>Bu rolü eklemek istediğinize emin misiniz?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="secondary">Hayır</Button>
          <Button onClick={handleAddRole} color="primary">Evet</Button>
        </DialogActions>
      </Dialog>

        {/* E-posta Düzenleme Diyaloğu */}
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseEditDialog} 
          maxWidth="sm" // Genişliği artırmak için maxWidth kullanılıyor
          fullWidth // Genişliği tam olarak doldurmasını sağlar
        >
          <DialogTitle >E-posta Düzenle</DialogTitle>
            <DialogContent >
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                  <TextField
                    label="Yeni E-posta"
                    variant="outlined"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)} 
                  />
                  <Button onClick={handleEditEmail} color="primary">Yeni Maili Kaydet</Button>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
              <TextField
                    label="Yeni Şifre"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} 
                  />
                  <Button onClick={handleEditPassword} color="primary">Yeni Şifreyi Kaydet</Button>
                </FormControl>
            </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">Kapat</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default ManageUsers;


