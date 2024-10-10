import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  Switch,
  Tooltip,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { fetchRoleList, fetchSaveRole, fetchUpdateRole, fetchUpdateUserRoleStatus } from '../../store/feature/roleSlice';
import { IRole } from '../../model/IRole';
import { AppDispatch, useAppSelector } from '../../store';

function ManageRoles() {
  const [openNewRoleDialog, setOpenNewRoleDialog] = useState(false);
  const [openEditRoleDialog, setOpenEditRoleDialog] = useState(false); 
  const [newRole, setNewRole] = useState({
    roleName: '',
    roleDescription: '',
  });
  const [editRole, setEditRole] = useState<IRole | null>(null); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const dispatch = useDispatch<AppDispatch>();
  const roleList: IRole[] = useAppSelector((state) => state.roleSlice.roleList);

  useEffect(() => {
    dispatch(fetchRoleList());
  }, [dispatch]);

  const handleOpenNewRoleDialog = () => {
    setOpenNewRoleDialog(true);
  };

  const handleCloseNewRoleDialog = () => {
    setOpenNewRoleDialog(false);
    setNewRole({
      roleName: '',
      roleDescription: '',
    });
  };

  const handleOpenEditRoleDialog = (role: IRole) => {
    setEditRole(role); 
    setOpenEditRoleDialog(true);
  };

  const handleCloseEditRoleDialog = () => {
    setOpenEditRoleDialog(false);
    setEditRole(null);
  };

  const handleSaveNewRole = () => {
    dispatch(fetchSaveRole(newRole)).then((data) => {
      if (data.payload.code === 200) {
        dispatch(fetchRoleList());
      }
    });
    handleCloseNewRoleDialog();
  };

  const handleUpdateRole = () => {
    if (editRole) {
      const updatedRole = {
        ...editRole,
        roleId: editRole.roleId,
        roleName: editRole.roleName,
        roleDescription: editRole.roleDescription,
      };
      console.log(updatedRole);
      dispatch(fetchUpdateRole({roleId: updatedRole.roleId, roleName: updatedRole.roleName, roleDescription: updatedRole.roleDescription})).then((data) => {
        if (data.payload.code === 200) {
          dispatch(fetchRoleList());
        }
      });
      handleCloseEditRoleDialog();
    }
  };
  const handleStatusChange = (role: IRole) => {
    if (role.status === 'ACTIVE') {
       dispatch(fetchUpdateUserRoleStatus({ roleId: role.roleId, status: 'INACTIVE' })).then((data) => {
         if (data.payload.code === 200) {
           dispatch(fetchRoleList());
         }
       })
    } else {
       dispatch(fetchUpdateUserRoleStatus({ roleId: role.roleId, status: 'ACTIVE' })).then((data) => {
         if (data.payload.code === 200) {
           dispatch(fetchRoleList());
         }
       })
    }
    
  };

  
  const filteredRoleList = roleList.filter((role) =>
    role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenNewRoleDialog} sx={{ marginBottom: '10px' }}>
        Yeni Rol Ekle
      </Button>

      
      <TextField
        label="Rol ismine göre ara"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ marginBottom: '10px' }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Rol İsmi</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Rol Açıklaması</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Rol Durumu</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Eylemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoleList.map((role, index) => (
              <TableRow key={role.roleId}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                  '&:hover': { backgroundColor: 'primary.light' },
                }}
              >
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{role.roleName}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{role.roleDescription}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{role.status}</TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                    <Tooltip title={role.status === 'ACTIVE' ? 'Rolü Pasifleştir ' : 'Rolü Aktifleştir'}>
                      <Switch
                        checked={role.status === 'ACTIVE'}
                        onChange={() => handleStatusChange(role)}
                        color="success"
                      />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                  <Tooltip title="Düzenle" arrow>
                    <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                      <Button variant="contained" color="secondary" onClick={() => handleOpenEditRoleDialog(role)} sx={{ marginLeft: '5px' }} startIcon={<EditIcon sx={{ marginLeft: '12px' }} />}>
                      </Button>
                    </Box>      
                  </Tooltip>                    
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Yeni Rol Ekleme  */}
      <Dialog open={openNewRoleDialog} onClose={handleCloseNewRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Rol Ekle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Rol İsmi"
              variant="outlined"
              value={newRole.roleName}
              onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Rol Açıklaması"
              variant="outlined"
              value={newRole.roleDescription}
              onChange={(e) => setNewRole({ ...newRole, roleDescription: e.target.value })}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewRoleDialog} color="secondary">Kapat</Button>
          <Button onClick={handleSaveNewRole} color="primary">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Rol Düzenleme */}
      <Dialog open={openEditRoleDialog} onClose={handleCloseEditRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle >Rol Düzenle</DialogTitle>
        <DialogContent>
          {editRole && (
            <>
              <FormControl fullWidth sx={{marginTop: 2, marginBottom: 2 }}>
                <TextField
                  label="Rol İsmi"
                  variant="outlined"
                  value={editRole.roleName}
                  onChange={(e) => setEditRole({ ...editRole, roleName: e.target.value })}
                />
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <TextField
                  label="Rol Açıklaması"
                  variant="outlined"
                  value={editRole.roleDescription}
                  onChange={(e) => setEditRole({ ...editRole, roleDescription: e.target.value })}
                />
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditRoleDialog} color="secondary">Kapat</Button>
          <Button onClick={handleUpdateRole} color="primary">Güncelle</Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}

export default ManageRoles;
