import { Box, Button, Container, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppSelector } from '../store';
import { fetchUpdateUser, fetchUserInformation } from '../store/feature/userSlice';
import { fetchChangeMyPassword, fetchLoginProfileManagement } from '../store/feature/authSlice';
import { fetchFile, uploadFile } from '../store/feature/fileSlice';
import FileUploadProps from '../components/molecules/FileUploadProps';

function ProfileManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.userSlice.user);

  // useState ile formdaki değerleri kontrol ediyorsunuz
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const uuid = useSelector((state: RootState) => state.fileSlice.uuid);
  
  

  useEffect(() => {
      dispatch(fetchUserInformation());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
    }
  }, [user]); 
  const handleSubmit = (e: React.FormEvent) => {
      dispatch(fetchUpdateUser({authId: user.authId,firstName, lastName, email})).then((data) => {
          if(data.payload.code==200 ){
              alert('Bilgileriniz Güncellendi')
          } else {
            alert(data.payload.message)
          }
      });
  };
  useEffect(() => {
    if (uuid) { 
        dispatch(fetchFile(uuid))
            .unwrap()
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("Error fetching file:", error);
            });
    }
}, [uuid, dispatch]);
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
        dispatch(uploadFile(files[0]))
             .catch((error) => {
                console.error("Error uploading file:", error);
            });
    }
};

useEffect(() => {
    if (uuid) { 
        dispatch(fetchFile(uuid))
            .unwrap()
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("Error fetching file:", error);
            });
    }
}, [uuid, dispatch]);

  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newPassword!=newConfirmPassword){
      alert('Şifreler uyuşmuyor')
    }
    dispatch(fetchChangeMyPassword({authId: user.authId,newPassword, newConfirmPassword})).then((data) => {
      if(data.payload.code==200 && data.payload.data){
        alert('Şifreniz Başarıyla Değiştirildi')
        setNewPassword('')
        setNewConfirmPassword('')
      } else {
        alert(data.payload.message)
      }
    });
  }
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchLoginProfileManagement({password})).then((data) => {
      if(data.payload.code==200 && data.payload.data){
        setIsAuthenticated(true);
      } else {
        alert('Girdiğiniz Şifre Yanlış')
      }
    });
    
};

  if (!isAuthenticated) {
    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <form onSubmit={handlePasswordSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Şifre"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" color="primary">
                            Profil Bilgilerimi Göster
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}


  return (
        <>
        
        <Container maxWidth="sm">
            <Box mt={4}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                 

                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="primary">
                    Profil Bilgilerimi Güncelle
                  </Button>
                </Box>
                
              </form>

              {imageUrl && (
        <div>
          
          <img src={imageUrl} alt="Uploaded file" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </div>
      )}
            </Box>


                    {/* Dosya Yükleme Bileşeni */}
            <Box mt={4}>
                <FileUploadProps 
                    onFileUpload={handleFileUpload}
                    buttonText="Dosya Yükle"
                    
                />
            </Box>

           
          

            <Box mt={4}>
              <form onSubmit={handleNewPasswordSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Yeni Şifre"
                      variant="outlined"
                      type="password"

                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tekrar Yeni Şifre"
                      type="password"
                      variant="outlined"
                      onChange={(e) => setNewConfirmPassword(e.target.value)}
                    />
                  </Grid>

                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="primary">
                    Şifremi Güncelle
                  </Button>
                </Box>
                
              </form>
            </Box>


        </Container>
        
        
        </>
    );
  
}

export default ProfileManagement;