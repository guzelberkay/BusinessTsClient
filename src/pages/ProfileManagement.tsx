import { Box, Button, Container, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../store';
import { fetchUserInformation } from '../store/feature/userSlice';

function ProfileManagement() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useAppSelector((state) => state.userSlice.user);
    const [firstName, setFirstName] = useState<string>(user.firstName);
    const [lastName, setLastName] = useState<string>(user.lastName);
    const [email, setEmail] = useState<string>(user.email);

    useEffect(() => {
        dispatch(fetchUserInformation());
    }, [dispatch]);
   
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Burada profil güncelleme işlemini gerçekleştirebilirsin
        console.log('Güncellenen Profil Bilgileri:', { firstName, lastName, email });
      };


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
            </Box>
        </Container>
        
        
        </>
    );
  
}

export default ProfileManagement