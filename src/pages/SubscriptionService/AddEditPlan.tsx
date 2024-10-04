import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel,
    SelectChangeEvent
} from '@mui/material';
import { AppDispatch, RootState } from '../../store';
import { fetchFindAllPlans, fetchAddPlan } from '../../store/feature/subscriptionSlice';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { IPlanTranslation } from '../../model/IPlanTranslation';
import { fetchRoleList } from '../../store/feature/roleSlice';

const Subscription: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const plans = useSelector((state: RootState) => state.subscription.planList);
    const roleList = useSelector((state: RootState) => state.roleSlice.roleList);
    const language = useSelector((state: RootState) => state.pageSettings.language);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [planDetails, setPlanDetails] = useState({
        price: '',
        roles: [] as string[],
        planTranslations: [] as IPlanTranslation[],
    });

    useEffect(() => {
        dispatch(fetchFindAllPlans(language));
        dispatch(fetchRoleList());
    }, [dispatch, language]);

    const handleAddPlanOpen = () => {
        setPlanDetails({
            price: '',
            roles: [],
            planTranslations: [{ language, name: '', description: '' }],
        });
        setOpenAddDialog(true);
    };

    const handlePlanDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleTranslationChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newTranslations = [...planDetails.planTranslations];
        newTranslations[index] = { ...newTranslations[index], [name]: value };
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            planTranslations: newTranslations,
        }));
    };

    const handleLanguageChange = (event: SelectChangeEvent<String>, index: number) => {
        const { value } = event.target;
        const newTranslations = [...planDetails.planTranslations];
        newTranslations[index] = { ...newTranslations[index], language: value };
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            planTranslations: newTranslations,
        }));
    };
    
    /**
     * Handles role selection.
     */
    const handleRolesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            roles: event.target.value as string[],
        }));
    };

    const handleAddTranslation = () => {
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            planTranslations: [
                ...prevDetails.planTranslations,
                { language: '', name: '', description: '' },
            ],
        }));
    };

    const handleAddPlan = () => {
        const { price, roles, planTranslations } = planDetails;
        dispatch(
            fetchAddPlan({
                price: parseFloat(price),
                roles,
                planTranslations: planTranslations.map((translation) => ({
                    name: translation.name,
                    description: translation.description,
                    language: translation.language,
                })),
            })
        )
            .then(() => {
                dispatch(fetchFindAllPlans(language));
                setOpenAddDialog(false);
            })
            .catch((error) => {
                Swal.fire('Error', error.message, 'error');
            });
    };

    return (
        <div>
            <Grid container spacing={3} padding={3}>
                {plans.map((plan) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={plan.id}
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                    >
                        <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {plan.name}
                                </Typography>
                                <Typography variant="h6" component="div">
                                    {plan.description}
                                </Typography>
                                <Typography variant="h6" color="text.primary" sx={{ marginTop: 2 }}>
                                    ${plan.price}/month
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 3,
                            width: '100%',
                            backgroundColor: '#f5f5f5',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                        onClick={handleAddPlanOpen}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <AddIcon sx={{ fontSize: '5rem', color: 'primary.main' }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Plan Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>{t('Add New Plan')}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="price"
                        label={t('Price')}
                        fullWidth
                        value={planDetails.price}
                        onChange={handlePlanDetailsChange}
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('Roles')}</InputLabel>
                        <Select
                            multiple
                            value={planDetails.roles}
                            onChange={()=>handleRolesChange}
                        >
                            {roleList.map((role) => (
                                <MenuItem key={role.roleId} value={role.roleName}>
                                    {role.roleName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {planDetails.planTranslations.map((translation, index) => (
                        <div key={index}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>{t('Language')}</InputLabel>
                                <Select
                                    value={translation.language}
                                    onChange={(event) => handleLanguageChange(event, index)}
                                >
                                    <MenuItem value="en">{t('English')}</MenuItem>
                                    <MenuItem value="tr">{t('Turkish')}</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                margin="dense"
                                name="name"
                                label={t('Name')}
                                fullWidth
                                value={translation.name}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleTranslationChange(event, index)}
                            />
                            <TextField
                                margin="dense"
                                name="description"
                                label={t('Description')}
                                fullWidth
                                value={translation.description}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleTranslationChange(event, index)}
                            />
                        </div>
                    ))}

                    <Button onClick={handleAddTranslation} variant="outlined" sx={{ marginTop: 2 }}>
                        {t('Add Translation')}
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>{t('Cancel')}</Button>
                    <Button onClick={handleAddPlan}>{t('Add')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Subscription;
