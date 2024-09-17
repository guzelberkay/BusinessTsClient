import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useTranslation } from 'react-i18next';
import { Root } from '../components/core/Root';
import { fetchLogin } from '../store/feature/authSlice';
import { fetchUserRoles } from '../store/feature/userSlice';
import Swal from 'sweetalert2';

export function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({
        email: false,
        password: false,
    });

    const handleSignUp = () => {
        navigate('/register');
    }

    const validateForm = () => {
        const newError = {
            email: !email,
            password: !password,
        };
        setError(newError);

        // Eğer herhangi bir alan boşsa genel hata mesajını göster
        if (newError.email || newError.password) {
            Swal.fire(t('authentication.error'), t('authentication.fillAllFields'), "error");
            return false;
        }

        return true;
    }

    const handleLogin = () => {
        if (validateForm()) {
            dispatch(fetchLogin({ email, password })).then((data) => {
                if (data.payload.code === 200) {
                    localStorage.setItem('token', data.payload.data);
                    
                    dispatch(fetchUserRoles()).then((rolesData) => {
                        const roles = rolesData.payload.data;
                        if (roles.includes('SUPER_ADMIN')) {
                            navigate('/super-admin-dashboard');
                        } else if (roles.includes('ADMIN')) {
                            navigate('/admin-dashboard');
                        } else if (roles.includes('CUSTOMER')) {
                            navigate('/test');
                        } else if (roles.includes("UNASSIGNED")) {
                            Swal.fire(t('authentication.error'), data.payload.message || t('authentication.loginFailed'), 'error');
                        }
                    });
                } else {
                    Swal.fire(t('authentication.error'), data.payload.message || t('authentication.loginFailed'), 'error');
                }
            }).catch((error) => {
                Swal.fire(t('authentication.error'), t('authentication.errorOccurred'), 'error');
            });
        }
    };

    return (
        <Root sx={{ backgroundColor: '#F0EBE3' }}>
            <Box display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ p: 2, backgroundColor: '#F0EBE3', width: '100%' }}>
                <Card sx={{ width: 400, maxWidth: '90%', minHeight: 400, mx: 'auto', mt: 5, borderRadius: 3, backgroundColor: '#F5F7F8', boxShadow: '2px 0px 22px 0px rgba(0,0,0,0.46)' }}>
                    <CardContent>
                        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
                            <Typography variant="h5">{t('navigation.login')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Don’t have an account?
                                <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleSignUp}>
                                    {t('navigation.register')}
                                </Link>
                            </Typography>
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <TextField
                                fullWidth
                                name="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={error.email}
                                helperText={error.email && t('authentication.requiredField')}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    }
                                }}
                            />

                            <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
                                Forgot password?
                            </Link>

                            <TextField
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={error.password}
                                helperText={error.password && t('authentication.requiredField')}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                <Icon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    }
                                }}
                            />

                            <LoadingButton
                                fullWidth
                                size="large"
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleLogin}
                                sx={{
                                    textTransform: 'none',
                                    bgcolor: '#002244',
                                    borderRadius: 3,
                                    marginTop: 3
                                }}
                            >
                                {t('navigation.login')}
                            </LoadingButton>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Root>
    );
}

export default Login;
